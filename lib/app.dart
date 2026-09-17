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

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(path: '/', builder: (context, state) => const RootScreen()),
      GoRoute(
        path: '/quiz',
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
              Expanded(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      Hero(
                        tag: 'tralalero-tralala',
                        child: Image.asset(
                          'assets/images/tralalero_tralala.webp',
                          fit: BoxFit.cover,
                          alignment: Alignment.center,
                          semanticLabel:
                              'Tralalero Tralala, the Italian Brainrot shark with blue sneakers',
                        ),
                      ),
                      Positioned(
                        left: 12,
                        top: 12,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 9,
                            vertical: 6,
                          ),
                          color: Colors.black.withValues(alpha: .78),
                          child: const Text(
                            'ROUND 01',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 1,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
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
              const SizedBox(height: 12),
              const Row(
                children: [
                  _IntroMeta('10 QUESTIONS'),
                  _MetaDot(),
                  _IntroMeta('OFFLINE'),
                  _MetaDot(),
                  _IntroMeta('NO LOGIN'),
                ],
              ),
              const SizedBox(height: 18),
              BrainrotButton(
                label: 'Start round',
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
