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
  static const _featuredModes = <GameMode>[
    GameMode.italianBrainrot,
    GameMode.oneSecond,
    GameMode.rush,
    GameMode.impossible,
  ];

  static const _allModes = <GameMode>[
    GameMode.italianBrainrot,
    GameMode.oneSecond,
    GameMode.slang,
    GameMode.finishMeme,
    GameMode.ogBrainrot,
    GameMode.impossible,
    GameMode.rush,
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
    final accent = Theme.of(context).colorScheme.primary;

    return Scaffold(
      body: SafeArea(
        child: ListView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(18, 14, 18, 28),
          children: [
            _TopBar(
              coins: progress.coins,
              onShop: () => context.push('/shop'),
              onAchievements: () => context.push('/achievements'),
              onSettings: () => context.push('/settings'),
            ),
            const SizedBox(height: 18),
            _MainRoundCard(
              accent: accent,
              onPlay: () => _play(GameMode.mix),
            ),
            const SizedBox(height: 10),
            _ProgressRow(
              streak: progress.currentStreak,
              level: progress.level,
              xp: progress.xp,
              bestScore: progress.bestScore,
            ),
            const SizedBox(height: 22),
            _DailyRow(
              streak: progress.dailyStreak,
              completed: progress.dailyCompletedDate == _today(),
              accent: accent,
              onTap: () => _play(GameMode.daily),
            ),
            const SizedBox(height: 24),
            SectionTitle(
              title: 'Modes',
              action: 'All modes',
              onAction: _showAllModes,
            ),
            const SizedBox(height: 4),
            _ModeGroup(modes: _featuredModes, onPlay: _play),
          ],
        ),
      ),
    );
  }

  String _today() {
    final now = DateTime.now();
    return '${now.year.toString().padLeft(4, '0')}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';
  }

  void _showAllModes() {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (sheetContext) => SafeArea(
        child: SizedBox(
          height: MediaQuery.sizeOf(sheetContext).height * .68,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(18, 18, 18, 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Expanded(
                      child: Text(
                        'ALL MODES',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          letterSpacing: -.3,
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: () => Navigator.pop(sheetContext),
                      icon: const Icon(Icons.close_rounded),
                    ),
                  ],
                ),
                const Divider(height: 1),
                Expanded(
                  child: ListView.separated(
                    itemCount: _allModes.length,
                    separatorBuilder: (_, __) => const Divider(height: 1),
                    itemBuilder: (context, index) {
                      final mode = _allModes[index];
                      return _ModeListItem(
                        mode: mode,
                        onTap: () {
                          Navigator.pop(sheetContext);
                          _play(mode);
                        },
                      );
                    },
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

class _TopBar extends StatelessWidget {
  const _TopBar({
    required this.coins,
    required this.onShop,
    required this.onAchievements,
    required this.onSettings,
  });

  final int coins;
  final VoidCallback onShop;
  final VoidCallback onAchievements;
  final VoidCallback onSettings;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Expanded(child: BrainrotLogo(compact: true)),
        _CoinButton(coins: coins, onTap: onShop),
        const SizedBox(width: 7),
        _IconButton(
          tooltip: 'Achievements',
          icon: Icons.emoji_events_outlined,
          onTap: onAchievements,
        ),
        const SizedBox(width: 7),
        _IconButton(
          tooltip: 'Settings',
          icon: Icons.settings_outlined,
          onTap: onSettings,
        ),
      ],
    );
  }
}

class _MainRoundCard extends StatelessWidget {
  const _MainRoundCard({required this.accent, required this.onPlay});

  final Color accent;
  final VoidCallback onPlay;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 226,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppColors.border),
      ),
      clipBehavior: Clip.antiAlias,
      child: Row(
        children: [
          Expanded(
            flex: 11,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 12, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'MAIN ROUND',
                    style: TextStyle(
                      color: accent,
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.2,
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'HOW\nCOOKED\nARE YOU?',
                    style: TextStyle(
                      fontSize: 29,
                      height: .88,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -1.5,
                    ),
                  ),
                  const Spacer(),
                  SizedBox(
                    width: 132,
                    child: BrainrotButton(
                      label: 'PLAY',
                      icon: Icons.play_arrow_rounded,
                      height: 46,
                      onPressed: onPlay,
                    ),
                  ),
                ],
              ),
            ),
          ),
          Expanded(
            flex: 9,
            child: Hero(
              tag: 'tralalero-tralala',
              child: Image.asset(
                'assets/images/tralalero_tralala.webp',
                height: double.infinity,
                fit: BoxFit.cover,
                alignment: Alignment.center,
                errorBuilder: (_, __, ___) =>
                    const ColoredBox(color: AppColors.surfaceRaised),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ProgressRow extends StatelessWidget {
  const _ProgressRow({
    required this.streak,
    required this.level,
    required this.xp,
    required this.bestScore,
  });

  final int streak;
  final int level;
  final int xp;
  final int bestScore;

  @override
  Widget build(BuildContext context) {
    final score = bestScore >= 1000
        ? '${(bestScore / 1000).toStringAsFixed(1)}k'
        : '$bestScore';

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10),
      decoration: const BoxDecoration(
        border: Border(
          top: BorderSide(color: AppColors.border),
          bottom: BorderSide(color: AppColors.border),
        ),
      ),
      child: Row(
        children: [
          StatPill(
            icon: Icons.local_fire_department_outlined,
            label: 'STREAK',
            value: '$streak',
            color: AppColors.orange,
          ),
          const _Divider(),
          StatPill(
            icon: Icons.bolt_rounded,
            label: 'LEVEL $level',
            value: '$xp XP',
            color: Theme.of(context).colorScheme.primary,
          ),
          const _Divider(),
          StatPill(
            icon: Icons.emoji_events_outlined,
            label: 'BEST',
            value: score,
            color: AppColors.cyan,
          ),
        ],
      ),
    );
  }
}

class _DailyRow extends StatelessWidget {
  const _DailyRow({
    required this.streak,
    required this.completed,
    required this.accent,
    required this.onTap,
  });

  final int streak;
  final bool completed;
  final Color accent;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(9),
        child: Ink(
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(9),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              Container(width: 5, height: 68, color: completed ? AppColors.lime : accent),
              const SizedBox(width: 13),
              Icon(
                completed ? Icons.check_rounded : Icons.today_outlined,
                color: completed ? AppColors.lime : AppColors.ink,
                size: 21,
              ),
              const SizedBox(width: 11),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      completed ? 'Daily complete' : 'Daily challenge',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      completed ? 'Come back tomorrow' : 'One shared quiz today',
                      style: const TextStyle(
                        color: AppColors.muted,
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              if (streak > 0) ...[
                const Icon(
                  Icons.local_fire_department_rounded,
                  color: AppColors.orange,
                  size: 16,
                ),
                const SizedBox(width: 3),
                Text('$streak', style: const TextStyle(fontWeight: FontWeight.w800)),
                const SizedBox(width: 8),
              ],
              const Icon(Icons.chevron_right_rounded, color: AppColors.subtle),
              const SizedBox(width: 9),
            ],
          ),
        ),
      ),
    );
  }
}

