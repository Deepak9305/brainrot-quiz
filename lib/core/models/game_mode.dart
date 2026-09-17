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
    GameMode.italianBrainrot => 'Italian Brainrot',
    GameMode.guessSound => 'Guess the Sound',
    GameMode.oneSecond => '1-Second Challenge',
    GameMode.slang => 'Slang Test',
    GameMode.finishMeme => 'Finish the Meme',
    GameMode.ogBrainrot => 'OG Brainrot',
    GameMode.impossible => 'Impossible Mode',
    GameMode.daily => 'Daily Brainrot',
    GameMode.rush => 'Brainrot Rush',
  };

  String get subtitle => switch (this) {
    GameMode.mix => 'A little bit of everything',
    GameMode.italianBrainrot => 'Only the terminally online survive',
    GameMode.guessSound => 'Your ears know the truth',
    GameMode.oneSecond => 'Blink and it is gone',
    GameMode.slang => 'Do you speak fluent internet?',
    GameMode.finishMeme => 'Complete the sentence',
    GameMode.ogBrainrot => 'Classics never die',
    GameMode.impossible => 'Only the cooked survive',
    GameMode.daily => 'Same challenge for everyone',
    GameMode.rush => '60 seconds. No thoughts.',
  };

  IconData get icon => switch (this) {
    GameMode.mix => Icons.psychology_alt_rounded,
    GameMode.italianBrainrot => Icons.public_rounded,
    GameMode.guessSound => Icons.graphic_eq_rounded,
    GameMode.oneSecond => Icons.flash_on_rounded,
    GameMode.slang => Icons.chat_bubble_rounded,
    GameMode.finishMeme => Icons.sentiment_very_satisfied_rounded,
    GameMode.ogBrainrot => Icons.history_rounded,
    GameMode.impossible => Icons.dangerous_rounded,
    GameMode.daily => Icons.calendar_today_rounded,
    GameMode.rush => Icons.timer_rounded,
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
    GameMode.mix || GameMode.rush || GameMode.daily => 'brainrot_mix',
    GameMode.italianBrainrot => 'italian_brainrot',
    GameMode.guessSound => 'sounds',
    GameMode.oneSecond => 'brainrot_mix',
    GameMode.slang => 'slang',
    GameMode.finishMeme => 'brainrot_mix',
    GameMode.ogBrainrot => 'og_memes',
    GameMode.impossible => 'impossible',
  };

  String? get imageAsset => switch (this) {
    GameMode.mix => 'assets/images/tralalero_tralala.webp',
    GameMode.italianBrainrot => 'assets/images/bombardiro_crocodilo.jpg',
    GameMode.oneSecond => 'assets/images/tung_tung_tung_sahur.webp',
    GameMode.finishMeme => 'assets/images/brr_brr_patapim.jpg',
    GameMode.ogBrainrot => 'assets/images/tralalero_tralala.webp',
    GameMode.impossible => 'assets/images/bombardiro_crocodilo.jpg',
    GameMode.daily => 'assets/images/tung_tung_tung_sahur.webp',
    GameMode.rush => 'assets/images/brr_brr_patapim.jpg',
    GameMode.guessSound || GameMode.slang => null,
  };
}
