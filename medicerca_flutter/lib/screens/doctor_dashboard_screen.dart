import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../config/constants.dart';
import '../providers/app_state.dart';

class DoctorDashboardScreen extends StatelessWidget {
  const DoctorDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final user = appState.user;
    final hour = DateTime.now().hour;
    final greeting = hour < 12 ? 'Buenos dias' : (hour < 19 ? 'Buenas tardes' : 'Buenas noches');

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                CircleAvatar(
                  radius: 22,
                  backgroundColor: AppColors.primary,
                  child: Text(
                    user?.initials ?? '?',
                    style: GoogleFonts.dmSans(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '$greeting,',
                        style: GoogleFonts.dmSans(fontSize: 13, color: AppColors.textSecondary),
                      ),
                      Text(
                        'Dr. ${user?.fullName.split(' ').first ?? ''}',
                        style: GoogleFonts.dmSans(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
                // New prescription button
                Container(
                  height: 40,
                  decoration: BoxDecoration(
                    gradient: AppColors.primaryGradient,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.add, size: 18, color: Colors.white),
                    label: const Text('Nueva receta'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Quick actions
            Row(
              children: [
                _DoctorQuickAction(
                  icon: Icons.add_circle_outline,
                  label: 'Nueva\nreceta',
                  color: AppColors.primary,
                  onTap: () {},
                ),
                const SizedBox(width: 10),
                _DoctorQuickAction(
                  icon: Icons.people_outline,
                  label: 'Mis\npacientes',
                  color: AppColors.success,
                  onTap: () {},
                ),
                const SizedBox(width: 10),
                _DoctorQuickAction(
                  icon: Icons.receipt_long_outlined,
                  label: 'Recetas\ncreadas',
                  color: AppColors.warning,
                  onTap: () {},
                ),
                const SizedBox(width: 10),
                _DoctorQuickAction(
                  icon: Icons.calendar_today_outlined,
                  label: 'Citas\nhoy',
                  color: const Color(0xFF8B5CF6),
                  onTap: () {},
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Stats
            Row(
              children: [
                Expanded(child: _DoctorStat(value: '28', label: 'Pacientes', color: AppColors.primary)),
                const SizedBox(width: 10),
                Expanded(child: _DoctorStat(value: '15', label: 'Recetas', color: AppColors.success)),
                const SizedBox(width: 10),
                Expanded(child: _DoctorStat(value: '6', label: 'Citas hoy', color: AppColors.warning)),
              ],
            ),
            const SizedBox(height: 20),

            // Recent activity
            Text(
              'Actividad reciente',
              style: GoogleFonts.dmSans(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 12),
            _ActivityItem(
              icon: Icons.person_add,
              color: AppColors.primary,
              title: 'Nuevo paciente registrado',
              subtitle: 'Maria Lopez',
              time: 'Hoy',
            ),
            const SizedBox(height: 8),
            _ActivityItem(
              icon: Icons.receipt,
              color: AppColors.success,
              title: 'Receta emitida',
              subtitle: 'Paracetamol 500mg - Juan Perez',
              time: 'Ayer',
            ),
            const SizedBox(height: 8),
            _ActivityItem(
              icon: Icons.event_available,
              color: AppColors.warning,
              title: 'Cita completada',
              subtitle: 'Seguimiento - Ana Garcia',
              time: 'Hace 2 dias',
            ),
          ],
        ),
      ),
    );
  }
}

class _DoctorQuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _DoctorQuickAction({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            children: [
              Icon(icon, color: color, size: 22),
              const SizedBox(height: 4),
              Text(
                label,
                textAlign: TextAlign.center,
                style: GoogleFonts.dmSans(
                  fontSize: 10,
                  fontWeight: FontWeight.w500,
                  color: AppColors.textSecondary,
                  height: 1.2,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _DoctorStat extends StatelessWidget {
  final String value;
  final String label;
  final Color color;

  const _DoctorStat({required this.value, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Text(
            value,
            style: GoogleFonts.dmSans(fontSize: 22, fontWeight: FontWeight.w700, color: color),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: GoogleFonts.dmSans(fontSize: 11, color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }
}

class _ActivityItem extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title;
  final String subtitle;
  final String time;

  const _ActivityItem({
    required this.icon,
    required this.color,
    required this.title,
    required this.subtitle,
    required this.time,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: color.withAlpha(20),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.dmSans(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                Text(
                  subtitle,
                  style: GoogleFonts.dmSans(fontSize: 11, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
          Text(
            time,
            style: GoogleFonts.dmSans(fontSize: 10, color: AppColors.textTertiary),
          ),
        ],
      ),
    );
  }
}
