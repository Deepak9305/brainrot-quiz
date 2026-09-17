import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/app_theme.dart';
import '../../state/providers.dart';
import '../../widgets/common.dart';

class AchievementsScreen extends ConsumerWidget {
  const AchievementsScreen({super.key});

  static const _items = [
    (
      'first_brain_cell',
      'First Brain Cell',
      'Complete your first quiz.',
      Icons.lightbulb_rounded,
      AppColors.purple,
    ),
    (
      'locked_in',
      'Locked In',
      'Get 10 correct answers consecutively.',
      Icons.local_fire_department_rounded,
      AppColors.orange,
    ),
    (
      'touch_grass',
      'Touch Grass',
      'Play for 7 consecutive days.',
      Icons.spa_rounded,
      AppColors.lime,
    ),
    (
      'terminally_online',
      'Terminally Online',
      'Complete 100 quizzes.',
      Icons.public_rounded,
      AppColors.cyan,
    ),
    (
      'aura_farmer',
      'Aura Farmer',
      'Earn 10,000 Brain Coins.',
      Icons.monetization_on_rounded,
      AppColors.orange,
    ),
    (
      'zero',
      'No Braincells Left',
      'Score 0/10.',
      Icons.sentiment_dissatisfied_rounded,
      AppColors.muted,
    ),
    (
      'perfect',
      'Perfectly Cooked',
      'Get 10/10.',
      Icons.auto_awesome_rounded,
      AppColors.pink,
    ),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final unlocked = ref.watch(progressProvider).achievements;
    final count = unlocked.values.where((value) => value).length;
    return Scaffold(
      appBar: const BrainrotAppBar(title: 'Achievements'),
      body: AppBackground(
        accent: AppColors.orange,
        child: SafeArea(
          child: ListView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.fromLTRB(18, 5, 18, 26),
            children: [
              Text(
                '$count / ${_items.length} unlocked',
                style: const TextStyle(
                  color: AppColors.muted,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 14),
              ProgressBar(
                value: count / _items.length,
                color: AppColors.orange,
                height: 9,
              ),
              const SizedBox(height: 18),
              for (final item in _items)
                _AchievementTile(
                  item: item,
                  isUnlocked: unlocked[item.$1] == true,
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class _AchievementTile extends StatelessWidget {
  const _AchievementTile({required this.item, required this.isUnlocked});
  final (String, String, String, IconData, Color) item;
  final bool isUnlocked;
  @override
  Widget build(BuildContext context) => Container(
    margin: const EdgeInsets.only(bottom: 9),
    padding: const EdgeInsets.all(13),
    decoration: BoxDecoration(
      color: AppColors.surface,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(
        color: isUnlocked ? item.$5.withValues(alpha: .55) : AppColors.border,
      ),
    ),
    child: Row(
      children: [
        Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: (isUnlocked ? item.$5 : AppColors.muted).withValues(
              alpha: .15,
            ),
            shape: BoxShape.circle,
          ),
          child: Icon(
            item.$4,
            color: isUnlocked ? item.$5 : AppColors.muted,
            size: 21,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                item.$2,
                style: TextStyle(
                  fontWeight: FontWeight.w900,
                  color: isUnlocked ? AppColors.ink : AppColors.muted,
                ),
              ),
              const SizedBox(height: 3),
              Text(
                item.$3,
                style: const TextStyle(
                  color: AppColors.muted,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
        Icon(
          isUnlocked ? Icons.check_circle_rounded : Icons.lock_outline_rounded,
          color: isUnlocked ? AppColors.lime : AppColors.muted,
          size: 20,
        ),
      ],
    ),
  );
}
