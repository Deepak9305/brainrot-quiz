import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/models/game_mode.dart';
import '../../core/theme/app_theme.dart';
import '../../state/providers.dart';
import '../../widgets/common.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  static const _modes = <GameMode>[
    GameMode.mix,
    GameMode.italianBrainrot,
    GameMode.guessSound,
    GameMode.oneSecond,
    GameMode.slang,
    GameMode.finishMeme,
    GameMode.ogBrainrot,
    GameMode.impossible,
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(adsServiceProvider).initialize();
      ref.read(analyticsServiceProvider).track('app_open');
    });
  }

  void _play(GameMode mode) {
    ref.read(analyticsServiceProvider).track('mode_selected', {
      'mode': mode.name,
    });
    if (mode == GameMode.rush) {
      context.push('/rush');
    } else if (mode == GameMode.daily) {
      context.push('/daily');
    } else {
      context.push('/quiz', extra: mode);
    }
  }

  @override
  Widget build(BuildContext context) {
    final progress = ref.watch(progressProvider);
    return Scaffold(
      body: AppBackground(
        accent: AppColors.pink,
        child: SafeArea(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.fromLTRB(18, 12, 18, 28),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _UtilityRow(
                  coins: progress.coins,
                  onSettings: () => context.push('/settings'),
                ),
                const SizedBox(height: 10),
                const Center(child: BrainrotLogo(center: true)),
                const SizedBox(height: 9),
                const Center(
                  child: Text(
                    'HOW COOKED ARE YOU?',
                    style: TextStyle(
                      color: AppColors.ink,
                      fontSize: 12,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 2.1,
                    ),
                  ),
                ),
                const SizedBox(height: 18),
                _StatusRow(
                  streak: progress.currentStreak,
                  level: progress.level,
                  xp: progress.xp,
                  bestScore: _formatScore(progress.bestScore),
                ),
                const SizedBox(height: 16),
                _PlayDeck(onPlay: () => _play(GameMode.mix)),
                const SizedBox(height: 25),
                SectionTitle(
                  title: 'Game modes',
                  action: 'See all',
                  onAction: () => _showAllModes(context),
                ),
                const SizedBox(height: 12),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _modes.length,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    mainAxisSpacing: 10,
                    crossAxisSpacing: 10,
                    childAspectRatio: .94,
                  ),
                  itemBuilder: (context, index) => ModeCard(
                    mode: _modes[index],
                    onTap: () => _play(_modes[index]),
                  ),
                ),
                const SizedBox(height: 16),
                _DailyStrip(
                  streak: progress.dailyStreak,
                  onTap: () => _play(GameMode.daily),
                ),
                const SizedBox(height: 12),
                _QuickLinkRow(
                  onAchievements: () => context.push('/achievements'),
                  onShop: () => context.push('/shop'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showAllModes(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: AppColors.surface,
      showDragHandle: true,
      builder: (context) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(18, 8, 18, 24),
          child: Wrap(
            runSpacing: 10,
            spacing: 10,
            children: [
              for (final mode in [..._modes, GameMode.daily, GameMode.rush])
                SizedBox(
                  width: (MediaQuery.sizeOf(context).width - 56) / 2,
                  child: ModeCard(
                    mode: mode,
                    onTap: () {
                      Navigator.pop(context);
                      _play(mode);
                    },
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatScore(int score) =>
      score >= 1000 ? '${(score / 1000).toStringAsFixed(1)}k' : '$score';
}

class _UtilityRow extends StatelessWidget {
  const _UtilityRow({required this.coins, required this.onSettings});

  final int coins;
  final VoidCallback onSettings;

  @override
  Widget build(BuildContext context) => Row(
    children: [
      _CoinPill(coins: coins),
      const Spacer(),
      _SettingsButton(onPressed: onSettings),
    ],
  );
}

class _CoinPill extends StatelessWidget {
  const _CoinPill({required this.coins});

  final int coins;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 9),
    decoration: BoxDecoration(
      color: AppColors.surface,
      borderRadius: BorderRadius.circular(13),
      border: Border.all(color: AppColors.border),
    ),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(
          Icons.monetization_on_rounded,
          size: 17,
          color: AppColors.orange,
        ),
        const SizedBox(width: 6),
        Text('$coins', style: const TextStyle(fontWeight: FontWeight.w900)),
      ],
    ),
  );
}

class _SettingsButton extends StatelessWidget {
  const _SettingsButton({required this.onPressed});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) => Container(
    width: 40,
    height: 40,
    decoration: BoxDecoration(
      color: AppColors.surface,
      borderRadius: BorderRadius.circular(13),
      border: Border.all(color: AppColors.border),
    ),
    child: IconButton(
      tooltip: 'Settings',
      padding: EdgeInsets.zero,
      onPressed: onPressed,
      icon: const Icon(Icons.settings_outlined, size: 19),
    ),
  );
}

class _StatusRow extends StatelessWidget {
  const _StatusRow({
    required this.streak,
    required this.level,
    required this.xp,
    required this.bestScore,
  });

  final int streak;
  final int level;
  final int xp;
  final String bestScore;

  @override
  Widget build(BuildContext context) => Row(
    children: [
      StatPill(
        icon: Icons.local_fire_department_rounded,
        label: 'Streak',
        value: '$streak',
        color: AppColors.orange,
      ),
      const SizedBox(width: 8),
      StatPill(
        icon: Icons.bolt_rounded,
        label: 'Level $level',
        value: '$xp',
        color: AppColors.lime,
      ),
      const SizedBox(width: 8),
      StatPill(
        icon: Icons.emoji_events_rounded,
        label: 'Best Score',
        value: bestScore,
        color: AppColors.cyan,
      ),
    ],
  );
}

class _PlayDeck extends StatelessWidget {
  const _PlayDeck({required this.onPlay});

  final VoidCallback onPlay;

  @override
  Widget build(BuildContext context) => Column(
    children: [
      const Row(
        children: [
          Expanded(child: Divider(color: AppColors.border)),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 10),
            child: Text(
              'MIXED INTERNET LORE',
              style: TextStyle(
                color: AppColors.cyan,
                fontSize: 10,
                fontWeight: FontWeight.w900,
                letterSpacing: 1,
              ),
            ),
          ),
          Expanded(child: Divider(color: AppColors.border)),
        ],
      ),
      const SizedBox(height: 10),
      BrainrotButton(
        label: 'PLAY',
        icon: Icons.play_arrow_rounded,
        height: 64,
        onPressed: onPlay,
      ),
      const SizedBox(height: 8),
      const Text(
        '10 QUESTIONS  •  BUILD YOUR STREAK',
        style: TextStyle(
          color: AppColors.muted,
          fontSize: 10,
          fontWeight: FontWeight.w800,
          letterSpacing: .8,
        ),
      ),
    ],
  );
}

class _DailyStrip extends StatelessWidget {
  const _DailyStrip({required this.streak, required this.onTap});

  final int streak;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Material(
    color: Colors.transparent,
    child: InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: SizedBox(
        height: 104,
        child: Ink(
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.lime.withValues(alpha: .6)),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(19),
            child: Stack(
              fit: StackFit.expand,
              children: [
                Positioned(
                  right: -8,
                  top: -24,
                  bottom: -24,
                  child: SizedBox(
                    width: 128,
                    child: Image.asset(
                      'assets/images/tung_tung_tung_sahur.webp',
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) =>
                          const SizedBox.shrink(),
                    ),
                  ),
                ),
                const Positioned.fill(
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                        colors: [
                          AppColors.surface,
                          Color(0xE6111722),
                          Color(0x20111722),
                        ],
                        stops: [0, .58, 1],
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(15, 13, 15, 12),
                  child: Row(
                    children: [
                      Container(
                        width: 38,
                        height: 38,
                        decoration: BoxDecoration(
                          color: AppColors.lime,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(
                          Icons.calendar_today_rounded,
                          color: Colors.black,
                          size: 19,
                        ),
                      ),
                      const SizedBox(width: 10),
                      const Expanded(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "TODAY'S BRAINROT",
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                            SizedBox(height: 3),
                            Text(
                              'Same quiz. New score.',
                              style: TextStyle(
                                color: AppColors.muted,
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.local_fire_department_rounded,
                            color: AppColors.orange,
                            size: 18,
                          ),
                          Text(
                            '$streak',
                            style: const TextStyle(
                              color: AppColors.orange,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(width: 3),
                      const Icon(
                        Icons.chevron_right_rounded,
                        color: AppColors.ink,
                        size: 20,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    ),
  );
}

class _QuickLinkRow extends StatelessWidget {
  const _QuickLinkRow({required this.onAchievements, required this.onShop});

  final VoidCallback onAchievements;
  final VoidCallback onShop;

  @override
  Widget build(BuildContext context) => Row(
    children: [
      Expanded(
        child: _QuickLink(
          icon: Icons.emoji_events_rounded,
          label: 'Achievements',
          color: AppColors.orange,
          onTap: onAchievements,
        ),
      ),
      const SizedBox(width: 10),
      Expanded(
        child: _QuickLink(
          icon: Icons.palette_rounded,
          label: 'Cosmetics shop',
          color: AppColors.purple,
          onTap: onShop,
        ),
      ),
    ],
  );
}

class _QuickLink extends StatelessWidget {
  const _QuickLink({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Material(
    color: Colors.transparent,
    child: InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(15),
      child: Ink(
        padding: const EdgeInsets.all(13),
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border.all(color: AppColors.border),
          borderRadius: BorderRadius.circular(15),
        ),
        child: Row(
          children: [
            Icon(icon, color: color, size: 18),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            const Icon(
              Icons.chevron_right_rounded,
              size: 18,
              color: AppColors.muted,
            ),
          ],
        ),
      ),
    ),
  );
}
