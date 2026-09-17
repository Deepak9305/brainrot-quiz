import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class AppColors {
  static const background = Color(0xFF0B0B0C);
  static const surface = Color(0xFF141416);
  static const surfaceRaised = Color(0xFF1B1B1E);
  static const surfaceSoft = Color(0xFF202024);
  static const border = Color(0xFF2B2B30);
  static const ink = Color(0xFFF6F6F2);
  static const muted = Color(0xFFA0A0A8);
  static const subtle = Color(0xFF707078);

  // Acid lime is the product accent. The rest are semantic/game-mode accents.
  static const lime = Color(0xFFD9FF53);
  static const cyan = Color(0xFF7EC8E3);
  static const pink = Color(0xFFE783A9);
  static const orange = Color(0xFFE7A84F);
  static const red = Color(0xFFEA6D78);
  static const purple = Color(0xFFA493D6);
}

class AppTheme {
  static ThemeData dark() {
    final base = ThemeData.dark(useMaterial3: true);

    return base.copyWith(
      scaffoldBackgroundColor: AppColors.background,
      canvasColor: AppColors.background,
      colorScheme: const ColorScheme.dark(
        surface: AppColors.surface,
        primary: AppColors.lime,
        secondary: AppColors.cyan,
        error: AppColors.red,
      ),
      splashFactory: InkRipple.splashFactory,
      visualDensity: VisualDensity.standard,
      textTheme: base.textTheme
          .apply(bodyColor: AppColors.ink, displayColor: AppColors.ink)
          .copyWith(
            displayLarge: const TextStyle(
              fontSize: 40,
              height: .96,
              letterSpacing: -1.8,
              fontWeight: FontWeight.w900,
              color: AppColors.ink,
            ),
            headlineLarge: const TextStyle(
              fontSize: 29,
              height: 1.02,
              letterSpacing: -1.0,
              fontWeight: FontWeight.w900,
              color: AppColors.ink,
            ),
            titleLarge: const TextStyle(
              fontSize: 20,
              height: 1.12,
              letterSpacing: -.35,
              fontWeight: FontWeight.w800,
              color: AppColors.ink,
            ),
            titleMedium: const TextStyle(
              fontSize: 16,
              height: 1.2,
              fontWeight: FontWeight.w800,
              color: AppColors.ink,
            ),
            bodyLarge: const TextStyle(
              fontSize: 16,
              height: 1.4,
              fontWeight: FontWeight.w600,
              color: AppColors.ink,
            ),
            bodyMedium: const TextStyle(
              fontSize: 14,
              height: 1.38,
              fontWeight: FontWeight.w500,
              color: AppColors.muted,
            ),
          ),
      appBarTheme: const AppBarTheme(
        centerTitle: false,
        titleSpacing: 0,
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: AppColors.background,
        surfaceTintColor: Colors.transparent,
        foregroundColor: AppColors.ink,
      ),
      dividerTheme: const DividerThemeData(
        color: AppColors.border,
        thickness: 1,
      ),
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        backgroundColor: AppColors.surfaceRaised,
        contentTextStyle: base.textTheme.bodyMedium?.copyWith(
          color: AppColors.ink,
          fontWeight: FontWeight.w700,
        ),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: AppColors.surface,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      ),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: AppColors.surface,
        surfaceTintColor: Colors.transparent,
        modalBackgroundColor: AppColors.surface,
      ),
      pageTransitionsTheme: const PageTransitionsTheme(
        builders: {
          TargetPlatform.android: FadeUpwardsPageTransitionsBuilder(),
          TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
        },
      ),
    );
  }
}
