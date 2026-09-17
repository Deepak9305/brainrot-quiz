import 'package:flutter/material.dart';

enum GameMode {
  mix,
  italianBrainrot,
  guessSound,
  oneSecond,
  slang,
  finishMeme,
  ogBrainrot,
  impossible,
  daily,
  rush,
}

extension GameModeDetails on GameMode {
  String get title => switch (this) {
    GameMode.mix => 'Brainrot Mix',
    GameMode.italianBrainrot => 'Viral Characters',
    GameMode.guessSound => 'Emoji Decode',
    GameMode.oneSecond => 'Quickfire',
    GameMode.slang => 'Slang Test',
    GameMode.finishMeme => 'Finish the Meme',
    GameMode.ogBrainrot => 'OG Internet',
    GameMode.impossible => 'Impossible Mode',
    GameMode.daily => 'Daily Brainrot',
    GameMode.rush => 'Brainrot Rush',
  };

  String get subtitle => switch (this) {
    GameMode.mix => 'Memes, slang, characters and internet culture',
    GameMode.italianBrainrot => 'Doge, Pepe, viral faces and brainrot characters',
    GameMode.guessSound => 'Read the reaction without words',
    GameMode.oneSecond => 'Short questions. Fast decisions.',
    GameMode.slang => 'Do you speak fluent internet?',
    GameMode.finishMeme => 'Complete the classic line',
    GameMode.ogBrainrot => 'Classic internet culture',
    GameMode.impossible => 'Hard mode for terminally online people',
    GameMode.daily => 'A fresh mixed challenge every day',
    GameMode.rush => '60 seconds. Keep moving.',
  };

  IconData get icon => switch (this) {
    GameMode.mix => Icons.psychology_alt_rounded,
    GameMode.italianBrainrot => Icons.people_alt_outlined,
    GameMode.guessSound => Icons.emoji_emotions_outlined,
    GameMode.oneSecond => Icons.bolt_rounded,
    GameMode.slang => Icons.chat_bubble_outline_rounded,
    GameMode.finishMeme => Icons.format_quote_rounded,
    GameMode.ogBrainrot => Icons.history_rounded,
    GameMode.impossible => Icons.dangerous_outlined,
    GameMode.daily => Icons.calendar_today_rounded,
    GameMode.rush => Icons.timer_outlined,
  };

  Color get accent => switch (this) {
    GameMode.mix => const Color(0xFFFF2D92),
    GameMode.italianBrainrot => const Color(0xFF3D9BFF),
    GameMode.guessSound => const Color(0xFF22D7FF),
    GameMode.oneSecond => const Color(0xFFFFB02E),
    GameMode.slang => const Color(0xFFB76CFF),
    GameMode.finishMeme => const Color(0xFFFF6E4A),
    GameMode.ogBrainrot => const Color(0xFFECC45A),
    GameMode.impossible => const Color(0xFFFF3D62),
    GameMode.daily => const Color(0xFF7DFF42),
    GameMode.rush => const Color(0xFFFF8C32),
  };

  String get packName => switch (this) {
    GameMode.mix => 'brainrot_mix',
    GameMode.italianBrainrot => 'characters',
    GameMode.guessSound => 'emoji',
    GameMode.oneSecond => 'quickfire',
    GameMode.slang => 'slang',
    GameMode.finishMeme => 'finish_memes',
    GameMode.ogBrainrot => 'og_memes',
    GameMode.impossible => 'impossible',
    GameMode.daily => 'brainrot_mix',
    GameMode.rush => 'quickfire',
  };

  String? get imageAsset => null;
}
