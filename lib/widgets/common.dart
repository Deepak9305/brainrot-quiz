import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../core/models/game_mode.dart';
import '../core/theme/app_theme.dart';

class AppBackground extends StatelessWidget {
  const AppBackground({
    super.key,
    required this.child,
    this.accent = AppColors.cyan,
  });

  final Widget child;
  final Color accent;

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: AppColors.background,
      child: Stack(
        children: [
          Positioned(
            top: -100,
            right: -90,
            child: _Glow(color: accent.withValues(alpha: .16), size: 280),
          ),
          Positioned(
            bottom: -160,
            left: -120,
            child: _Glow(
              color: AppColors.pink.withValues(alpha: .09),
              size: 300,
            ),
          ),
          child,
        ],
      ),
    );
  }
}

class _Glow extends StatelessWidget {
  const _Glow({required this.color, required this.size});
  final Color color;
  final double size;

  @override
  Widget build(BuildContext context) => Container(
    width: size,
    height: size,
    decoration: BoxDecoration(
      shape: BoxShape.circle,
      gradient: RadialGradient(colors: [color, color.withValues(alpha: 0)]),
    ),
  );
}

class BrainrotLogo extends StatelessWidget {
  const BrainrotLogo({super.key, this.center = false, this.compact = false});

  final bool center;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final title = Text.rich(
      TextSpan(
        children: [
          TextSpan(
            text: 'BRAINROT',
            style: TextStyle(
              color: AppColors.cyan,
              fontSize: compact ? 20 : 27,
              fontWeight: FontWeight.w900,
              letterSpacing: -1.3,
              height: .9,
            ),
          ),
          TextSpan(
            text: '\nQUIZ',
            style: TextStyle(
              color: AppColors.pink,
              fontSize: compact ? 18 : 25,
              fontWeight: FontWeight.w900,
              letterSpacing: -1.1,
              height: .94,
            ),
          ),
        ],
      ),
      textAlign: center ? TextAlign.center : TextAlign.left,
    );
    return title;
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
  Size get preferredSize => const Size.fromHeight(68);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.transparent,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      leading: showBack
          ? IconButton(
              tooltip: 'Go back',
              onPressed: () => Navigator.of(context).maybePop(),
              icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 19),
            )
          : null,
      title: Text(
        title,
        style: const TextStyle(
          fontSize: 23,
          fontWeight: FontWeight.w900,
          letterSpacing: -.5,
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
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 11),
        decoration: BoxDecoration(
          color: AppColors.surface.withValues(alpha: .86),
          borderRadius: BorderRadius.circular(15),
          border: Border.all(color: AppColors.border.withValues(alpha: .8)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 18),
            const SizedBox(height: 4),
            Text(
              value,
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900),
            ),
            Text(
              label,
              style: const TextStyle(
                color: AppColors.muted,
                fontSize: 10,
                fontWeight: FontWeight.w700,
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
    this.color = AppColors.lime,
    this.foreground = Colors.black,
    this.icon,
    this.outlined = false,
    this.height = 58,
  });

  final String label;
  final VoidCallback? onPressed;
  final Color color;
  final Color foreground;
  final IconData? icon;
  final bool outlined;
  final double height;

  @override
  Widget build(BuildContext context) {
    final shape = RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(18),
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
          icon: icon == null ? const SizedBox.shrink() : Icon(icon, size: 19),
          label: Text(
            label,
            style: const TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w900,
              letterSpacing: .5,
            ),
          ),
          style: ElevatedButton.styleFrom(
            backgroundColor: outlined ? Colors.transparent : color,
            foregroundColor: foreground,
            disabledBackgroundColor: AppColors.surfaceRaised,
            disabledForegroundColor: AppColors.muted,
            elevation: outlined ? 0 : 8,
            shadowColor: outlined
                ? Colors.transparent
                : color.withValues(alpha: .25),
            side: outlined
                ? BorderSide(color: color, width: 1.2)
                : BorderSide.none,
            shape: shape,
            padding: const EdgeInsets.symmetric(horizontal: 22),
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
        Text(
          title,
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
        ),
        const Spacer(),
        if (action != null)
          TextButton(
            onPressed: onAction,
            child: Text(
              action!,
              style: const TextStyle(
                color: AppColors.cyan,
                fontWeight: FontWeight.w800,
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
    final imageAsset = mode.imageAsset;
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Ink(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: mode.accent.withValues(alpha: .16),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: mode.accent.withValues(alpha: .55)),
            boxShadow: [
              BoxShadow(
                color: mode.accent.withValues(alpha: .08),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                height: 72,
                width: double.infinity,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(13),
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      if (imageAsset != null)
                        Image.asset(
                          imageAsset,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) =>
                              ColoredBox(
                                color: mode.accent.withValues(alpha: .25),
                              ),
                        )
                      else
                        ColoredBox(color: mode.accent.withValues(alpha: .24)),
                      DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.black.withValues(alpha: .02),
                              Colors.black.withValues(alpha: .5),
                            ],
                          ),
                        ),
                      ),
                      Positioned(
                        left: 8,
                        top: 8,
                        child: Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: mode.accent,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Icon(mode.icon, color: Colors.black, size: 18),
                        ),
                      ),
                      if (imageAsset == null)
                        Center(
                          child: Icon(mode.icon, color: mode.accent, size: 38),
                        ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 9),
              Text(
                mode.title,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(height: 3),
              Text(
                mode.subtitle,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 10,
                  color: AppColors.muted,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
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
    this.color = AppColors.cyan,
    this.height = 8,
  });
  final double value;
  final Color color;
  final double height;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(height),
      child: LinearProgressIndicator(
        minHeight: height,
        value: value.clamp(0, 1),
        backgroundColor: AppColors.surfaceRaised,
        color: color,
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
        ? AppColors.cyan
        : AppColors.muted;
    final outline = isCorrectState
        ? AppColors.lime
        : isWrongState
        ? AppColors.red
        : selected
        ? AppColors.cyan
        : AppColors.border;
    return Semantics(
      button: true,
      enabled: !revealed && onTap != null,
      label: 'Option ${String.fromCharCode(65 + index)}: $answer',
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: revealed ? null : onTap,
          borderRadius: BorderRadius.circular(16),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 220),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 13),
            decoration: BoxDecoration(
              color: isCorrectState
                  ? AppColors.lime.withValues(alpha: .16)
                  : isWrongState
                  ? AppColors.red.withValues(alpha: .14)
                  : AppColors.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: outline,
                width: selected || isCorrectState ? 1.6 : 1,
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 31,
                  height: 31,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: accent.withValues(alpha: .18),
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    String.fromCharCode(65 + index),
                    style: TextStyle(
                      color: accent,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    answer,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 14.5,
                      height: 1.15,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
                if (isCorrectState)
                  const Icon(
                    Icons.check_circle_rounded,
                    color: AppColors.lime,
                    size: 22,
                  ),
                if (isWrongState)
                  const Icon(
                    Icons.cancel_rounded,
                    color: AppColors.red,
                    size: 22,
                  ),
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
      borderRadius: BorderRadius.circular(22),
      child: SizedBox(
        height: height,
        width: double.infinity,
        child: Image.asset(
          assetPath ?? 'assets/images/tralalero_tralala.webp',
          fit: fit,
          semanticLabel: semanticLabel,
          errorBuilder: (context, error, stackTrace) => const ColoredBox(
            color: AppColors.surfaceRaised,
            child: Center(
              child: Icon(
                Icons.image_not_supported_outlined,
                color: AppColors.muted,
                size: 40,
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
        height: 190,
        width: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [AppColors.cyan.withValues(alpha: .17), AppColors.surface],
          ),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: AppColors.cyan.withValues(alpha: .6)),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Material(
                color: AppColors.cyan,
                shape: const CircleBorder(),
                child: InkWell(
                  onTap: _toggle,
                  customBorder: const CircleBorder(),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 220),
                    width: _playing ? 82 : 72,
                    height: _playing ? 82 : 72,
                    alignment: Alignment.center,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.cyan,
                    ),
                    child: Icon(
                      _playing
                          ? Icons.graphic_eq_rounded
                          : Icons.volume_up_rounded,
                      color: Colors.black,
                      size: 35,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                _playing ? 'LISTENING...' : 'TAP TO PLAY',
                style: TextStyle(
                  color: _playing ? AppColors.cyan : AppColors.muted,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.4,
                  fontSize: 12,
                ),
              ),
              const SizedBox(height: 3),
              const Text(
                'sound cue',
                style: TextStyle(color: AppColors.muted, fontSize: 10),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
