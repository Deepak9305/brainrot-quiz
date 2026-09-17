import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../core/models/game_mode.dart';
import '../core/theme/app_theme.dart';

class AppBackground extends StatelessWidget {
  const AppBackground({
    super.key,
    required this.child,
    this.accent = AppColors.lime,
  });

  final Widget child;
  final Color accent;

  @override
  Widget build(BuildContext context) => ColoredBox(
        color: AppColors.background,
        child: child,
      );
}

class BrainrotLogo extends StatelessWidget {
  const BrainrotLogo({super.key, this.center = false, this.compact = false});

  final bool center;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final accent = Theme.of(context).colorScheme.primary;
    return Text.rich(
      TextSpan(
        children: [
          const TextSpan(text: 'BRAINROT '),
          TextSpan(text: 'QUIZ', style: TextStyle(color: accent)),
        ],
      ),
      textAlign: center ? TextAlign.center : TextAlign.left,
      style: TextStyle(
        fontSize: compact ? 17 : 21,
        fontWeight: FontWeight.w900,
        letterSpacing: compact ? -.65 : -.9,
      ),
    );
  }
}

class BrainrotAppBar extends StatelessWidget implements PreferredSizeWidget {
  const BrainrotAppBar({
    super.key,
    required this.title,
    this.showBack = true,
    this.actions = const [],
  });

  final String title;
  final bool showBack;
  final List<Widget> actions;

  @override
  Size get preferredSize => const Size.fromHeight(56);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      leading: showBack
          ? IconButton(
              tooltip: 'Go back',
              onPressed: () => Navigator.of(context).maybePop(),
              icon: const Icon(Icons.arrow_back_rounded, size: 21),
            )
          : null,
      title: Text(
        title,
        style: const TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w800,
          letterSpacing: -.45,
        ),
      ),
      actions: actions,
    );
  }
}

class StatPill extends StatelessWidget {
  const StatPill({
    super.key,
    required this.icon,
    required this.label,
    required this.value,
    this.color = AppColors.ink,
  });

  final IconData icon;
  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 3),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(icon, color: color, size: 14),
                const SizedBox(width: 5),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 3),
            Text(
              label,
              style: const TextStyle(
                color: AppColors.subtle,
                fontSize: 9,
                fontWeight: FontWeight.w700,
                letterSpacing: .5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class BrainrotButton extends StatelessWidget {
  const BrainrotButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.color,
    this.foreground = Colors.black,
    this.icon,
    this.outlined = false,
    this.height = 52,
  });

  final String label;
  final VoidCallback? onPressed;
  final Color? color;
  final Color foreground;
  final IconData? icon;
  final bool outlined;
  final double height;

  @override
  Widget build(BuildContext context) {
    final accent = color ?? Theme.of(context).colorScheme.primary;
    final shape = RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(9),
    );

    return Semantics(
      button: true,
      enabled: onPressed != null,
      label: label,
      child: SizedBox(
        height: height,
        width: double.infinity,
        child: ElevatedButton.icon(
          onPressed: onPressed,
          icon: icon == null ? const SizedBox.shrink() : Icon(icon, size: 18),
          label: Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w900,
              letterSpacing: .2,
            ),
          ),
          style: ElevatedButton.styleFrom(
            backgroundColor: outlined ? Colors.transparent : accent,
            foregroundColor: outlined ? accent : foreground,
            disabledBackgroundColor: AppColors.surfaceRaised,
            disabledForegroundColor: AppColors.subtle,
            elevation: 0,
            shadowColor: Colors.transparent,
            side: outlined ? BorderSide(color: AppColors.border) : BorderSide.none,
            shape: shape,
            padding: const EdgeInsets.symmetric(horizontal: 18),
          ),
        ),
      ),
    );
  }
}

class SectionTitle extends StatelessWidget {
  const SectionTitle({
    super.key,
    required this.title,
    this.action,
    this.onAction,
  });

  final String title;
  final String? action;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Text(
            title.toUpperCase(),
            style: const TextStyle(
              color: AppColors.muted,
              fontSize: 11,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.2,
            ),
          ),
        ),
        if (action != null)
          TextButton(
            onPressed: onAction,
            child: Text(
              action!,
              style: const TextStyle(
                color: AppColors.muted,
                fontSize: 11,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
      ],
    );
  }
}

class ModeCard extends StatelessWidget {
  const ModeCard({super.key, required this.mode, required this.onTap});

