import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/app_theme.dart';
import '../../state/providers.dart';
import '../../widgets/common.dart';

class ShopScreen extends ConsumerWidget {
  const ShopScreen({super.key});

  static const _items = [
    ('Neon', 'Neon answer effects', AppColors.cyan, 500, Icons.bolt_rounded),
    (
      'Matrix',
      'Green terminal theme',
      AppColors.lime,
      500,
      Icons.grid_4x4_rounded,
    ),
    (
      'Sunset',
      'Warm score glow',
      AppColors.orange,
      500,
      Icons.wb_sunny_rounded,
    ),
    (
      'Galactic',
      'Cosmic confetti',
      AppColors.purple,
      500,
      Icons.auto_awesome_rounded,
    ),
    (
      'Cartoon',
      'Maximum silly mode',
      AppColors.pink,
      500,
      Icons.sentiment_very_satisfied_rounded,
    ),
    ('Static', 'OG grain effect', AppColors.muted, 350, Icons.texture_rounded),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final coins = ref.watch(progressProvider).coins;
    return Scaffold(
      appBar: BrainrotAppBar(
        title: 'Shop',
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Row(
              children: [
                const Icon(
                  Icons.monetization_on_rounded,
                  color: AppColors.orange,
                  size: 18,
                ),
                const SizedBox(width: 5),
                Text(
                  '$coins',
                  style: const TextStyle(fontWeight: FontWeight.w900),
                ),
              ],
            ),
          ),
        ],
      ),
      body: AppBackground(
        accent: AppColors.purple,
        child: SafeArea(
          child: GridView.builder(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.fromLTRB(18, 5, 18, 26),
            itemCount: _items.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              childAspectRatio: .88,
            ),
            itemBuilder: (context, index) => _ShopItem(
              item: _items[index],
              coins: coins,
              onBuy: () =>
                  _buy(context, ref, _items[index].$1, _items[index].$4),
            ),
          ),
        ),
      ),
    );
  }

  void _buy(BuildContext context, WidgetRef ref, String name, int price) {
    if (ref.read(progressProvider).coins < price) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Not enough brain coins. Go cook a quiz first.'),
        ),
      );
      return;
    }
    ref.read(progressProvider.notifier).addCoins(-price);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('$name equipped. Your aura is different now.')),
    );
  }
}

class _ShopItem extends StatelessWidget {
  const _ShopItem({
    required this.item,
    required this.coins,
    required this.onBuy,
  });
  final (String, String, Color, int, IconData) item;
  final int coins;
  final VoidCallback onBuy;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: item.$3.withValues(alpha: .12),
      borderRadius: BorderRadius.circular(18),
      border: Border.all(color: item.$3.withValues(alpha: .5)),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Container(
            width: double.infinity,
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(item.$5, color: item.$3, size: 42),
          ),
        ),
        const SizedBox(height: 10),
        Text(item.$1, style: const TextStyle(fontWeight: FontWeight.w900)),
        const SizedBox(height: 2),
        Text(
          item.$2,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
            color: AppColors.muted,
            fontSize: 10,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 33,
          width: double.infinity,
          child: OutlinedButton(
            onPressed: coins >= item.$4 ? onBuy : null,
            style: OutlinedButton.styleFrom(
              side: BorderSide(color: item.$3),
              padding: EdgeInsets.zero,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.monetization_on_rounded,
                  size: 14,
                  color: AppColors.orange,
                ),
                const SizedBox(width: 4),
                Text(
                  '${item.$4}',
                  style: const TextStyle(fontWeight: FontWeight.w900),
                ),
              ],
            ),
          ),
        ),
      ],
    ),
  );
}
