import 'dart:convert';
import 'dart:math';

import 'package:flutter/services.dart';

import '../core/models/game_mode.dart';
import '../core/models/question.dart';

class QuestionRepository {
  QuestionRepository({AssetBundle? bundle}) : _bundle = bundle ?? rootBundle;

  final AssetBundle _bundle;
  final Map<String, List<QuizQuestion>> _cache = {};

  // Remember recent questions for the current app session so replaying a mode
  // does not immediately serve the same round again.
  static final List<String> _recentQuestionIds = <String>[];

  static const _mixPacks = <String>[
    'brainrot_mix',
    'characters',
    'slang',
    'emoji',
    'finish_memes',
    'og_memes',
    'quickfire',
  ];

  static const _rushPacks = <String>[
    'quickfire',
    'slang',
    'emoji',
    'brainrot_mix',
  ];

  static const _dailyPacks = <String>[
    'brainrot_mix',
    'characters',
    'slang',
    'emoji',
    'finish_memes',
    'og_memes',
  ];

  Future<List<QuizQuestion>> questionsFor(
    GameMode mode, {
    int count = 10,
  }) async {
    final safeCount = count.clamp(1, 50).toInt();
    final seed = mode == GameMode.daily
        ? DateTime.now().toUtc().difference(DateTime.utc(2024, 1, 1)).inDays
        : DateTime.now().microsecondsSinceEpoch;

    final packNames = switch (mode) {
      GameMode.mix => _mixPacks,
      GameMode.rush => _rushPacks,
      GameMode.daily => _dailyPacks,
      _ => <String>[mode.packName],
    };

    final loaded = await Future.wait(packNames.map(_loadPack));
    final buckets = loaded
        .map((pack) => pack.where(_isPlayable).toList(growable: false))
        .where((pack) => pack.isNotEmpty)
        .toList(growable: false);

    if (buckets.isEmpty) {
      return fallbackQuestions(count: safeCount, seed: seed);
    }

    final avoidRecent = mode != GameMode.daily;
    final selected = buckets.length > 1
        ? _balancedSelect(
            buckets,
            safeCount,
            seed,
            avoidRecent: avoidRecent,
          )
        : _selectUnique(
            buckets.first,
            safeCount,
            seed,
            avoidRecent: avoidRecent,
          );

    final completed = _fillFromFallback(selected, safeCount, seed);
    if (avoidRecent) _remember(completed);
    return completed;
  }

  bool _isPlayable(QuizQuestion question) {
    if (!question.enabled ||
        question.question.trim().isEmpty ||
        question.answers.length < 2 ||
        question.answers.any((answer) => answer.trim().isEmpty) ||
        question.correctAnswer < 0 ||
        question.correctAnswer >= question.answers.length) {
      return false;
    }

    // Never expose a fake audio prompt. Sound questions are allowed only when
    // a real clip is explicitly bundled.
    if (question.questionType == QuestionType.sound) {
      return question.audioAsset?.trim().isNotEmpty == true;
    }

    // Visual question types must actually contain an image.
    if (question.questionType == QuestionType.imageChoice ||
        question.questionType == QuestionType.flash ||
        question.questionType == QuestionType.silhouette ||
        question.questionType == QuestionType.zoom) {
      return question.imageAsset?.trim().isNotEmpty == true;
    }

    return true;
  }

  List<QuizQuestion> _balancedSelect(
    List<List<QuizQuestion>> buckets,
    int count,
    int seed, {
    required bool avoidRecent,
  }) {
    final recent = _recentQuestionIds.toSet();
    final prepared = <List<QuizQuestion>>[];

    for (var index = 0; index < buckets.length; index++) {
      final shuffled = [...buckets[index]]
        ..shuffle(Random(seed + (index + 1) * 104729));
      if (!avoidRecent) {
        prepared.add(shuffled);
        continue;
      }

      final fresh = shuffled.where((q) => !recent.contains(q.id));
      final old = shuffled.where((q) => recent.contains(q.id));
      prepared.add([...fresh, ...old]);
    }

    final positions = List<int>.filled(prepared.length, 0);
    final chosen = <QuizQuestion>[];
    final chosenIds = <String>{};
    var cursor = seed.abs() % prepared.length;

    while (chosen.length < count) {
      var addedThisPass = false;

      for (var step = 0; step < prepared.length; step++) {
        final bucketIndex = (cursor + step) % prepared.length;
        final bucket = prepared[bucketIndex];

        while (positions[bucketIndex] < bucket.length &&
            chosenIds.contains(bucket[positions[bucketIndex]].id)) {
          positions[bucketIndex]++;
        }

        if (positions[bucketIndex] >= bucket.length) continue;

        final question = bucket[positions[bucketIndex]++];
        chosen.add(question);
        chosenIds.add(question.id);
        addedThisPass = true;

        if (chosen.length == count) break;
      }

      if (!addedThisPass) break;
      cursor = (cursor + 1) % prepared.length;
    }

    return chosen;
  }

