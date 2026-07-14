import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../config/constants.dart';
import '../config/models.dart';
import '../providers/app_state.dart';
import 'login_screen.dart';

class PerfilScreen extends StatelessWidget {
  const PerfilScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final user = appState.user;
    final isDoctor = appState.role == UserRole.doctor;

    return Scaffold(
      appBar: AppBar(title: const Text('Mi perfil')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const SizedBox(height: 16),
            CircleAvatar(
              radius: 44,
              backgroundColor: AppColors.primary,
              child: Text(
                user?.initials ?? '?',
                style: GoogleFonts.dmSans(
                  fontSize: AppFontSize.heading,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              user?.fullName ?? '',
              style: GoogleFonts.dmSans(
                fontSize: AppFontSize.title,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 4),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(
                color: isDoctor ? AppColors.primaryBg : AppColors.successBg,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                isDoctor ? 'Doctor' : 'Paciente',
                style: GoogleFonts.dmSans(
                  fontSize: AppFontSize.body,
                  fontWeight: FontWeight.w600,
                  color: isDoctor ? AppColors.primary : AppColors.success,
                ),
              ),
            ),
            const SizedBox(height: 24),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                children: [
                  _ProfileRow(
                    icon: Icons.email_outlined,
                    label: 'Email',
                    value: user?.email ?? '',
                  ),
                  const Divider(height: 24),
                  _ProfileRow(
                    icon: Icons.badge_outlined,
                    label: 'Rol',
                    value: isDoctor ? 'Doctor' : 'Paciente',
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: OutlinedButton.icon(
                onPressed: () async {
                  final confirm = await showDialog<bool>(
                    context: context,
                    builder: (ctx) => AlertDialog(
                      title: Text(
                        'Cerrar sesion',
                        style: GoogleFonts.dmSans(
                          fontSize: AppFontSize.body,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      content: Text(
                        'Estas seguro que quieres cerrar sesion?',
                        style: GoogleFonts.dmSans(
                          fontSize: AppFontSize.body,
                        ),
                      ),
                      actions: [
                        SizedBox(
                          height: 48,
                          child: TextButton(
                            onPressed: () => Navigator.pop(ctx, false),
                            child: Text(
                              'Cancelar',
                              style: GoogleFonts.dmSans(
                                fontSize: AppFontSize.body,
                              ),
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 48,
                          child: TextButton(
                            onPressed: () => Navigator.pop(ctx, true),
                            child: Text(
                              'Cerrar sesion',
                              style: GoogleFonts.dmSans(
                                fontSize: AppFontSize.body,
                                color: Colors.red,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                  if (confirm == true) {
                    await appState.logout();
                    if (context.mounted) {
                      Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(builder: (_) => const LoginScreen()),
                        (_) => false,
                      );
                    }
                  }
                },
                icon: const Icon(Icons.logout, color: Colors.red, size: 22),
                label: Text(
                  'Cerrar sesion',
                  style: GoogleFonts.dmSans(
                    fontSize: AppFontSize.body,
                    fontWeight: FontWeight.w600,
                    color: Colors.red,
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.red),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProfileRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _ProfileRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 22, color: AppColors.textSecondary),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: GoogleFonts.dmSans(
                  fontSize: AppFontSize.body,
                  color: AppColors.textTertiary,
                ),
              ),
              Text(
                value,
                style: GoogleFonts.dmSans(
                  fontSize: AppFontSize.body,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
