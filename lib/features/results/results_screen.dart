import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/models/game_mode.dart';
import '../../core/theme/app_theme.dart';
import '../../services/ads_service.dart';
import '../../services/share_service.dart';
import '../../state/providers.dart';
import '../../state/quiz_session.dart';
import '../../widgets/common.dart';

class ResultsScreen extends ConsumerStatefulWidget {
  const ResultsScreen({super.key});

  @override
  ConsumerState<ResultsScreen> createState() => _ResultsScreenState();
}

class _ResultsScreenState extends ConsumerState<ResultsScreen> {
  bool _claimingBonus = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final firstView = ref
          .read(quizSessionProvider.notifier)
          .markResultProcessed();
      if (!firstView) return;

      ref.read(adsServiceProvider).recordCompletedRound();
      ref.read(adsServiceProvider).showInterstitialIfEligible();
      ref.read(analyticsServiceProvider).track('result_viewed');
    });
  }

  @override
  Widget build(BuildContext context) {
    final session = ref.watch(quizSessionProvider);

    if (session == null) {
      return Scaffold(
        body: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(28),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'No result yet',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 7),
                  const Text(
                    'Finish a round first.',
                    style: TextStyle(color: AppColors.muted),
                  ),
                  const SizedBox(height: 18),
                  BrainrotButton(
                    label: 'Back home',
                    onPressed: () => context.go('/'),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    final attempted = session.isRush
        ? session.currentIndex + (session.isAnswered ? 1 : 0)
        : session.questions.length;
    final percent = attempted == 0
        ? 0
        : ((session.correctAnswers / attempted) * 100).round().clamp(0, 100);
    final rank = _rankFor(percent);
    final coinsEarned = _coinReward(session);
    final bonusClaimed = session.rewardedBonusClaimed;

    return Scaffold(
      body: SafeArea(
        child: ListView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(18, 12, 18, 28),
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    session.isRush ? 'RUSH COMPLETE' : 'ROUND COMPLETE',
                    style: const TextStyle(
                      color: AppColors.muted,
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
                IconButton(
                  tooltip: 'Close',
                  onPressed: () => context.go('/'),
                  icon: const Icon(Icons.close_rounded, size: 20),
                ),
              ],
            ),
            const SizedBox(height: 10),
            _ResultHero(percent: percent, rank: rank),
            const SizedBox(height: 18),
            _StatsStrip(session: session, attempted: attempted),
            const SizedBox(height: 14),
            _RewardStrip(coins: coinsEarned),
            if (!kIsWeb) ...[
              const SizedBox(height: 10),
              BrainrotButton(
                label: bonusClaimed
                    ? 'Bonus claimed'
                    : _claimingBonus
                        ? 'Opening ad…'
                        : 'Watch ad · double coins',
                icon: bonusClaimed
                    ? Icons.check_rounded
                    : Icons.play_circle_outline_rounded,
                outlined: true,
                color: bonusClaimed ? AppColors.muted : AppColors.orange,
                foreground: AppColors.orange,
                onPressed: bonusClaimed || _claimingBonus
                    ? null
                    : () => _claimBonus(session, coinsEarned),
              ),
            ],
            const SizedBox(height: 20),
            BrainrotButton(
              label: session.mode == GameMode.daily ? 'Back to daily' : 'Play again',
              icon: session.mode == GameMode.daily
                  ? Icons.today_outlined
                  : Icons.replay_rounded,
              onPressed: () {
                if (session.mode == GameMode.daily) {
                  context.go('/daily');
                } else {
                  context.go('/quiz', extra: session.mode);
                }
              },
            ),
            const SizedBox(height: 9),
            BrainrotButton(
              label: 'Share result',
              icon: Icons.share_outlined,
              outlined: true,
              color: AppColors.ink,
              foreground: AppColors.ink,
              onPressed: () => _share(session, attempted, percent, rank),
            ),
            const SizedBox(height: 4),
            TextButton(
              onPressed: () => context.go('/'),
              child: const Text(
                'Back to home',
                style: TextStyle(
                  color: AppColors.muted,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  int _coinReward(QuizSession session) =>
      80 + (session.correctAnswers * 35) + (session.bestStreak * 10);

  Future<void> _claimBonus(QuizSession session, int reward) async {
    if (_claimingBonus || session.rewardedBonusClaimed) return;
    setState(() => _claimingBonus = true);

    final earned = await ref
        .read(adsServiceProvider)
        .showRewarded(RewardKind.doubleCoins);

    if (!mounted) return;

    final current = ref.read(quizSessionProvider);
    final sameRound = current != null &&
        identical(current.questions, session.questions) &&
        current.mode == session.mode;

    if (earned &&
        sameRound &&
        ref.read(quizSessionProvider.notifier).markRewardedBonusClaimed()) {
      ref.read(progressProvider.notifier).addCoins(reward);
      ref.read(analyticsServiceProvider).track('rewarded_bonus_claimed', {
        'kind': 'doubleCoins',
        'mode': session.mode.name,
        'coins': reward,
      });
      setState(() => _claimingBonus = false);
      return;
    }

    setState(() => _claimingBonus = false);
    if (!earned) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Rewarded ad is not ready yet.')),
      );
    }
  }

  Future<void> _share(
    QuizSession session,
    int attempted,
    int percent,
    _Rank rank,
  ) async {
    ref.read(analyticsServiceProvider).track('share_clicked');
    final shared = await ShareService().shareText(
      'Brainrot Quiz — $percent%\n${rank.title}\n${session.correctAnswers}/$attempted correct · best streak ${session.bestStreak}',
    );

    if (!mounted) return;
    if (shared && kIsWeb) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Result copied.')),
      );
    } else if (!shared) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Sharing is unavailable right now.')),
      );
    }
  }

  _Rank _rankFor(int percent) {
    if (percent <= 20) {
      return const _Rank('TOUCHES GRASS', 'Still mostly normal.', AppColors.cyan);
    }
    if (percent <= 40) {
      return const _Rank('CASUAL SCROLLER', 'You know enough.', AppColors.cyan);
    }
    if (percent <= 60) {
      return const _Rank(
        'CHRONICALLY ONLINE',
        'The algorithm knows you.',
        AppColors.purple,
      );
    }
    if (percent <= 80) {
      return const _Rank(
        'BRAINROT MASTER',
        'Fluent in internet culture.',
        AppColors.pink,
      );
    }
    if (percent <= 95) {
      return const _Rank(
        'TERMINALLY ONLINE',
        'You have seen too much.',
        AppColors.orange,
      );
    }
    return const _Rank('BEYOND SAVING', 'Perfectly cooked.', AppColors.lime);
  }
}

