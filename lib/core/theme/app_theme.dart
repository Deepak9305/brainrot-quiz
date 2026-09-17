import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';

class AppColors {
  static const background = Color(0xFF080B10);
  static const surface = Color(0xFF111722);
  static const surfaceRaised = Color(0xFF182231);
  static const border = Color(0xFF2A3A4E);
  static const ink = Color(0xFFF5F8FC);
  static const muted = Color(0xFF91A2B5);
  static const lime = Color(0xFFAEFF3F);
  static const cyan = Color(0xFF27D8FF);
  static const pink = Color(0xFFFF3AA7);
  static const orange = Color(0xFFFFA63D);
  static const red = Color(0xFFFF5572);
  static const purple = Color(0xFFB779FF);
}

class AppTheme {
  static ThemeData dark() {
    final base = ThemeData.dark(useMaterial3: true);
    return base.copyWith(
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: const ColorScheme.dark(
        surface: AppColors.surface,
        primary: AppColors.lime,
        secondary: AppColors.cyan,
        error: AppColors.red,
      ),
      splashFactory: InkSparkle.splashFactory,
      visualDensity: VisualDensity.standard,
      textTheme: base.textTheme.apply(
        bodyColor: AppColors.ink,
        displayColor: AppColors.ink,
      ),
      appBarTheme: const AppBarTheme(
        centerTitle: false,
        titleSpacing: 0,
        foregroundColor: AppColors.ink,
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
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
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
