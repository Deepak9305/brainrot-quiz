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
    return MaterialApp.router(
      title: 'Brainrot Quiz',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark(),
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
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(18, 16, 18, 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const BrainrotLogo(compact: true),
              const SizedBox(height: 18),
              Expanded(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: Hero(
                    tag: 'tralalero-tralala',
                    child: Image.asset(
                      'assets/images/tralalero_tralala.webp',
                      width: double.infinity,
                      fit: BoxFit.cover,
                      alignment: Alignment.center,
                      semanticLabel:
                          'Tralalero Tralala, the Italian Brainrot shark with blue sneakers',
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                'How cooked are you?',
                style: TextStyle(
                  fontSize: 36,
                  height: .98,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -1.6,
                ),
              ),
              const SizedBox(height: 9),
              const Text(
                'Ten questions. Fast rounds. No account needed.',
                style: TextStyle(
                  color: AppColors.muted,
                  fontSize: 14,
                  height: 1.35,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 18),
              BrainrotButton(
                label: 'Start',
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
