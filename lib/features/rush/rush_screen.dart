import 'package:flutter/material.dart';

import '../../core/models/game_mode.dart';
import '../quiz/quiz_screen.dart';

class RushScreen extends StatelessWidget {
  const RushScreen({super.key});

  @override
  Widget build(BuildContext context) => const QuizScreen(mode: GameMode.rush);
}
