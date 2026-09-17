class PlayerProgress {
  const PlayerProgress({
    this.coins = 0,
    this.xp = 0,
    this.level = 1,
    this.currentStreak = 0,
    this.bestScore = 0,
    this.dailyStreak = 0,
    this.lastPlayedDate,
    this.seenIntro = false,
    this.soundEffects = true,
    this.voiceReactions = true,
    this.music = true,
    this.haptics = true,
    this.reduceMotion = false,
    this.dailyCompletedDate,
    this.dailyScore,
    this.completedQuizzes = 0,
    this.lifetimeCoinsEarned = 0,
    this.achievements = const {},
  });

  final int coins;
  final int xp;
  final int level;
  final int currentStreak;
  final int bestScore;
  final int dailyStreak;
  final String? lastPlayedDate;
  final bool seenIntro;
  final bool soundEffects;
  final bool voiceReactions;
  final bool music;
  final bool haptics;
  final bool reduceMotion;
  final String? dailyCompletedDate;
  final int? dailyScore;
  final int completedQuizzes;
  final int lifetimeCoinsEarned;
  final Map<String, bool> achievements;

  int get xpForNextLevel => 4000 + ((level - 1) * 500);

  PlayerProgress copyWith({
    int? coins,
    int? xp,
    int? level,
    int? currentStreak,
    int? bestScore,
    int? dailyStreak,
    String? lastPlayedDate,
    bool? seenIntro,
    bool? soundEffects,
    bool? voiceReactions,
    bool? music,
    bool? haptics,
    bool? reduceMotion,
    String? dailyCompletedDate,
    int? dailyScore,
    int? completedQuizzes,
    int? lifetimeCoinsEarned,
    Map<String, bool>? achievements,
  }) {
    return PlayerProgress(
      coins: coins ?? this.coins,
      xp: xp ?? this.xp,
      level: level ?? this.level,
      currentStreak: currentStreak ?? this.currentStreak,
      bestScore: bestScore ?? this.bestScore,
      dailyStreak: dailyStreak ?? this.dailyStreak,
      lastPlayedDate: lastPlayedDate ?? this.lastPlayedDate,
      seenIntro: seenIntro ?? this.seenIntro,
      soundEffects: soundEffects ?? this.soundEffects,
      voiceReactions: voiceReactions ?? this.voiceReactions,
      music: music ?? this.music,
      haptics: haptics ?? this.haptics,
      reduceMotion: reduceMotion ?? this.reduceMotion,
      dailyCompletedDate: dailyCompletedDate ?? this.dailyCompletedDate,
      dailyScore: dailyScore ?? this.dailyScore,
      completedQuizzes: completedQuizzes ?? this.completedQuizzes,
      lifetimeCoinsEarned: lifetimeCoinsEarned ?? this.lifetimeCoinsEarned,
      achievements: achievements ?? this.achievements,
    );
  }

  Map<String, dynamic> toJson() => {
    'coins': coins,
    'xp': xp,
    'level': level,
    'currentStreak': currentStreak,
    'bestScore': bestScore,
    'dailyStreak': dailyStreak,
    'lastPlayedDate': lastPlayedDate,
    'seenIntro': seenIntro,
    'soundEffects': soundEffects,
    'voiceReactions': voiceReactions,
    'music': music,
    'haptics': haptics,
    'reduceMotion': reduceMotion,
    'dailyCompletedDate': dailyCompletedDate,
    'dailyScore': dailyScore,
    'completedQuizzes': completedQuizzes,
    'lifetimeCoinsEarned': lifetimeCoinsEarned,
    'achievements': achievements,
  };

  factory PlayerProgress.fromJson(Map<String, dynamic> json) => PlayerProgress(
    coins: (json['coins'] as num?)?.toInt() ?? 0,
    xp: (json['xp'] as num?)?.toInt() ?? 0,
    level: (json['level'] as num?)?.toInt() ?? 1,
    currentStreak: (json['currentStreak'] as num?)?.toInt() ?? 0,
    bestScore: (json['bestScore'] as num?)?.toInt() ?? 0,
    dailyStreak: (json['dailyStreak'] as num?)?.toInt() ?? 0,
    lastPlayedDate: json['lastPlayedDate']?.toString(),
    seenIntro: json['seenIntro'] as bool? ?? false,
    soundEffects: json['soundEffects'] as bool? ?? true,
    voiceReactions: json['voiceReactions'] as bool? ?? true,
    music: json['music'] as bool? ?? true,
    haptics: json['haptics'] as bool? ?? true,
    reduceMotion: json['reduceMotion'] as bool? ?? false,
    dailyCompletedDate: json['dailyCompletedDate']?.toString(),
    dailyScore: (json['dailyScore'] as num?)?.toInt(),
    completedQuizzes: (json['completedQuizzes'] as num?)?.toInt() ?? 0,
    lifetimeCoinsEarned: (json['lifetimeCoinsEarned'] as num?)?.toInt() ?? 0,
    achievements: Map<String, bool>.from(
      json['achievements'] as Map? ?? const {},
    ),
  );
}