  final GameMode mode;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(10),
        child: Ink(
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: AppColors.border),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(9),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: SizedBox(
                    width: double.infinity,
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
                            child: Center(
                              child: Icon(
                                mode.icon,
                                color: mode.accent,
                                size: 30,
                              ),
                            ),
                          ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(11, 9, 11, 10),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        mode.title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 13,
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
                          fontSize: 10,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
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

class ProgressBar extends StatelessWidget {
  const ProgressBar({
    super.key,
    required this.value,
    this.color,
    this.height = 5,
  });

  final double value;
  final Color? color;
  final double height;

  @override
  Widget build(BuildContext context) {
    final accent = color ?? Theme.of(context).colorScheme.primary;
    return ClipRRect(
      borderRadius: BorderRadius.circular(height),
      child: LinearProgressIndicator(
        minHeight: height,
        value: value.clamp(0, 1),
        backgroundColor: AppColors.surfaceRaised,
        color: accent,
      ),
    );
  }
}

class AnswerCard extends StatelessWidget {
  const AnswerCard({
    super.key,
    required this.index,
    required this.answer,
    required this.onTap,
    this.selected = false,
    this.correct = false,
    this.revealed = false,
  });

  final int index;
  final String answer;
  final VoidCallback? onTap;
  final bool selected;
  final bool correct;
  final bool revealed;

  @override
  Widget build(BuildContext context) {
    final isCorrectState = revealed && correct;
    final isWrongState = revealed && selected && !correct;
    final accent = isCorrectState
        ? AppColors.lime
        : isWrongState
            ? AppColors.red
            : selected
                ? AppColors.ink
                : AppColors.subtle;
    final border = isCorrectState
        ? AppColors.lime
        : isWrongState
            ? AppColors.red
            : selected
                ? AppColors.ink
                : AppColors.border;

    return Semantics(
      button: true,
      enabled: !revealed && onTap != null,
      label: 'Option ${String.fromCharCode(65 + index)}: $answer',
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: revealed ? null : onTap,
          borderRadius: BorderRadius.circular(9),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            minHeight: 56,
            padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 10),
            decoration: BoxDecoration(
              color: isCorrectState
                  ? AppColors.lime.withValues(alpha: .07)
                  : isWrongState
                      ? AppColors.red.withValues(alpha: .07)
                      : AppColors.surface,
              borderRadius: BorderRadius.circular(9),
              border: Border.all(color: border),
            ),
            child: Row(
              children: [
                Container(
                  width: 30,
                  height: 30,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: AppColors.surfaceRaised,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    String.fromCharCode(65 + index),
                    style: TextStyle(
                      color: accent,
                      fontSize: 12,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
                const SizedBox(width: 11),
                Expanded(
                  child: Text(
                    answer,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 14,
                      height: 1.18,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                if (isCorrectState)
                  const Icon(Icons.check_rounded, color: AppColors.lime, size: 20),
                if (isWrongState)
                  const Icon(Icons.close_rounded, color: AppColors.red, size: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class BrainrotImage extends StatelessWidget {
  const BrainrotImage({
    super.key,
    this.assetPath,
    this.height = 190,
    this.fit = BoxFit.cover,
    this.semanticLabel,
  });

  final String? assetPath;
  final double height;
  final BoxFit fit;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(10),
      child: SizedBox(
        height: height,
        width: double.infinity,
        child: Image.asset(
          assetPath ?? 'assets/images/tralalero_tralala.webp',
          fit: fit,
          semanticLabel: semanticLabel,
          errorBuilder: (_, __, ___) => const ColoredBox(
            color: AppColors.surfaceRaised,
            child: Center(
              child: Icon(
                Icons.image_not_supported_outlined,
                color: AppColors.subtle,
                size: 32,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class AudioButton extends StatefulWidget {
  const AudioButton({super.key, this.audioAsset});

  final String? audioAsset;

  @override
  State<AudioButton> createState() => _AudioButtonState();
}

class _AudioButtonState extends State<AudioButton> {
  bool _playing = false;

  Future<void> _toggle() async {
    setState(() => _playing = !_playing);
    if (_playing) {
      await SystemSound.play(SystemSoundType.click);
    }
    Future<void>.delayed(const Duration(milliseconds: 900), () {
      if (mounted) setState(() => _playing = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: _playing ? 'Playing sound' : 'Play sound',
      child: Container(
        height: 142,
        width: double.infinity,
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppColors.border),
        ),
        child: Center(
          child: InkWell(
            onTap: _toggle,
            borderRadius: BorderRadius.circular(40),
            child: Container(
              width: 64,
              height: 64,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.ink,
              ),
              alignment: Alignment.center,
              child: Icon(
                _playing ? Icons.graphic_eq_rounded : Icons.volume_up_rounded,
                color: Colors.black,
                size: 28,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
