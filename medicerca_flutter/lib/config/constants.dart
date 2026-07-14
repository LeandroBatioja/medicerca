import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  static const Color primary = Color(0xFF0369A1);
  static const Color primaryLight = Color(0xFF0EA5E9);
  static const Color primaryDark = Color(0xFF075985);
  static const Color primaryBg = Color(0xFFE0F2FE);
  static const Color primary50 = Color(0xFFF0F9FF);

  static const Color success = Color(0xFF059669);
  static const Color successLight = Color(0xFF10B981);
  static const Color successBg = Color(0xFFECFDF5);

  static const Color warning = Color(0xFFD97706);
  static const Color warningBg = Color(0xFFFFFBEB);

  static const Color bg = Color(0xFFF1F5F9);
  static const Color surface = Colors.white;
  static const Color surfaceElevated = Colors.white;

  static const Color textPrimary = Color(0xFF1E293B);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color textTertiary = Color(0xFF94A3B8);
  static const Color textOnPrimary = Colors.white;

  static const Color border = Color(0xFFE2E8F0);
  static const Color borderLight = Color(0xFFF1F5F9);
  static const Color divider = Color(0xFFE2E8F0);

  static const Color inputBg = Color(0xFFF8FAFC);
  static const Color inputBorder = Color(0xFFCBD5E1);

  static const Color overlay = Color(0x33000000);

  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFF0369A1), Color(0xFF0EA5E9)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient surfaceGradient = LinearGradient(
    colors: [Color(0xFF0369A1), Color(0xFF0284C7)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
