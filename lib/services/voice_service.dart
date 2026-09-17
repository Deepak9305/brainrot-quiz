import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

class VoiceService {
  static const _channel = MethodChannel('brainrot_quiz/voice');

  Future<bool> speak(
    String text, {
    double pitch = 1,
    double rate = 1,
  }) async {
    if (kIsWeb || text.trim().isEmpty) return false;
    try {
      final result = await _channel.invokeMethod<bool>('speak', {
        'text': text,
        'pitch': pitch.clamp(0.7, 1.4),
        'rate': rate.clamp(0.7, 1.35),
      });
      return result ?? false;
    } on PlatformException catch (_) {
      return false;
    } on MissingPluginException {
      return false;
    }
  }

  Future<void> stop() async {
    if (kIsWeb) return;
    try {
      await _channel.invokeMethod<void>('stop');
    } on PlatformException catch (_) {
      // Voice prompts are optional; do not crash the quiz if TTS is unavailable.
    } on MissingPluginException {
      // Unsupported platform.
    }
  }
}
