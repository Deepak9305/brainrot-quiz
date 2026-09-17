import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'core/models/game_mode.dart';
import 'core/theme/app_theme.dart';
import 'features/achievements/achievements_screen.dart';
import 'features/daily/daily_screen.dart';
import 'features/home/home_screen.dart';
import 'features/quiz/quiz_screen.dart';
import 'features/results/results_screen.dart';
import 'features/rush/rush_screen.dart';
import 'features/settings/settings_screen.dart';
import 'features/shop/shop_screen.dart';
import 'state/providers.dart';
import 'widgets/common.dart';

String _dateKey(DateTime date) =>
    '${date.year.toString().padLeft(4, '0')}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(path: '/', builder: (context, state) => const RootScreen()),
      GoRoute(
        path: '/quiz',
        redirect: (context, state) {
          final mode = state.extra as GameMode? ?? GameMode.mix;
          if (mode == GameMode.daily &&
              ref.read(progressProvider).dailyCompletedDate ==
                  _dateKey(DateTime.now())) {
            return '/daily';
          }
          return null;
        },
        builder: (context, state) =>
            QuizScreen(mode: state.extra as GameMode? ?? GameMode.mix),
      ),
      GoRoute(path: '/rush', builder: (context, state) => const RushScreen()),
      GoRoute(path: '/daily', builder: (context, state) => const DailyScreen()),
      GoRoute(path: '/results', builder: (context, state) => const ResultsScreen()),
      GoRoute(
        path: '/achievements',
        builder: (context, state) => const AchievementsScreen(),
      ),
      GoRoute(path: '/shop', builder: (context, state) => const ShopScreen()),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
    ],
  );
});

class BrainrotApp extends ConsumerWidget {
  const BrainrotApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final progress = ref.watch(progressProvider);
    final accent = AppTheme.accentForTheme(progress.equippedTheme);

    return MaterialApp.router(
      title: 'Brainrot Quiz',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark(accent: accent),
      routerConfig: ref.watch(routerProvider),
      builder: (context, child) {
        final media = MediaQuery.of(context);
        return MediaQuery(
          data: media.copyWith(disableAnimations: progress.reduceMotion),
          child: child ?? const SizedBox.shrink(),
        );
      },
    );
  }
}

class RootScreen extends ConsumerWidget {
  const RootScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final progress = ref.watch(progressProvider);
    return progress.seenIntro ? const HomeScreen() : const IntroScreen();
  }
}

class IntroScreen extends ConsumerWidget {
  const IntroScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final accent = Theme.of(context).colorScheme.primary;

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(18, 14, 18, 18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const BrainrotLogo(compact: true),
              const SizedBox(height: 16),
              Expanded(child: _CulturePreview(accent: accent)),
              const SizedBox(height: 18),
              Text(
                'HOW COOKED\nARE YOU?',
                style: TextStyle(
                  color: AppColors.ink,
                  fontSize: 40,
                  height: .9,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -2,
                  shadows: [
                    Shadow(
                      color: accent.withValues(alpha: .16),
                      blurRadius: 18,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                'Slang, memes, emoji reactions, characters and internet culture.',
                style: TextStyle(
                  color: AppColors.muted,
                  fontSize: 12,
                  height: 1.35,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 12),
              const Row(
                children: [
                  _IntroMeta('8 MODES'),
                  _MetaDot(),
                  _IntroMeta('OFFLINE'),
                  _MetaDot(),
                  _IntroMeta('NO LOGIN'),
                ],
              ),
              const SizedBox(height: 18),
              BrainrotButton(
                label: 'Enter quiz',
                icon: Icons.arrow_forward_rounded,
                onPressed: () {
                  ref.read(progressProvider.notifier).markIntroSeen();
                  context.go('/');
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CulturePreview extends StatelessWidget {
  const _CulturePreview({required this.accent});

  final Color accent;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                'INTERNET CULTURE TEST',
                style: TextStyle(
                  color: accent,
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.1,
                ),
              ),
              const Spacer(),
              const Text(
                'v1.1.1',
                style: TextStyle(
                  color: AppColors.subtle,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Expanded(
            child: GridView.count(
              crossAxisCount: 2,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              childAspectRatio: 1.15,
              children: const [
                _CultureTile(
                  icon: Icons.chat_bubble_outline_rounded,
                  title: 'SLANG',
                  detail: 'rizz · delulu · aura',
                ),
                _CultureTile(
                  icon: Icons.emoji_emotions_outlined,
                  title: 'EMOJI',
                  detail: '💀 👀 🗿 🚩',
                ),
                _CultureTile(
                  icon: Icons.history_rounded,
                  title: 'MEMES',
                  detail: 'Doge · Rickroll · OGs',
                ),
                _CultureTile(
                  icon: Icons.auto_awesome_rounded,
                  title: 'CHARACTERS',
                  detail: 'viral faces + brainrot',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _CultureTile extends StatelessWidget {
  const _CultureTile({
    required this.icon,
    required this.title,
    required this.detail,
  });

  final IconData icon;
  final String title;
  final String detail;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surfaceRaised,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Icon(icon, size: 22, color: AppColors.ink),
          const Spacer(),
          Text(
            title,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w900,
              letterSpacing: .7,
            ),
          ),
          const SizedBox(height: 3),
          Text(
            detail,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              color: AppColors.muted,
              fontSize: 10,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _IntroMeta extends StatelessWidget {
  const _IntroMeta(this.label);

  final String label;

  @override
  Widget build(BuildContext context) => Text(
        label,
        style: const TextStyle(
          color: AppColors.muted,
          fontSize: 10,
          fontWeight: FontWeight.w800,
          letterSpacing: .65,
        ),
      );
}

class _MetaDot extends StatelessWidget {
  const _MetaDot();

  @override
  Widget build(BuildContext context) => const Padding(
        padding: EdgeInsets.symmetric(horizontal: 8),
        child: Text('·', style: TextStyle(color: AppColors.subtle)),
      );
}
