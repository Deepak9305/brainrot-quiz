enum QuestionType {
  imageChoice,
  text,
  sound,
  flash,
  finishMeme,
  emoji,
  slang,
  silhouette,
  zoom,
}

QuestionType questionTypeFromJson(String value) => switch (value) {
  'imageChoice' => QuestionType.imageChoice,
  'sound' => QuestionType.sound,
  'flash' => QuestionType.flash,
  'finishMeme' => QuestionType.finishMeme,
  'emoji' => QuestionType.emoji,
  'slang' => QuestionType.slang,
  'silhouette' => QuestionType.silhouette,
  'zoom' => QuestionType.zoom,
  _ => QuestionType.text,
};

class QuizQuestion {
  const QuizQuestion({
    required this.id,
    required this.category,
    required this.difficulty,
    required this.questionType,
    required this.question,
    required this.answers,
    required this.correctAnswer,
    this.imageAsset,
    this.audioAsset,
    this.visualText,
    this.spokenPrompt,
    this.voicePitch = 1,
    this.voiceRate = 1,
    this.explanation,
    this.tags = const [],
    this.weight = 1,
    this.enabled = true,
  });

  final String id;
  final String category;
  final String difficulty;
  final QuestionType questionType;
  final String question;
  final List<String> answers;
  final int correctAnswer;
  final String? imageAsset;
  final String? audioAsset;
  final String? visualText;
  final String? spokenPrompt;
  final double voicePitch;
  final double voiceRate;
  final String? explanation;
  final List<String> tags;
  final int weight;
  final bool enabled;

  factory QuizQuestion.fromJson(Map<String, dynamic> json) {
    final answers = (json['answers'] as List<dynamic>? ?? const [])
        .map((answer) => answer.toString())
        .toList(growable: false);
    final rawIndex = (json['correctAnswer'] as num?)?.toInt() ?? 0;
    return QuizQuestion(
      id: json['id']?.toString() ?? 'unknown',
      category: json['category']?.toString() ?? 'mix',
      difficulty: json['difficulty']?.toString() ?? 'easy',
      questionType: questionTypeFromJson(
        json['questionType']?.toString() ?? 'text',
      ),
      question: json['question']?.toString() ?? 'What is this?',
      answers: answers.length >= 2 ? answers : const ['Locked in', 'Cooked'],
      correctAnswer: rawIndex.clamp(
        0,
        answers.isEmpty ? 0 : answers.length - 1,
      ),
      imageAsset: json['imageAsset']?.toString(),
      audioAsset: json['audioAsset']?.toString(),
      visualText: json['visualText']?.toString(),
      spokenPrompt: json['spokenPrompt']?.toString(),
      voicePitch: (json['voicePitch'] as num?)?.toDouble() ?? 1,
      voiceRate: (json['voiceRate'] as num?)?.toDouble() ?? 1,
      explanation: json['explanation']?.toString(),
      tags: (json['tags'] as List<dynamic>? ?? const [])
          .map((tag) => tag.toString())
          .toList(),
      weight: (json['weight'] as num?)?.toInt() ?? 1,
      enabled: json['enabled'] as bool? ?? true,
    );
  }

  QuizQuestion copyWith({String? id}) => QuizQuestion(
    id: id ?? this.id,
    category: category,
    difficulty: difficulty,
    questionType: questionType,
    question: question,
    answers: answers,
    correctAnswer: correctAnswer,
    imageAsset: imageAsset,
    audioAsset: audioAsset,
    visualText: visualText,
    spokenPrompt: spokenPrompt,
    voicePitch: voicePitch,
    voiceRate: voiceRate,
    explanation: explanation,
    tags: tags,
    weight: weight,
    enabled: enabled,
  );
}
