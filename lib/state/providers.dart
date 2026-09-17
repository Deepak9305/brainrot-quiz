import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/models/player_progress.dart';
import '../services/ads_service.dart';
import '../services/analytics_service.dart';
import '../services/audio_service.dart';
import '../services/storage_service.dart';

final storageServiceProvider = Provider<StorageService>((ref) {
  throw UnimplementedError('StorageService must be overridden in main.dart');
});

final analyticsServiceProvider = Provider<AnalyticsService>(
  (ref) => LocalAnalyticsService(),
);
final audioServiceProvider = Provider<AudioService>((ref) => AudioService());
final adsServiceProvider = Provider<AdsService>((ref) => AdMobAdsService());

final progressProvider = NotifierProvider<ProgressNotifier, PlayerProgress>(
  ProgressNotifier.new,
);

class ProgressNotifier extends Notifier<PlayerProgress> {
  late final StorageService _storage;

  @override
  PlayerProgress build() {
    _storage = ref.read(storageServiceProvider);
    return _storage.loadProgress();
  }

  void markIntroSeen() => _update(state.copyWith(seenIntro: true));

  void setSetting(String setting, bool value) {
    final next = switch (setting) {
      'soundEffects' => state.copyWith(soundEffects: value),
      'voiceReactions' => state.copyWith(voiceReactions: value),
      'music' => state.copyWith(music: value),
      'haptics' => state.copyWith(haptics: value),
      'reduceMotion' => state.copyWith(reduceMotion: value),
      _ => state,
    };
    _update(next);
  }

  void completeQuiz({
    required int score,
    required int correct,
    required int bestStreak,
    bool daily = false,
  }) {
    final now = DateTime.now();
    final today = _dateKey(now);
    final yesterday = _dateKey(now.subtract(const Duration(days: 1)));

    final nextCurrentStreak = state.lastPlayedDate == today
        ? state.currentStreak
        : state.lastPlayedDate == yesterday
            ? state.currentStreak + 1
            : 1;

    final nextDailyStreak = !daily
        ? state.dailyStreak
        : state.dailyCompletedDate == today
            ? state.dailyStreak
            : state.dailyCompletedDate == yesterday
                ? state.dailyStreak + 1
                : 1;

    final coinReward = 80 + (correct * 35) + (bestStreak * 10);
    final xpReward = 100 + (correct * 45);
    var nextXp = state.xp + xpReward;
    var nextLevel = state.level;
    var levelThreshold = state.xpForNextLevel;

    while (nextXp >= levelThreshold) {
      nextXp -= levelThreshold;
      nextLevel += 1;
      levelThreshold = 4000 + ((nextLevel - 1) * 500);
    }

    final completedQuizzes = state.completedQuizzes + 1;
    final lifetimeCoinsEarned = state.lifetimeCoinsEarned + coinReward;
    final nextAchievements = {...state.achievements};

    if (completedQuizzes >= 1) nextAchievements['first_brain_cell'] = true;
    if (correct >= 10) nextAchievements['perfect'] = true;
    if (correct == 0) nextAchievements['zero'] = true;
    if (bestStreak >= 10) nextAchievements['locked_in'] = true;
    if (nextDailyStreak >= 7) nextAchievements['touch_grass'] = true;
    if (completedQuizzes >= 100) nextAchievements['terminally_online'] = true;
    if (lifetimeCoinsEarned >= 10000) nextAchievements['aura_farmer'] = true;

    _update(
      state.copyWith(
        coins: state.coins + coinReward,
        xp: nextXp,
        level: nextLevel,
        bestScore: score > state.bestScore ? score : state.bestScore,
        currentStreak: nextCurrentStreak,
        dailyStreak: nextDailyStreak,
        lastPlayedDate: today,
        dailyCompletedDate: daily ? today : state.dailyCompletedDate,
        dailyScore: daily ? correct : state.dailyScore,
        completedQuizzes: completedQuizzes,
        lifetimeCoinsEarned: lifetimeCoinsEarned,
        achievements: nextAchievements,
      ),
    );
  }

  void addCoins(int amount) {
    final nextCoins = (state.coins + amount).clamp(0, 1 << 31);
    _update(state.copyWith(coins: nextCoins));
  }

  bool buyTheme(String id, int price) {
    if (state.ownedThemes.contains(id)) {
      equipTheme(id);
      return true;
    }
    if (price < 0 || state.coins < price) return false;

    _update(
      state.copyWith(
        coins: state.coins - price,
        ownedThemes: [...state.ownedThemes, id],
        equippedTheme: id,
      ),
    );
    return true;
  }

  void equipTheme(String id) {
    if (!state.ownedThemes.contains(id) || state.equippedTheme == id) return;
    _update(state.copyWith(equippedTheme: id));
  }

  void unlockAchievement(String id) {
    if (state.achievements[id] == true) return;
    _update(state.copyWith(achievements: {...state.achievements, id: true}));
  }

  Future<void> resetProgress() async {
    await _storage.clear();
    state = const PlayerProgress();
  }

  void _update(PlayerProgress next) {
    state = next;
    _storage.saveProgress(next);
  }

  String _dateKey(DateTime date) =>
      '${date.year.toString().padLeft(4, '0')}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
}
