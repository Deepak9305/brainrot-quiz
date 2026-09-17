import 'package:flutter/services.dart';

class AudioService {
  Future<void> playTap({
    required bool hapticsEnabled,
    required bool soundEnabled,
  }) async {
    if (soundEnabled) await SystemSound.play(SystemSoundType.click);
    if (hapticsEnabled) await HapticFeedback.selectionClick();
  }

  Future<void> playCorrect({
    required bool hapticsEnabled,
    required bool soundEnabled,
  }) async {
    if (soundEnabled) await SystemSound.play(SystemSoundType.click);
    if (hapticsEnabled) await HapticFeedback.lightImpact();
  }

  Future<void> playWrong({
    required bool hapticsEnabled,
    required bool soundEnabled,
  }) async {
    if (soundEnabled) await SystemSound.play(SystemSoundType.alert);
    if (hapticsEnabled) await HapticFeedback.mediumImpact();
  }
}
