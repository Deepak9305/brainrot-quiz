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
      body: SafeArea(
        child: ListView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(18, 6, 18, 28),
          children: [
            const _SectionLabel('Gameplay'),
            _Group(
              children: [
                _SettingSwitch(
                  label: 'Sound effects',
                  icon: Icons.volume_up_outlined,
                  value: progress.soundEffects,
                  onChanged: (value) => ref
                      .read(progressProvider.notifier)
                      .setSetting('soundEffects', value),
                ),
                const _RowDivider(),
                _SettingSwitch(
                  label: 'Haptics',
                  icon: Icons.vibration_rounded,
                  value: progress.haptics,
                  onChanged: (value) => ref
                      .read(progressProvider.notifier)
                      .setSetting('haptics', value),
                ),
                const _RowDivider(),
                _SettingSwitch(
                  label: 'Reduce motion',
                  icon: Icons.motion_photos_off_outlined,
                  value: progress.reduceMotion,
                  onChanged: (value) => ref
                      .read(progressProvider.notifier)
                      .setSetting('reduceMotion', value),
                ),
              ],
            ),
            const SizedBox(height: 24),
            const _SectionLabel('About'),
            _Group(
              children: [
                _SettingsLink(
                  label: 'Privacy policy',
                  icon: Icons.lock_outline_rounded,
                  onTap: () => _showInfo(
                    context,
                    'Privacy policy',
                    'Brainrot Quiz works without an account. Your game progress is stored on this device. Ads use the ad configuration included in the build.',
                  ),
                ),
                const _RowDivider(),
                _SettingsLink(
                  label: 'Terms of service',
                  icon: Icons.description_outlined,
                  onTap: () => _showInfo(
                    context,
                    'Terms of service',
                    'Use the app normally and do not redistribute content you do not own.',
                  ),
                ),
                const _RowDivider(),
                _SettingsLink(
                  label: 'Version',
                  icon: Icons.info_outline_rounded,
                  trailing: '1.1.1',
                  onTap: () => _showInfo(
                    context,
                    'Brainrot Quiz 1.1.1',
                    'Fast internet-culture quizzes with no login required.',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            const _SectionLabel('Data'),
            _Group(
              children: [
                _SettingsLink(
                  label: 'Reset progress',
                  icon: Icons.restart_alt_rounded,
                  color: AppColors.red,
                  onTap: () => _confirmReset(context, ref),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  static void _showInfo(BuildContext context, String title, String message) {
    showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w800)),
        content: Text(
          message,
          style: const TextStyle(color: AppColors.muted, height: 1.4),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Done'),
          ),
        ],
      ),
    );
  }

  static Future<void> _confirmReset(
    BuildContext context,
    WidgetRef ref,
  ) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text(
          'Reset progress?',
          style: TextStyle(fontWeight: FontWeight.w800),
        ),
        content: const Text('Scores, streaks and achievements will be cleared.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Reset'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await ref.read(progressProvider.notifier).resetProgress();
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Progress reset.')),
        );
      }
    }
  }
}

class _SectionLabel extends StatelessWidget {
  const _SectionLabel(this.label);

  final String label;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(left: 2, bottom: 8),
        child: Text(
          label,
          style: const TextStyle(
            color: AppColors.muted,
            fontSize: 12,
            fontWeight: FontWeight.w700,
          ),
        ),
      );
}

class _Group extends StatelessWidget {
  const _Group({required this.children});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) => Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.border),
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(children: children),
      );
}

class _RowDivider extends StatelessWidget {
  const _RowDivider();

  @override
  Widget build(BuildContext context) => const Divider(
        height: 1,
        indent: 58,
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
  Widget build(BuildContext context) => SwitchListTile.adaptive(
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
        value: value,
        onChanged: onChanged,
        activeThumbColor: AppColors.lime,
        title: Text(
          label,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
        ),
        secondary: Icon(
          icon,
          color: value ? AppColors.ink : AppColors.subtle,
          size: 20,
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
  Widget build(BuildContext context) => ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 1),
        onTap: onTap,
        leading: Icon(icon, color: color, size: 20),
        title: Text(
          label,
          style: TextStyle(
            color: color,
            fontSize: 14,
            fontWeight: FontWeight.w700,
          ),
        ),
        trailing: trailing != null
            ? Text(
                trailing!,
                style: const TextStyle(
                  color: AppColors.muted,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              )
            : const Icon(
                Icons.chevron_right_rounded,
                color: AppColors.subtle,
                size: 20,
              ),
      );
}