  List<QuizQuestion> _selectUnique(
    List<QuizQuestion> pool,
    int count,
    int seed, {
    required bool avoidRecent,
  }) {
    final shuffled = [...pool]..shuffle(Random(seed));
    if (avoidRecent) {
      final recent = _recentQuestionIds.toSet();
      final fresh = shuffled.where((q) => !recent.contains(q.id));
      final old = shuffled.where((q) => recent.contains(q.id));
      return [...fresh, ...old].take(count).toList(growable: false);
    }
    return shuffled.take(count).toList(growable: false);
  }

  List<QuizQuestion> _fillFromFallback(
    List<QuizQuestion> selected,
    int count,
    int seed,
  ) {
    if (selected.length >= count) return selected.take(count).toList();

    final result = [...selected];
    final ids = result.map((question) => question.id).toSet();
    final fallback = [..._fallbackBank]..shuffle(Random(seed ^ 0x5f3759df));

    for (final question in fallback) {
      if (result.length >= count) break;
      if (ids.add(question.id)) result.add(question);
    }

    return result.take(count).toList(growable: false);
  }

  void _remember(List<QuizQuestion> questions) {
    for (final question in questions) {
      _recentQuestionIds.remove(question.id);
      _recentQuestionIds.add(question.id);
    }
    const maxRecent = 40;
    if (_recentQuestionIds.length > maxRecent) {
      _recentQuestionIds.removeRange(
        0,
        _recentQuestionIds.length - maxRecent,
      );
    }
  }

  Future<List<QuizQuestion>> _loadPack(String name) async {
    if (_cache.containsKey(name)) return _cache[name]!;
    try {
      final raw = await _bundle
          .loadString('assets/questions/$name.json')
          .timeout(const Duration(seconds: 3));
      final decoded = jsonDecode(raw) as List<dynamic>;
      final questions = decoded
          .whereType<Map<String, dynamic>>()
          .map(QuizQuestion.fromJson)
          .toList(growable: false);
      _cache[name] = questions;
      return questions;
    } catch (_) {
      return const [];
    }
  }

  List<QuizQuestion> fallbackQuestions({
    int count = 10,
    int? seed,
  }) {
    final safeCount = count.clamp(1, _fallbackBank.length).toInt();
    final questions = [..._fallbackBank]
      ..shuffle(Random(seed ?? DateTime.now().microsecondsSinceEpoch));
    return questions.take(safeCount).toList(growable: false);
  }

