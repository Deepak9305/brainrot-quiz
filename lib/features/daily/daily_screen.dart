import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/models/game_mode.dart';
import '../../core/theme/app_theme.dart';
import '../../state/providers.dart';
import '../../widgets/common.dart';

class DailyScreen extends ConsumerWidget {
  const DailyScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final progress = ref.watch(progressProvider);
    final completed = progress.dailyCompletedDate == _today();
    return Scaffold(
      appBar: const BrainrotAppBar(title: 'Daily Brainrot'),
      body: AppBackground(
        accent: AppColors.lime,
        child: SafeArea(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.fromLTRB(18, 4, 18, 26),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  height: 260,
                  width: double.infinity,
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(26),
                    border: Border.all(
                      color: AppColors.lime.withValues(alpha: .6),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.lime.withValues(alpha: .08),
                        blurRadius: 28,
                      ),
                    ],
                  ),
                  child: Stack(
                    children: [
                      Positioned(
                        right: -20,
                        bottom: -20,
                        child: SizedBox(
                          width: 220,
                          height: 220,
                          child: Image.asset(
                            'assets/images/tung_tung_tung_sahur.webp',
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                      Positioned.fill(
                        child: IgnorePointer(
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.centerLeft,
                                end: Alignment.centerRight,
                                colors: [
                                  AppColors.surface,
                                  AppColors.surface.withValues(alpha: .82),
                                  Colors.transparent,
                                ],
                                stops: const [0, .42, 1],
                              ),
                            ),
                          ),
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(
                            Icons.calendar_today_rounded,
                            color: AppColors.lime,
                            size: 28,
                          ),
                          const SizedBox(height: 18),
                          const Text(
                            "TODAY'S CHALLENGE",
                            style: TextStyle(
                              color: AppColors.muted,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 1.2,
                            ),
                          ),
                          const Text(
                            '10 QUESTIONS',
                            style: TextStyle(
                              fontSize: 29,
                              fontWeight: FontWeight.w900,
                              letterSpacing: -1,
                            ),
                          ),
                          const SizedBox(height: 7),
                          const SizedBox(
                            width: 180,
                            child: Text(
                              'Same quiz for everyone. Compare your brainrot with the group chat.',
                              style: TextStyle(
                                color: AppColors.muted,
                                fontWeight: FontWeight.w600,
                                height: 1.25,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                _WeekStrip(streak: progress.dailyStreak),
                const SizedBox(height: 16),
                if (completed)
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.lime.withValues(alpha: .12),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(
                        color: AppColors.lime.withValues(alpha: .5),
                      ),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.check_circle_rounded,
                          color: AppColors.lime,
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            'Done for today: ${progress.dailyScore ?? 0}/10. Come back tomorrow.',
                            style: const TextStyle(fontWeight: FontWeight.w800),
                          ),
                        ),
                        TextButton(
                          onPressed: () =>
                              context.push('/quiz', extra: GameMode.daily),
                          child: const Text('REPLAY'),
                        ),
                      ],
                    ),
                  )
                else
                  BrainrotButton(
                    label: 'PLAY DAILY',
                    icon: Icons.play_arrow_rounded,
                    onPressed: () =>
                        context.push('/quiz', extra: GameMode.daily),
                  ),
                const SizedBox(height: 14),
                const Text(
                  'Daily streak rewards',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 9),
                const _RewardRow(
                  day: 'DAY 1',
                  reward: '100 coins',
                  icon: Icons.monetization_on_rounded,
                ),
                const _RewardRow(
                  day: 'DAY 2',
                  reward: '150 coins',
                  icon: Icons.local_fire_department_rounded,
                ),
                const _RewardRow(
                  day: 'DAY 3',
                  reward: '200 coins',
                  icon: Icons.bolt_rounded,
                ),
                const _RewardRow(
                  day: 'DAY 4',
                  reward: '250 coins',
                  icon: Icons.auto_awesome_rounded,
                ),
                const _RewardRow(
                  day: 'DAY 5',
                  reward: '300 coins',
                  icon: Icons.stars_rounded,
                ),
                const _RewardRow(
                  day: 'DAY 6',
                  reward: '400 coins',
                  icon: Icons.local_fire_department_rounded,
                ),
                const _RewardRow(
                  day: 'DAY 7',
                  reward: 'Mystery box',
                  icon: Icons.card_giftcard_rounded,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _today() {
    final now = DateTime.now();
    return '${now.year.toString().padLeft(4, '0')}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';
  }
}

class _WeekStrip extends StatelessWidget {
  const _WeekStrip({required this.streak});
  final int streak;
  @override
  Widget build(BuildContext context) {
    final days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    return Container(
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          for (var index = 0; index < days.length; index++)
            Column(
              children: [
                Text(
                  days[index],
                  style: const TextStyle(
                    color: AppColors.muted,
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  width: 29,
                  height: 29,
                  decoration: BoxDecoration(
                    color: index < streak
                        ? AppColors.orange
                        : AppColors.surfaceRaised,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    index < streak
                        ? Icons.local_fire_department_rounded
                        : Icons.circle_outlined,
                    size: 16,
                    color: index < streak ? Colors.black : AppColors.muted,
                  ),
                ),
              ],
            ),
        ],
      ),
    );
  }
}

class _RewardRow extends StatelessWidget {
  const _RewardRow({
    required this.day,
    required this.reward,
    required this.icon,
  });
  final String day;
  final String reward;
  final IconData icon;
  @override
  Widget build(BuildContext context) => Container(
    margin: const EdgeInsets.only(bottom: 8),
    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
    decoration: BoxDecoration(
      color: AppColors.surface,
      borderRadius: BorderRadius.circular(14),
      border: Border.all(color: AppColors.border),
    ),
    child: Row(
      children: [
        Icon(icon, color: AppColors.orange, size: 19),
        const SizedBox(width: 10),
        Text(
          day,
          style: const TextStyle(
            color: AppColors.muted,
            fontSize: 11,
            fontWeight: FontWeight.w900,
          ),
        ),
        const Spacer(),
        Text(reward, style: const TextStyle(fontWeight: FontWeight.w800)),
      ],
    ),
  );
}
