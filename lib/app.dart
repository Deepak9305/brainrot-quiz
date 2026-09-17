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
      GoRoute(
        path: '/results',
        builder: (context, state) => const ResultsScreen(),
      ),
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
      body: AppBackground(
        accent: AppColors.pink,
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const BrainrotLogo(compact: true),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 7,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(11),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.lock_open_rounded,
                            color: AppColors.lime,
                            size: 14,
                          ),
                          SizedBox(width: 5),
                          Text(
                            'NO LOGIN',
                            style: TextStyle(
                              color: AppColors.muted,
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              letterSpacing: .7,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 28),
                const Text(
                  'WELCOME TO THE INTERNET',
                  style: TextStyle(
                    color: AppColors.cyan,
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.8,
                  ),
                ),
                const SizedBox(height: 7),
                const Text.rich(
                  TextSpan(
                    children: [
                      TextSpan(
                        text: 'HOW COOKED\n',
                        style: TextStyle(color: AppColors.ink),
                      ),
                      TextSpan(
                        text: 'ARE YOU?',
                        style: TextStyle(color: AppColors.pink),
                      ),
                    ],
                  ),
                  style: TextStyle(
                    fontSize: 38,
                    height: .92,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -1.8,
                  ),
                ),
                const SizedBox(height: 18),
                Expanded(child: _IntroFeatureCard()),
                const SizedBox(height: 16),
                BrainrotButton(
                  label: 'START PLAYING',
                  icon: Icons.play_arrow_rounded,
                  onPressed: () {
                    ref.read(progressProvider.notifier).markIntroSeen();
                    context.go('/');
                  },
                ),
                const SizedBox(height: 10),
                const Center(
                  child: Text(
                    '10 questions  •  real internet lore  •  offline ready',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: AppColors.muted,
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _IntroFeatureCard extends StatelessWidget {
  const _IntroFeatureCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(26),
        border: Border.all(color: AppColors.pink.withValues(alpha: .55)),
        boxShadow: [
          BoxShadow(
            color: AppColors.pink.withValues(alpha: .14),
            blurRadius: 32,
            offset: const Offset(0, 14),
          ),
        ],
      ),
      child: Stack(
        fit: StackFit.expand,
        children: [
          Hero(
            tag: 'tralalero-tralala',
            child: Image.asset(
              'assets/images/tralalero_tralala.webp',
              fit: BoxFit.cover,
              alignment: Alignment.center,
              semanticLabel: 'Tralalero Tralala, the Italian Brainrot shark with blue sneakers',
            ),
          ),
          const DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.transparent,
                  Color(0x18080B10),
                  Color(0xF2080B10),
                ],
                stops: [0, .48, 1],
              ),
            ),
          ),
          Positioned(
            top: 16,
            left: 16,
            child: _IntroTag(
              icon: Icons.bolt_rounded,
              label: 'FIRST ROUND FREE',
              color: AppColors.lime,
            ),
          ),
          Positioned(
            top: 16,
            right: 16,
            child: Container(
              width: 36,
              height: 36,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: .55),
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white24),
              ),
              child: const Text(
                '01',
                style: TextStyle(fontWeight: FontWeight.w900),
              ),
            ),
          ),
          const Positioned(
            left: 18,
            right: 18,
            bottom: 18,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'TRALALERO TRALALA',
                  style: TextStyle(
                    color: AppColors.ink,
                    fontSize: 22,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -.7,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'The algorithm has selected your first opponent.',
                  style: TextStyle(
                    color: AppColors.muted,
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
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

class _IntroTag extends StatelessWidget {
  const _IntroTag({
    required this.icon,
    required this.label,
    required this.color,
  });

  final IconData icon;
  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 7),
    decoration: BoxDecoration(
      color: Colors.black.withValues(alpha: .55),
      borderRadius: BorderRadius.circular(10),
      border: Border.all(color: color.withValues(alpha: .6)),
    ),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: color),
        const SizedBox(width: 5),
        Text(
          label,
          style: TextStyle(
            color: color,
            fontSize: 9,
            fontWeight: FontWeight.w900,
            letterSpacing: .7,
          ),
        ),
      ],
    ),
  );
}
