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
    GameMode.mix => 'Visual Mix',
    GameMode.italianBrainrot => 'Guess the Character',
    GameMode.guessSound => 'Voice Challenge',
    GameMode.oneSecond => '1-Second Flash',
    GameMode.slang => 'Slang Snap',
    GameMode.finishMeme => 'Finish the Meme',
    GameMode.ogBrainrot => 'OG Internet',
    GameMode.impossible => 'Impossible Mode',
    GameMode.daily => 'Daily Brainrot',
    GameMode.rush => 'Brainrot Rush',
  };

  String get subtitle => switch (this) {
    GameMode.mix => 'Images, voices, emoji and fast internet culture',
    GameMode.italianBrainrot => 'Recognize the face before the name',
    GameMode.guessSound => 'Listen first. Pick what you heard.',
    GameMode.oneSecond => 'See it fast. Answer from memory.',
    GameMode.slang => 'Short slang. No paragraph reading.',
    GameMode.finishMeme => 'Complete the line before it disappears',
    GameMode.ogBrainrot => 'Classic internet culture',
    GameMode.impossible => 'Hard mode for terminally online people',
    GameMode.daily => 'A fresh visual and voice-heavy challenge',
    GameMode.rush => '60 seconds. Keep moving.',
  };

  IconData get icon => switch (this) {
    GameMode.mix => Icons.grid_view_rounded,
    GameMode.italianBrainrot => Icons.image_search_rounded,
    GameMode.guessSound => Icons.graphic_eq_rounded,
    GameMode.oneSecond => Icons.flash_on_rounded,
    GameMode.slang => Icons.bolt_rounded,
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
    GameMode.guessSound => 'voice',
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
