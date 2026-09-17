import 'dart:convert';
import 'dart:math';

import 'package:flutter/services.dart';

import '../core/models/game_mode.dart';
import '../core/models/question.dart';

class QuestionRepository {
  QuestionRepository({AssetBundle? bundle}) : _bundle = bundle ?? rootBundle;

  final AssetBundle _bundle;
  final Map<String, List<QuizQuestion>> _cache = {};

  Future<List<QuizQuestion>> questionsFor(
    GameMode mode, {
    int count = 10,
  }) async {
    final pack = await _loadPack(mode.packName);
    final enabled = pack.where((question) => question.enabled).toList();
    final modeQuestions = switch (mode) {
      GameMode.guessSound =>
        enabled
            .where((question) => question.questionType == QuestionType.sound)
            .toList(),
      GameMode.oneSecond =>
        enabled
            .where((question) => question.questionType == QuestionType.flash)
            .toList(),
      GameMode.slang =>
        enabled
            .where((question) => question.questionType == QuestionType.slang)
            .toList(),
      GameMode.finishMeme =>
        enabled
            .where(
              (question) => question.questionType == QuestionType.finishMeme,
            )
            .toList(),
      _ => enabled,
    };
    final pool = modeQuestions.isEmpty ? enabled : modeQuestions;
    if (pool.isEmpty) return _fallback(count);

    final seed = mode == GameMode.daily
        ? DateTime.now().toUtc().difference(DateTime.utc(2024, 1, 1)).inDays
        : DateTime.now().microsecondsSinceEpoch;
    final shuffled = [...pool]..shuffle(Random(seed));
    return List.generate(count, (index) {
      final question = shuffled[index % shuffled.length];
      return index < shuffled.length
          ? question
          : question.copyWith(id: '${question.id}-$index');
    });
  }

  Future<List<QuizQuestion>> _loadPack(String name) async {
    if (_cache.containsKey(name)) return _cache[name]!;
    try {
      // Bundled content must never leave gameplay waiting forever if a web
      // asset request is interrupted or a platform asset channel is slow.
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

  List<QuizQuestion> _fallback(int count) => List.generate(
    count,
    (index) => QuizQuestion(
      id: 'fallback-$index',
      category: 'mix',
      difficulty: 'easy',
      questionType: QuestionType.text,
      question: 'How cooked are you?',
      answers: const ['Locked in', 'Cooked', 'Touching grass', 'Beyond saving'],
      correctAnswer: 0,
    ),
  );

  List<QuizQuestion> fallbackQuestions({int count = 10}) => _fallback(count);
}
