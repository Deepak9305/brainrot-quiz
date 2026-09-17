import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../core/models/player_progress.dart';

class StorageService {
  StorageService(this._preferences);

  static const _progressKey = 'brainrot_progress_v2';
  final SharedPreferences _preferences;

  PlayerProgress loadProgress() {
    final raw = _preferences.getString(_progressKey);
    if (raw == null) return const PlayerProgress();
    try {
      return PlayerProgress.fromJson(jsonDecode(raw) as Map<String, dynamic>);
    } catch (_) {
      return const PlayerProgress();
    }
  }

  Future<void> saveProgress(PlayerProgress progress) =>
      _preferences.setString(_progressKey, jsonEncode(progress.toJson()));

  Future<void> clear() => _preferences.remove(_progressKey);
}