  static const _fallbackBank = <QuizQuestion>[
    QuizQuestion(
      id: 'fallback-01',
      category: 'internet',
      difficulty: 'easy',
      questionType: QuestionType.text,
      question: 'What does POV stand for?',
      answers: ['Point of view', 'Post on video', 'Proof of value', 'Part of voice'],
      correctAnswer: 0,
    ),
    QuizQuestion(
      id: 'fallback-02',
      category: 'slang',
      difficulty: 'easy',
      questionType: QuestionType.slang,
      question: "What does 'rizz' usually mean?",
      answers: ['A glitch', 'Charisma', 'A dance', 'A snack'],
      correctAnswer: 1,
    ),
    QuizQuestion(
      id: 'fallback-03',
      category: 'slang',
      difficulty: 'easy',
      questionType: QuestionType.slang,
      question: "What does 'sus' mean?",
      answers: ['Successful', 'Sleepy', 'Suspicious', 'Serious'],
      correctAnswer: 2,
    ),
    QuizQuestion(
      id: 'fallback-04',
      category: 'internet',
      difficulty: 'easy',
      questionType: QuestionType.text,
      question: 'What does DM usually mean?',
      answers: ['Daily meme', 'Delete mode', 'Double mention', 'Direct message'],
      correctAnswer: 3,
    ),
    QuizQuestion(
      id: 'fallback-05',
      category: 'slang',
      difficulty: 'easy',
      questionType: QuestionType.slang,
      question: "If something is 'mid', it is...",
      answers: ['Average', 'Secret', 'Amazing', 'Ancient'],
      correctAnswer: 0,
    ),
    QuizQuestion(
      id: 'fallback-06',
      category: 'emoji',
      difficulty: 'easy',
      questionType: QuestionType.emoji,
      question: 'What does 💀 usually mean in comments?',
      answers: ['I am angry', 'That was so funny I am dead', 'I am rich', 'I am sleepy'],
      correctAnswer: 1,
    ),
    QuizQuestion(
      id: 'fallback-07',
      category: 'slang',
      difficulty: 'easy',
      questionType: QuestionType.slang,
      question: "What does 'no cap' mean?",
      answers: ['No hat', 'No chance', 'No lie', 'No sound'],
      correctAnswer: 2,
    ),
    QuizQuestion(
      id: 'fallback-08',
      category: 'internet',
      difficulty: 'medium',
      questionType: QuestionType.text,
      question: 'What does OP usually mean on a forum?',
      answers: ['Online player', 'Open page', 'Official profile', 'Original poster'],
      correctAnswer: 3,
    ),
    QuizQuestion(
      id: 'fallback-09',
      category: 'slang',
      difficulty: 'easy',
      questionType: QuestionType.slang,
      question: "What does a 'W' mean in comments?",
      answers: ['A win', 'A warning', 'Wait', 'Wrong account'],
      correctAnswer: 0,
    ),
    QuizQuestion(
      id: 'fallback-10',
      category: 'internet',
      difficulty: 'medium',
      questionType: QuestionType.text,
      question: 'What does TL;DR mean?',
      answers: ['Talk later; do not reply', "Too long; didn't read", 'Tap link; download ready', 'Try login; data reset'],
      correctAnswer: 1,
    ),
    QuizQuestion(
      id: 'fallback-11',
      category: 'internet',
      difficulty: 'easy',
      questionType: QuestionType.text,
      question: 'What is a meme?',
      answers: ['A private password', 'A bank transfer', 'A shared joke or idea', 'A phone setting'],
      correctAnswer: 2,
    ),
    QuizQuestion(
      id: 'fallback-12',
      category: 'slang',
      difficulty: 'medium',
      questionType: QuestionType.slang,
      question: "What does 'touch grass' suggest?",
      answers: ['Buy a lawn', 'Clean a screen', 'Join a group chat', 'Spend some time offline or outside'],
      correctAnswer: 3,
    ),
    QuizQuestion(
      id: 'fallback-13',
      category: 'slang',
      difficulty: 'medium',
      questionType: QuestionType.slang,
      question: "What does 'glow up' mean?",
      answers: ['A power outage', 'A sunrise', 'A new lamp', 'A big improvement'],
      correctAnswer: 3,
    ),
    QuizQuestion(
      id: 'fallback-14',
      category: 'internet',
      difficulty: 'easy',
      questionType: QuestionType.text,
      question: 'What does a hashtag begin with?',
      answers: ['#', '@', r'$', '&'],
      correctAnswer: 0,
    ),
    QuizQuestion(
      id: 'fallback-15',
      category: 'emoji',
      difficulty: 'easy',
      questionType: QuestionType.emoji,
      question: 'What does 👀 usually suggest online?',
      answers: ['I am asleep', 'I am watching or interested', 'I forgot', 'I am leaving'],
      correctAnswer: 1,
    ),
    QuizQuestion(
      id: 'fallback-16',
      category: 'slang',
      difficulty: 'medium',
      questionType: QuestionType.slang,
      question: "What does 'caught in 4K' mean?",
      answers: ['Streaming a movie', 'Using four accounts', 'Clearly exposed doing something', 'Filmed on an old camera'],
      correctAnswer: 2,
    ),
    QuizQuestion(
      id: 'fallback-17',
      category: 'internet',
      difficulty: 'medium',
      questionType: QuestionType.text,
      question: 'What does AFK stand for?',
      answers: ['Ask for key', 'Active for keeps', 'Away from kids', 'Away from keyboard'],
      correctAnswer: 3,
    ),
    QuizQuestion(
      id: 'fallback-18',
      category: 'slang',
      difficulty: 'easy',
      questionType: QuestionType.slang,
      question: "What does 'L' usually mean online?",
      answers: ['Loss', 'Link', 'Like', 'Live'],
      correctAnswer: 0,
    ),
    QuizQuestion(
      id: 'fallback-19',
      category: 'internet',
      difficulty: 'medium',
      questionType: QuestionType.text,
      question: "What does 'lurking' mean online?",
      answers: ['Going live', 'Reading without posting much', 'Blocking everyone', 'Deleting an account'],
      correctAnswer: 1,
    ),
    QuizQuestion(
      id: 'fallback-20',
      category: 'emoji',
      difficulty: 'medium',
      questionType: QuestionType.emoji,
      question: 'What does 🚩 usually mean in relationship talk?',
      answers: ['A date idea', 'A compliment', 'A warning sign', 'A joke'],
      correctAnswer: 2,
    ),
  ];
}
