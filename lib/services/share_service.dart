import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

class ShareService {
  static const _channel = MethodChannel('brainrot_quiz/share');

  Future<bool> shareText(String text) async {
    if (kIsWeb) {
      try {
        await Clipboard.setData(ClipboardData(text: text));
        return true;
      } on PlatformException catch (_) {
        return false;
      }
    }
    try {
      final result = await _channel.invokeMethod<bool>('shareText', {
        'text': text,
      });
      return result ?? false;
    } on PlatformException catch (_) {
      return false;
    } on MissingPluginException {
      return false;
    }
  }
}
