import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class AppColors {
  static const background = Color(0xFF0B0C0E);
  static const surface = Color(0xFF131519);
  static const surfaceRaised = Color(0xFF1A1D22);
  static const surfaceSoft = Color(0xFF20242A);
  static const border = Color(0xFF2A2E35);
  static const ink = Color(0xFFF5F5F3);
  static const muted = Color(0xFF9A9EA6);
  static const subtle = Color(0xFF6D727B);

  // Keep the game playful, but use accents with restraint.
  static const lime = Color(0xFFD7FF4A);
  static const cyan = Color(0xFF7DDCFF);
  static const pink = Color(0xFFFF6FAE);
  static const orange = Color(0xFFFFB24D);
  static const red = Color(0xFFFF667A);
  static const purple = Color(0xFFA991FF);
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
              fontSize: 42,
              height: .96,
              letterSpacing: -2.1,
              fontWeight: FontWeight.w900,
              color: AppColors.ink,
            ),
            headlineLarge: const TextStyle(
              fontSize: 30,
              height: 1,
              letterSpacing: -1.2,
              fontWeight: FontWeight.w900,
              color: AppColors.ink,
            ),
            titleLarge: const TextStyle(
              fontSize: 21,
              height: 1.1,
              letterSpacing: -.45,
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
              height: 1.35,
              fontWeight: FontWeight.w600,
              color: AppColors.muted,
            ),
          ),
      appBarTheme: const AppBarTheme(
        centerTitle: false,
        titleSpacing: 0,
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: Colors.transparent,
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
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: AppColors.surface,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
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
