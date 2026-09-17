import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/app_theme.dart';
import '../../state/providers.dart';
import '../../widgets/common.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final progress = ref.watch(progressProvider);
    return Scaffold(
      appBar: const BrainrotAppBar(title: 'Settings'),
      body: AppBackground(
        accent: AppColors.cyan,
        child: SafeArea(
          child: ListView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.fromLTRB(18, 5, 18, 28),
            children: [
              const _SettingsHeader(title: 'Feel', icon: Icons.tune_rounded),
              _SettingSwitch(
                label: 'Music',
                icon: Icons.music_note_rounded,
                value: progress.music,
                onChanged: (value) => ref
                    .read(progressProvider.notifier)
                    .setSetting('music', value),
              ),
              _SettingSwitch(
                label: 'Sound Effects',
                icon: Icons.volume_up_rounded,
                value: progress.soundEffects,
                onChanged: (value) => ref
                    .read(progressProvider.notifier)
                    .setSetting('soundEffects', value),
              ),
              _SettingSwitch(
                label: 'Voice Reactions',
                icon: Icons.record_voice_over_rounded,
                value: progress.voiceReactions,
                onChanged: (value) => ref
                    .read(progressProvider.notifier)
                    .setSetting('voiceReactions', value),
              ),
              _SettingSwitch(
                label: 'Haptics',
                icon: Icons.vibration_rounded,
                value: progress.haptics,
                onChanged: (value) => ref
                    .read(progressProvider.notifier)
                    .setSetting('haptics', value),
              ),
              _SettingSwitch(
                label: 'Reduce Motion',
                icon: Icons.motion_photos_off_rounded,
                value: progress.reduceMotion,
                onChanged: (value) => ref
                    .read(progressProvider.notifier)
                    .setSetting('reduceMotion', value),
              ),
              const SizedBox(height: 20),
              const _SettingsHeader(
                title: 'About',
                icon: Icons.info_outline_rounded,
              ),
              _SettingsLink(
                label: 'Privacy Policy',
                icon: Icons.lock_outline_rounded,
                onTap: () => _showInfo(
                  context,
                  'Privacy Policy',
                  'Brainrot Quiz works without accounts. Progress stays on this device. Ads, when enabled, use Google test or production inventory according to your build configuration.',
                ),
              ),
              _SettingsLink(
                label: 'Terms of Service',
                icon: Icons.description_outlined,
                onTap: () => _showInfo(
                  context,
                  'Terms of Service',
                  'Play fair, respect the memes, and do not redistribute content you do not own.',
                ),
              ),
              _SettingsLink(
                label: 'About',
                icon: Icons.info_outline_rounded,
                trailing: 'v1.0.0',
                onTap: () => _showInfo(
                  context,
                  'Brainrot Quiz',
                  'How cooked are you? Built for fast rounds, big laughs, and zero login screens.',
                ),
              ),
              const SizedBox(height: 20),
              const _SettingsHeader(
                title: 'Danger zone',
                icon: Icons.warning_amber_rounded,
              ),
              _SettingsLink(
                label: 'Reset Progress',
                icon: Icons.restart_alt_rounded,
                color: AppColors.red,
                onTap: () => _confirmReset(context, ref),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showInfo(BuildContext context, String title, String message) =>
      showDialog<void>(
        context: context,
        builder: (context) => AlertDialog(
          backgroundColor: AppColors.surface,
          title: Text(
            title,
            style: const TextStyle(fontWeight: FontWeight.w900),
          ),
          content: Text(
            message,
            style: const TextStyle(color: AppColors.muted, height: 1.4),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('DONE'),
            ),
          ],
        ),
      );

  Future<void> _confirmReset(BuildContext context, WidgetRef ref) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        title: const Text(
          'Reset everything?',
          style: TextStyle(fontWeight: FontWeight.w900),
        ),
        content: const Text(
          'Coins, XP, streaks, and achievements will be cleared.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('CANCEL'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('RESET'),
          ),
        ],
      ),
    );
    if (confirmed == true) {
      await ref.read(progressProvider.notifier).resetProgress();
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Progress reset. Fresh brain cells unlocked.'),
          ),
        );
      }
    }
  }
}

class _SettingsHeader extends StatelessWidget {
  const _SettingsHeader({required this.title, required this.icon});
  final String title;
  final IconData icon;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 9),
    child: Row(
      children: [
        Icon(icon, size: 17, color: AppColors.cyan),
        const SizedBox(width: 7),
        Text(
          title,
          style: const TextStyle(
            color: AppColors.muted,
            fontSize: 12,
            fontWeight: FontWeight.w900,
            letterSpacing: 1.1,
          ),
        ),
      ],
    ),
  );
}

class _SettingSwitch extends StatelessWidget {
  const _SettingSwitch({
    required this.label,
    required this.icon,
    required this.value,
    required this.onChanged,
  });
  final String label;
  final IconData icon;
  final bool value;
  final ValueChanged<bool> onChanged;
  @override
  Widget build(BuildContext context) => Container(
    margin: const EdgeInsets.only(bottom: 8),
    decoration: BoxDecoration(
      color: AppColors.surface,
      borderRadius: BorderRadius.circular(15),
      border: Border.all(color: AppColors.border),
    ),
    child: SwitchListTile.adaptive(
      value: value,
      onChanged: onChanged,
      activeThumbColor: AppColors.lime,
      title: Text(label, style: const TextStyle(fontWeight: FontWeight.w800)),
      secondary: Icon(
        icon,
        color: value ? AppColors.ink : AppColors.muted,
        size: 20,
      ),
    ),
  );
}

class _SettingsLink extends StatelessWidget {
  const _SettingsLink({
    required this.label,
    required this.icon,
    required this.onTap,
    this.trailing,
    this.color = AppColors.ink,
  });
  final String label;
  final IconData icon;
  final VoidCallback onTap;
  final String? trailing;
  final Color color;
  @override
  Widget build(BuildContext context) => Container(
    margin: const EdgeInsets.only(bottom: 8),
    decoration: BoxDecoration(
      color: AppColors.surface,
      borderRadius: BorderRadius.circular(15),
      border: Border.all(color: AppColors.border),
    ),
    child: ListTile(
      onTap: onTap,
      leading: Icon(icon, color: color, size: 20),
      title: Text(
        label,
        style: TextStyle(color: color, fontWeight: FontWeight.w800),
      ),
      trailing: trailing != null
          ? Text(
              trailing!,
              style: const TextStyle(
                color: AppColors.muted,
                fontWeight: FontWeight.w700,
              ),
            )
          : const Icon(Icons.chevron_right_rounded, color: AppColors.muted),
    ),
  );
}
