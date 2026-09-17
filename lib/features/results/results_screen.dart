import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/models/game_mode.dart';
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
        body: AppBackground(
          accent: AppColors.pink,
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(28),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(
                    Icons.psychology_alt_rounded,
                    color: AppColors.pink,
                    size: 58,
                  ),
                  const SizedBox(height: 14),
                  const Text(
                    'NO BRAINROT FOUND',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Finish a quiz first. Your brain cells are still loading.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: AppColors.muted,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 18),
                  BrainrotButton(
                    label: 'BACK TO HOME',
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
      body: AppBackground(
        accent: rank.color,
        child: SafeArea(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.fromLTRB(18, 18, 18, 26),
            child: Column(
              children: [
                _ResultHero(session: session, percent: percent, rank: rank),
                const SizedBox(height: 14),
                _ScoreCard(session: session),
                const SizedBox(height: 14),
                _IqCard(iq: 120 + (percent * 0.73).round(), rank: rank),
                const SizedBox(height: 18),
                BrainrotButton(
                  label: 'SHARE RESULT',
                  icon: Icons.share_rounded,
                  color: AppColors.cyan,
                  onPressed: () => _share(session, percent, rank),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: BrainrotButton(
                        label: 'PLAY AGAIN',
                        icon: Icons.replay_rounded,
                        onPressed: () =>
                            context.go('/quiz', extra: session.mode),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: BrainrotButton(
                        label: 'NEXT QUIZ',
                        icon: Icons.arrow_forward_rounded,
                        color: AppColors.pink,
                        onPressed: () =>
                            context.go('/quiz', extra: GameMode.mix),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  'You earned coins and XP. Keep the streak alive.',
                  style: const TextStyle(
                    color: AppColors.muted,
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _share(QuizSession session, int percent, _Rank rank) async {
    ref.read(analyticsServiceProvider).track('share_clicked');
    final shared = await ShareService().shareText(
      'BRAINROT QUIZ\n\n$percent% BRAINROTTED\nIQ: ${120 + (percent * .73).round()}\nSTREAK: ${session.bestStreak}\n\n${rank.title}: ${rank.subtitle}',
    );
    if (!mounted) return;
    if (shared && kIsWeb) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Result copied — paste it into the group chat.'),
        ),
      );
    } else if (!shared) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Sharing is unavailable on this device right now.'),
        ),
      );
    }
  }

  _Rank _rankFor(int percent) {
    if (percent <= 20) {
      return const _Rank(
        'TOUCHES GRASS',
        'Somehow still normal.',
        AppColors.cyan,
      );
    }
    if (percent <= 40) {
      return const _Rank(
        'CASUAL SCROLLER',
        'There may still be hope.',
        AppColors.cyan,
      );
    }
    if (percent <= 60) {
      return const _Rank(
        'CHRONICALLY ONLINE',
        'The algorithm knows your name.',
        AppColors.purple,
      );
    }
    if (percent <= 80) {
      return const _Rank(
        'BRAINROT MASTER',
        'You speak fluent internet.',
        AppColors.pink,
      );
    }
    if (percent <= 95) {
      return const _Rank(
        'TERMINALLY ONLINE',
        'Grass is now a distant memory.',
        AppColors.orange,
      );
    }
    return const _Rank(
      'BEYOND SAVING',
      'Your attention span left the chat.',
      AppColors.lime,
    );
  }
}

class _ResultHero extends StatelessWidget {
  const _ResultHero({
    required this.session,
    required this.percent,
    required this.rank,
  });

  final QuizSession session;
  final int percent;
  final _Rank rank;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 228,
      width: double.infinity,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [rank.color.withValues(alpha: .2), AppColors.surface],
        ),
        borderRadius: BorderRadius.circular(26),
        border: Border.all(color: rank.color.withValues(alpha: .6)),
      ),
      child: Stack(
        children: [
          if (session.mode.imageAsset != null)
            Positioned(
              right: -20,
              bottom: -22,
              child: SizedBox(
                width: 190,
                height: 190,
                child: Image.asset(session.mode.imageAsset!, fit: BoxFit.cover),
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
                      AppColors.surface.withValues(alpha: .78),
                      Colors.transparent,
                    ],
                    stops: const [0, .5, 1],
                  ),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(19, 17, 18, 17),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    IconButton(
                      tooltip: 'Close results',
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints.tightFor(
                        width: 34,
                        height: 34,
                      ),
                      onPressed: () => context.go('/'),
                      icon: const Icon(Icons.close_rounded, size: 20),
                    ),
                    const SizedBox(width: 7),
                    const Text(
                      'QUIZ COMPLETE!',
                      style: TextStyle(
                        color: AppColors.muted,
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.5,
                      ),
                    ),
                  ],
                ),
                const Spacer(),
                TweenAnimationBuilder<double>(
                  tween: Tween(begin: 0, end: percent.toDouble()),
                  duration: const Duration(milliseconds: 850),
                  curve: Curves.easeOutBack,
                  builder: (context, value, child) => Text(
                    '${value.round()}%',
                    style: TextStyle(
                      color: rank.color,
                      fontSize: 60,
                      height: .9,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -4,
                    ),
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  rank.title,
                  style: TextStyle(
                    color: rank.color,
                    fontSize: 21,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -.5,
                  ),
                ),
                const SizedBox(height: 3),
                SizedBox(
                  width: 205,
                  child: Text(
                    rank.subtitle,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: AppColors.muted,
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Rank {
  const _Rank(this.title, this.subtitle, this.color);
  final String title;
  final String subtitle;
  final Color color;
}

class _ScoreCard extends StatelessWidget {
  const _ScoreCard({required this.session});
  final QuizSession session;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          _Stat(
            icon: Icons.check_circle_rounded,
            value: '${session.correctAnswers}/${session.questions.length}',
            label: 'Correct',
            color: AppColors.lime,
          ),
          _Stat(
            icon: Icons.local_fire_department_rounded,
            value: '${session.bestStreak}',
            label: 'Best streak',
            color: AppColors.orange,
          ),
          _Stat(
            icon: Icons.bolt_rounded,
            value: _format(session.score),
            label: 'Score',
            color: AppColors.cyan,
          ),
        ],
      ),
    );
  }

  String _format(int value) =>
      value >= 1000 ? '${(value / 1000).toStringAsFixed(1)}k' : '$value';
}

class _Stat extends StatelessWidget {
  const _Stat({
    required this.icon,
    required this.value,
    required this.label,
    required this.color,
  });
  final IconData icon;
  final String value;
  final String label;
  final Color color;
  @override
  Widget build(BuildContext context) => Expanded(
    child: Column(
      children: [
        Icon(icon, size: 19, color: color),
        const SizedBox(height: 5),
        Text(
          value,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
        ),
        Text(
          label,
          style: const TextStyle(
            fontSize: 10,
            color: AppColors.muted,
            fontWeight: FontWeight.w700,
          ),
        ),
      ],
    ),
  );
}

class _IqCard extends StatelessWidget {
  const _IqCard({required this.iq, required this.rank});
  final int iq;
  final _Rank rank;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(15),
    decoration: BoxDecoration(
      color: rank.color.withValues(alpha: .12),
      borderRadius: BorderRadius.circular(18),
      border: Border.all(color: rank.color.withValues(alpha: .55)),
    ),
    child: Row(
      children: [
        Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: rank.color.withValues(alpha: .2),
            shape: BoxShape.circle,
          ),
          child: Icon(Icons.psychology_alt_rounded, color: rank.color),
        ),
        const SizedBox(width: 12),
        const Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'BRAINROT IQ',
                style: TextStyle(
                  color: AppColors.muted,
                  fontSize: 11,
                  fontWeight: FontWeight.w900,
                ),
              ),
              SizedBox(height: 2),
              Text(
                'Certified by absolutely nobody',
                style: TextStyle(
                  color: AppColors.muted,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
        Text(
          '$iq',
          style: TextStyle(
            color: rank.color,
            fontSize: 28,
            fontWeight: FontWeight.w900,
          ),
        ),
      ],
    ),
  );
}