class _ModeGroup extends StatelessWidget {
  const _ModeGroup({required this.modes, required this.onPlay});

  final List<GameMode> modes;
  final ValueChanged<GameMode> onPlay;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Divider(height: 1),
        for (var i = 0; i < modes.length; i++) ...[
          _ModeListItem(mode: modes[i], onTap: () => onPlay(modes[i])),
          const Divider(height: 1),
        ],
      ],
    );
  }
}

class _ModeListItem extends StatelessWidget {
  const _ModeListItem({required this.mode, required this.onTap});

  final GameMode mode;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 10),
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(7),
                child: SizedBox(
                  width: 48,
                  height: 48,
                  child: mode.imageAsset != null
                      ? Image.asset(
                          mode.imageAsset!,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => const ColoredBox(
                            color: AppColors.surfaceRaised,
                          ),
                        )
                      : ColoredBox(
                          color: AppColors.surfaceRaised,
                          child: Icon(mode.icon, color: mode.accent, size: 21),
                        ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      mode.title,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      mode.subtitle,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: AppColors.muted,
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.arrow_forward_rounded, color: AppColors.subtle, size: 18),
            ],
          ),
        ),
      ),
    );
  }
}

class _CoinButton extends StatelessWidget {
  const _CoinButton({required this.coins, required this.onTap});

  final int coins;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Material(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(8),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(8),
          child: Container(
            height: 38,
            padding: const EdgeInsets.symmetric(horizontal: 9),
            decoration: BoxDecoration(
              border: Border.all(color: AppColors.border),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                const Icon(Icons.bolt_rounded, color: AppColors.orange, size: 16),
                const SizedBox(width: 4),
                Text('$coins', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800)),
              ],
            ),
          ),
        ),
      );
}

class _IconButton extends StatelessWidget {
  const _IconButton({
    required this.tooltip,
    required this.icon,
    required this.onTap,
  });

  final String tooltip;
  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: tooltip,
      child: Material(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(8),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(8),
          child: Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              border: Border.all(color: AppColors.border),
              borderRadius: BorderRadius.circular(8),
            ),
            alignment: Alignment.center,
            child: Icon(icon, size: 18, color: AppColors.ink),
          ),
        ),
      ),
    );
  }
}

class _Divider extends StatelessWidget {
  const _Divider();

  @override
  Widget build(BuildContext context) => Container(
        width: 1,
        height: 28,
        color: AppColors.border,
      );
}
