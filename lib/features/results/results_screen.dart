import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_theme.dart';
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
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
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

    final total = session.questions.length;
    final percent = total == 0
        ? 0
        : ((session.correctAnswers / total) * 100).round().clamp(0, 100);
    final rank = _rankFor(percent);

    return Scaffold(
      body: SafeArea(
        child: ListView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(18, 14, 18, 28),
          children: [
            Row(
              children: [
                const Text(
                  'Round complete',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -.35,
                  ),
                ),
                const Spacer(),
                IconButton(
                  tooltip: 'Close',
                  onPressed: () => context.go('/'),
                  icon: const Icon(Icons.close_rounded),
                ),
              ],
            ),
            const SizedBox(height: 12),
            _ResultCard(percent: percent, rank: rank),
            const SizedBox(height: 12),
            _StatsCard(session: session),
            const SizedBox(height: 20),
            BrainrotButton(
              label: 'Share result',
              icon: Icons.share_outlined,
              onPressed: () => _share(session, percent, rank),
            ),
            const SizedBox(height: 9),
            BrainrotButton(
              label: 'Play again',
              icon: Icons.replay_rounded,
              outlined: true,
              color: AppColors.ink,
              foreground: AppColors.ink,
              onPressed: () => context.go('/quiz', extra: session.mode),
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

  Future<void> _share(QuizSession session, int percent, _Rank rank) async {
    ref.read(analyticsServiceProvider).track('share_clicked');
    final shared = await ShareService().shareText(
      'Brainrot Quiz — $percent%\n${rank.title}\n${session.correctAnswers}/${session.questions.length} correct · best streak ${session.bestStreak}',
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
      return const _Rank('Touches grass', 'Still mostly normal.', AppColors.cyan);
    }
    if (percent <= 40) {
      return const _Rank('Casual scroller', 'You know enough.', AppColors.cyan);
    }
    if (percent <= 60) {
      return const _Rank(
        'Chronically online',
        'The algorithm knows you.',
        AppColors.purple,
      );
    }
    if (percent <= 80) {
      return const _Rank(
        'Brainrot master',
        'Fluent in internet culture.',
        AppColors.pink,
      );
    }
    if (percent <= 95) {
      return const _Rank(
        'Terminally online',
        'You have seen too much.',
        AppColors.orange,
      );
    }
    return const _Rank('Beyond saving', 'Perfectly cooked.', AppColors.lime);
  }
}

class _ResultCard extends StatelessWidget {
  const _ResultCard({required this.percent, required this.rank});

  final int percent;
  final _Rank rank;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(18, 24, 18, 22),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TweenAnimationBuilder<double>(
            tween: Tween(begin: 0, end: percent.toDouble()),
            duration: const Duration(milliseconds: 650),
            curve: Curves.easeOutCubic,
            builder: (context, value, child) => Text(
              '${value.round()}%',
              style: const TextStyle(
                fontSize: 64,
                height: .92,
                fontWeight: FontWeight.w900,
                letterSpacing: -3.5,
              ),
            ),
          ),
          const SizedBox(height: 14),
          Container(
            width: 28,
            height: 4,
            decoration: BoxDecoration(
              color: rank.color,
              borderRadius: BorderRadius.circular(99),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            rank.title,
            style: const TextStyle(
              fontSize: 21,
              fontWeight: FontWeight.w800,
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
      ),
    );
  }
}

class _StatsCard extends StatelessWidget {
  const _StatsCard({required this.session});

  final QuizSession session;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          _Stat(
            value: '${session.correctAnswers}/${session.questions.length}',
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
        height: 30,
        color: AppColors.border,
      );
}

class _Rank {
  const _Rank(this.title, this.subtitle, this.color);

  final String title;
  final String subtitle;
  final Color color;
}
