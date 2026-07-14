import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../config/constants.dart';
import '../config/models.dart';
import '../providers/app_state.dart';
import 'crear_receta_screen.dart';
import 'pacientes_screen.dart';

class DoctorDashboardScreen extends StatefulWidget {
  const DoctorDashboardScreen({super.key});

  @override
  State<DoctorDashboardScreen> createState() => _DoctorDashboardScreenState();
}

class _DoctorDashboardScreenState extends State<DoctorDashboardScreen> {
  List<Patient> _patients = [];
  List<Prescription> _prescriptions = [];
  List<Appointment> _appointments = [];
  bool _loading = true;
  int _lastLoadedTab = -1;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final appState = context.read<AppState>();
    if (appState.currentTab == 0 && appState.currentTab != _lastLoadedTab) {
      _lastLoadedTab = appState.currentTab;
      _load();
    }
  }

  Future<void> _load() async {
    try {
      final appState = context.read<AppState>();
      final results = await Future.wait([
        appState.api.getPatients(),
        appState.api.getCreatedPrescriptions(),
        appState.api.getDoctorAppointments(),
      ]);
      if (mounted) {
        setState(() {
          _patients = results[0] as List<Patient>;
          _prescriptions = results[1] as List<Prescription>;
          _appointments = results[2] as List<Appointment>;
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final user = appState.user;
    final hour = DateTime.now().hour;
    final greeting =
        hour < 12 ? 'Buenos dias' : (hour < 19 ? 'Buenas tardes' : 'Buenas noches');

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
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
                        style: GoogleFonts.dmSans(
                            fontSize: 13, color: AppColors.textSecondary),
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
                Container(
                  height: 40,
                  decoration: BoxDecoration(
                    gradient: AppColors.primaryGradient,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => const CrearRecetaScreen()),
                      );
                    },
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
            Row(
              children: [
                _DoctorQuickAction(
                  icon: Icons.people_outline,
                  label: 'Mis\npacientes',
                  color: AppColors.primary,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (_) => const PacientesScreen()),
                    );
                  },
                ),
                const SizedBox(width: 10),
                _DoctorQuickAction(
                  icon: Icons.add_circle_outline,
                  label: 'Nueva\nreceta',
                  color: AppColors.success,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (_) => const CrearRecetaScreen()),
                    );
                  },
                ),
                const SizedBox(width: 10),
                _DoctorQuickAction(
                  icon: Icons.receipt_long_outlined,
                  label: 'Recetas\ncreadas',
                  color: AppColors.warning,
                  onTap: () => appState.switchTab(2),
                ),
                const SizedBox(width: 10),
                _DoctorQuickAction(
                  icon: Icons.calendar_today_outlined,
                  label: 'Citas\nhoy',
                  color: const Color(0xFF8B5CF6),
                  onTap: () => appState.switchTab(1),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                    child: _DoctorStat(
                        value: '${_patients.length}',
                        label: 'Pacientes',
                        color: AppColors.primary)),
                const SizedBox(width: 10),
                Expanded(
                    child: _DoctorStat(
                        value: '${_prescriptions.length}',
                        label: 'Recetas',
                        color: AppColors.success)),
                const SizedBox(width: 10),
                Expanded(
                    child: _DoctorStat(
                        value: '${_appointments.length}',
                        label: 'Citas',
                        color: AppColors.warning)),
              ],
            ),
            const SizedBox(height: 20),
            if (_appointments.isNotEmpty) ...[
              Text(
                'Citas recientes',
                style: GoogleFonts.dmSans(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 12),
              ..._appointments.take(3).map((a) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: _ActivityItem(
                      icon: Icons.event,
                      color: AppColors.primary,
                      title: a.typeDisplay,
                      subtitle: a.patientName ?? '',
                      time: a.date ?? '',
                    ),
                  )),
            ],
            if (_patients.isNotEmpty) ...[
              const SizedBox(height: 12),
              Text(
                'Pacientes recientes',
                style: GoogleFonts.dmSans(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 12),
              ..._patients.take(3).map((p) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: _ActivityItem(
                      icon: Icons.person,
                      color: AppColors.success,
                      title: p.fullName,
                      subtitle: p.email,
                      time: '',
                    ),
                  )),
            ],
            if (!_loading && _patients.isEmpty && _appointments.isEmpty) ...[
              const SizedBox(height: 40),
              Center(
                child: Column(
                  children: [
                    Icon(Icons.medical_services_outlined,
                        size: 48, color: AppColors.textTertiary),
                    const SizedBox(height: 12),
                    Text(
                      'Bienvenido Dr. ${user?.fullName.split(' ').first ?? ''}',
                      style: GoogleFonts.dmSans(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Crea una receta o revisa tus pacientes',
                      style: GoogleFonts.dmSans(
                        fontSize: 13,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
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

  const _DoctorStat(
      {required this.value, required this.label, required this.color});

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
            style: GoogleFonts.dmSans(
                fontSize: 22, fontWeight: FontWeight.w700, color: color),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: GoogleFonts.dmSans(
                fontSize: 11, color: AppColors.textSecondary),
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
                  style: GoogleFonts.dmSans(
                      fontSize: 11, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
          if (time.isNotEmpty)
            Text(
              time,
              style: GoogleFonts.dmSans(
                  fontSize: 10, color: AppColors.textTertiary),
            ),
        ],
      ),
    );
  }
}
