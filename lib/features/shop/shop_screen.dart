import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/app_theme.dart';
import '../../state/providers.dart';
import '../../widgets/common.dart';

class ShopScreen extends ConsumerWidget {
  const ShopScreen({super.key});

  static const _themes = [
    ('acid', 'Acid', 'The default Brainrot Quiz look.', AppColors.lime, 0),
    ('cyan', 'Ice', 'Cold blue accent.', AppColors.cyan, 450),
    ('pink', 'Bubblegum', 'Hot pink accent.', AppColors.pink, 450),
    ('orange', 'Heat', 'Warm orange accent.', AppColors.orange, 450),
    ('purple', 'Glitch', 'Purple accent.', AppColors.purple, 600),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final progress = ref.watch(progressProvider);

    return Scaffold(
      appBar: BrainrotAppBar(
        title: 'Themes',
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Row(
              children: [
                const Icon(Icons.bolt_rounded, color: AppColors.orange, size: 17),
                const SizedBox(width: 4),
                Text(
                  '${progress.coins}',
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: ListView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(18, 8, 18, 28),
          children: [
            const Text(
              'CHANGE THE ACCENT. KEEP THE CHAOS.',
              style: TextStyle(
                color: AppColors.muted,
                fontSize: 10,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.1,
              ),
            ),
            const SizedBox(height: 10),
            const Divider(height: 1),
            for (final theme in _themes) ...[
              _ThemeRow(
                id: theme.$1,
                name: theme.$2,
                subtitle: theme.$3,
                color: theme.$4,
                price: theme.$5,
                owned: progress.ownedThemes.contains(theme.$1),
                equipped: progress.equippedTheme == theme.$1,
                onTap: () => _selectTheme(
                  context,
                  ref,
                  id: theme.$1,
                  name: theme.$2,
                  price: theme.$5,
                ),
              ),
              const Divider(height: 1),
            ],
            const SizedBox(height: 16),
            const Text(
              'Earn coins by finishing rounds. Purchased themes stay on this device.',
              style: TextStyle(
                color: AppColors.muted,
                fontSize: 11,
                height: 1.35,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _selectTheme(
    BuildContext context,
    WidgetRef ref, {
    required String id,
    required String name,
    required int price,
  }) {
    final notifier = ref.read(progressProvider.notifier);
    final progress = ref.read(progressProvider);

    if (progress.equippedTheme == id) return;

    if (progress.ownedThemes.contains(id)) {
      notifier.equipTheme(id);
      return;
    }

    final purchased = notifier.buyTheme(id, price);
    if (!purchased) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('You need $price coins for $name.')),
      );
    }
  }
}

class _ThemeRow extends StatelessWidget {
  const _ThemeRow({
    required this.id,
    required this.name,
    required this.subtitle,
    required this.color,
    required this.price,
    required this.owned,
    required this.equipped,
    required this.onTap,
  });

  final String id;
  final String name;
  final String subtitle;
  final Color color;
  final int price;
  final bool owned;
  final bool equipped;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final trailing = equipped
        ? 'EQUIPPED'
        : owned
            ? 'USE'
            : '$price';

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 13),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppColors.border),
                ),
                alignment: Alignment.center,
                child: Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    color: color,
                    borderRadius: BorderRadius.circular(5),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        color: AppColors.muted,
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 10),
              if (!owned)
                const Icon(Icons.bolt_rounded, color: AppColors.orange, size: 15),
              if (!owned) const SizedBox(width: 3),
              Text(
                trailing,
                style: TextStyle(
                  color: equipped ? color : AppColors.ink,
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  letterSpacing: .55,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
