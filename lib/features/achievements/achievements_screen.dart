import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/app_theme.dart';
import '../../state/providers.dart';
import '../../widgets/common.dart';

class AchievementsScreen extends ConsumerWidget {
  const AchievementsScreen({super.key});

  static const _items = [
    ('first_brain_cell', 'First Brain Cell', 'Complete your first quiz.', Icons.lightbulb_outline_rounded),
    ('locked_in', 'Locked In', 'Get 10 correct answers in a row.', Icons.local_fire_department_outlined),
    ('touch_grass', 'Touch Grass', 'Play for 7 consecutive days.', Icons.spa_outlined),
    ('terminally_online', 'Terminally Online', 'Complete 100 quizzes.', Icons.public_rounded),
    ('aura_farmer', 'Aura Farmer', 'Earn 10,000 Brain Coins.', Icons.bolt_outlined),
    ('zero', 'No Braincells Left', 'Score 0/10.', Icons.sentiment_dissatisfied_outlined),
    ('perfect', 'Perfectly Cooked', 'Get 10/10.', Icons.auto_awesome_outlined),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final unlocked = ref.watch(progressProvider).achievements;
    final count = unlocked.values.where((value) => value).length;

    return Scaffold(
      appBar: const BrainrotAppBar(title: 'Achievements'),
      body: SafeArea(
        child: ListView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(18, 6, 18, 28),
          children: [
            _ProgressSummary(count: count, total: _items.length),
            const SizedBox(height: 18),
            Container(
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.border),
              ),
              clipBehavior: Clip.antiAlias,
              child: Column(
                children: [
                  for (var i = 0; i < _items.length; i++) ...[
                    _AchievementRow(
                      item: _items[i],
                      isUnlocked: unlocked[_items[i].$1] == true,
                    ),
                    if (i != _items.length - 1)
                      const Divider(height: 1, indent: 66),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProgressSummary extends StatelessWidget {
  const _ProgressSummary({required this.count, required this.total});

  final int count;
  final int total;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '$count of $total unlocked',
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
          ),
        ),
        const SizedBox(height: 9),
        ProgressBar(
          value: total == 0 ? 0 : count / total,
          color: AppColors.lime,
          height: 6,
        ),
      ],
    );
  }
}

class _AchievementRow extends StatelessWidget {
  const _AchievementRow({required this.item, required this.isUnlocked});

  final (String, String, String, IconData) item;
  final bool isUnlocked;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
      child: Row(
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: AppColors.surfaceRaised,
              borderRadius: BorderRadius.circular(11),
            ),
            alignment: Alignment.center,
            child: Icon(
              item.$4,
              color: isUnlocked ? AppColors.ink : AppColors.subtle,
              size: 20,
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
                    color: isUnlocked ? AppColors.ink : AppColors.muted,
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  item.$3,
                  style: const TextStyle(
                    color: AppColors.muted,
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          Icon(
            isUnlocked ? Icons.check_circle_rounded : Icons.lock_outline_rounded,
            color: isUnlocked ? AppColors.lime : AppColors.subtle,
            size: 19,
          ),
        ],
      ),
    );
  }
}
