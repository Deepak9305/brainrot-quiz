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
    this.ownedThemes = const ['acid'],
    this.equippedTheme = 'acid',
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
  final List<String> ownedThemes;
  final String equippedTheme;

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
    List<String>? ownedThemes,
    String? equippedTheme,
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
      ownedThemes: ownedThemes ?? this.ownedThemes,
      equippedTheme: equippedTheme ?? this.equippedTheme,
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
    'ownedThemes': ownedThemes,
    'equippedTheme': equippedTheme,
  };

  factory PlayerProgress.fromJson(Map<String, dynamic> json) {
    final rawOwned = json['ownedThemes'];
    final owned = rawOwned is List
        ? rawOwned
            .map((value) => value.toString().trim())
            .where((value) => value.isNotEmpty)
            .toSet()
            .toList(growable: false)
        : <String>['acid'];
    final normalizedOwned = owned.contains('acid')
        ? owned
        : <String>['acid', ...owned];
    final requestedTheme = json['equippedTheme']?.toString() ?? 'acid';

    final achievements = <String, bool>{};
    final rawAchievements = json['achievements'];
    if (rawAchievements is Map) {
      for (final entry in rawAchievements.entries) {
        final key = entry.key.toString();
        final value = entry.value;
        final parsed = switch (value) {
          bool flag => flag,
          num number => number != 0,
          String text => text.toLowerCase() == 'true' || text == '1',
          _ => false,
        };
        achievements[key] = parsed;
      }
    }

    return PlayerProgress(
      coins: _nonNegativeInt(json['coins']),
      xp: _nonNegativeInt(json['xp']),
      level: _positiveInt(json['level'], fallback: 1),
      currentStreak: _nonNegativeInt(json['currentStreak']),
      bestScore: _nonNegativeInt(json['bestScore']),
      dailyStreak: _nonNegativeInt(json['dailyStreak']),
      lastPlayedDate: json['lastPlayedDate']?.toString(),
      seenIntro: _boolValue(json['seenIntro'], fallback: false),
      soundEffects: _boolValue(json['soundEffects'], fallback: true),
      voiceReactions: _boolValue(json['voiceReactions'], fallback: true),
      music: _boolValue(json['music'], fallback: true),
      haptics: _boolValue(json['haptics'], fallback: true),
      reduceMotion: _boolValue(json['reduceMotion'], fallback: false),
      dailyCompletedDate: json['dailyCompletedDate']?.toString(),
      dailyScore: json['dailyScore'] == null
          ? null
          : _nonNegativeInt(json['dailyScore']),
      completedQuizzes: _nonNegativeInt(json['completedQuizzes']),
      lifetimeCoinsEarned: _nonNegativeInt(json['lifetimeCoinsEarned']),
      achievements: achievements,
      ownedThemes: normalizedOwned,
      equippedTheme: normalizedOwned.contains(requestedTheme)
          ? requestedTheme
          : 'acid',
    );
  }

  static int _nonNegativeInt(Object? value) {
    final number = value is num ? value.toInt() : int.tryParse('$value');
    if (number == null || number < 0) return 0;
    return number;
  }

  static int _positiveInt(Object? value, {required int fallback}) {
    final number = value is num ? value.toInt() : int.tryParse('$value');
    if (number == null || number < 1) return fallback;
    return number;
  }

  static bool _boolValue(Object? value, {required bool fallback}) {
    if (value is bool) return value;
    if (value is num) return value != 0;
    if (value is String) {
      final normalized = value.toLowerCase().trim();
      if (normalized == 'true' || normalized == '1') return true;
      if (normalized == 'false' || normalized == '0') return false;
    }
    return fallback;
  }
}