class _ResultHero extends StatelessWidget {
  const _ResultHero({required this.percent, required this.rank});

  final int percent;
  final _Rank rank;

  @override
  Widget build(BuildContext context) {
    final score = Text(
      '$percent%',
      style: const TextStyle(
        fontSize: 76,
        height: .85,
        fontWeight: FontWeight.w900,
        letterSpacing: -4.5,
      ),
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (MediaQuery.disableAnimationsOf(context))
          score
        else
          TweenAnimationBuilder<double>(
            tween: Tween(begin: 0, end: percent.toDouble()),
            duration: const Duration(milliseconds: 600),
            curve: Curves.easeOutCubic,
            builder: (context, value, child) => Text(
              '${value.round()}%',
              style: const TextStyle(
                fontSize: 76,
                height: .85,
                fontWeight: FontWeight.w900,
                letterSpacing: -4.5,
              ),
            ),
          ),
        const SizedBox(height: 14),
        Container(width: 44, height: 5, color: rank.color),
        const SizedBox(height: 11),
        Text(
          rank.title,
          style: TextStyle(
            color: rank.color,
            fontSize: 20,
            fontWeight: FontWeight.w900,
            letterSpacing: -.4,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          rank.subtitle,
          style: const TextStyle(
            color: AppColors.muted,
            fontSize: 13,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}

class _StatsStrip extends StatelessWidget {
  const _StatsStrip({required this.session, required this.attempted});

  final QuizSession session;
  final int attempted;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: const BoxDecoration(
        border: Border(
          top: BorderSide(color: AppColors.border),
          bottom: BorderSide(color: AppColors.border),
        ),
      ),
      child: Row(
        children: [
          _Stat(
            value: '${session.correctAnswers}/$attempted',
            label: 'CORRECT',
          ),
          const _StatDivider(),
          _Stat(value: '${session.bestStreak}', label: 'BEST STREAK'),
          const _StatDivider(),
          _Stat(value: _format(session.score), label: 'SCORE'),
        ],
      ),
    );
  }

  String _format(int value) =>
      value >= 1000 ? '${(value / 1000).toStringAsFixed(1)}k' : '$value';
}

class _RewardStrip extends StatelessWidget {
  const _RewardStrip({required this.coins});

  final int coins;

  @override
  Widget build(BuildContext context) => Row(
        children: [
          const Icon(Icons.bolt_rounded, color: AppColors.orange, size: 18),
          const SizedBox(width: 7),
          const Text(
            'ROUND REWARD',
            style: TextStyle(
              color: AppColors.muted,
              fontSize: 10,
              fontWeight: FontWeight.w900,
              letterSpacing: .8,
            ),
          ),
          const Spacer(),
          Text(
            '+$coins coins',
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
          ),
        ],
      );
}

class _Stat extends StatelessWidget {
  const _Stat({required this.value, required this.label});

  final String value;
  final String label;

  @override
  Widget build(BuildContext context) => Expanded(
        child: Column(
          children: [
            Text(
              value,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 3),
            Text(
              label,
              style: const TextStyle(
                color: AppColors.subtle,
                fontSize: 9,
                fontWeight: FontWeight.w700,
                letterSpacing: .45,
              ),
            ),
          ],
        ),
      );
}

class _StatDivider extends StatelessWidget {
  const _StatDivider();

  @override
  Widget build(BuildContext context) => Container(
        width: 1,
        height: 28,
        color: AppColors.border,
      );
}

class _Rank {
  const _Rank(this.title, this.subtitle, this.color);

  final String title;
  final String subtitle;
  final Color color;
}
