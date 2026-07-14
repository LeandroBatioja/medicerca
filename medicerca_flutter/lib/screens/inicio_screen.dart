import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../config/constants.dart';
import '../config/models.dart';
import '../providers/app_state.dart';
import 'soporte_screen.dart';

class InicioScreen extends StatefulWidget {
  const InicioScreen({super.key});

  @override
  State<InicioScreen> createState() => _InicioScreenState();
}

class _InicioScreenState extends State<InicioScreen> {
  List<Appointment> _appointments = [];
  List<Prescription> _prescriptions = [];
  List<HomeService> _services = [];
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
        appState.api.getAppointments(),
        appState.api.getPrescriptions(),
        appState.api.getHomeServices(),
      ]);
      if (mounted) {
        setState(() {
          _appointments = results[0] as List<Appointment>;
          _prescriptions = results[1] as List<Prescription>;
          _services = results[2] as List<HomeService>;
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

    final nextAppointment =
        _appointments.isNotEmpty ? _appointments.first : null;

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
                          fontSize: 13,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      Text(
                        user?.fullName.split(' ').first ?? '',
                        style: GoogleFonts.dmSans(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                _QuickAction(
                  icon: Icons.calendar_today_outlined,
                  label: 'Citas',
                  color: AppColors.primary,
                  onTap: () => appState.switchTab(1),
                ),
                const SizedBox(width: 10),
                _QuickAction(
                  icon: Icons.receipt_long_outlined,
                  label: 'Recetas',
                  color: AppColors.success,
                  onTap: () => appState.switchTab(2),
                ),
                const SizedBox(width: 10),
                _QuickAction(
                  icon: Icons.medical_services_outlined,
                  label: 'Servicios',
                  color: AppColors.warning,
                  onTap: () => appState.switchTab(3),
                ),
                const SizedBox(width: 10),
                _QuickAction(
                  icon: Icons.headset_mic_outlined,
                  label: 'Ayuda',
                  color: const Color(0xFF8B5CF6),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const SoporteScreen()),
                    );
                  },
                ),
              ],
            ),
            const SizedBox(height: 20),
            if (nextAppointment != null)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: AppColors.primaryGradient,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.white.withAlpha(30),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(Icons.event, color: Colors.white, size: 18),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          'Proxima cita',
                          style: GoogleFonts.dmSans(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      nextAppointment.typeDisplay,
                      style: GoogleFonts.dmSans(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.access_time, color: Colors.white70, size: 14),
                        const SizedBox(width: 4),
                        Text(
                          nextAppointment.date ?? 'Sin fecha',
                          style: GoogleFonts.dmSans(fontSize: 12, color: Colors.white70),
                        ),
                        if (nextAppointment.time != null) ...[
                          const SizedBox(width: 8),
                          const Icon(Icons.schedule, color: Colors.white70, size: 14),
                          const SizedBox(width: 4),
                          Text(
                            nextAppointment.time!,
                            style: GoogleFonts.dmSans(fontSize: 12, color: Colors.white70),
                          ),
                        ],
                      ],
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      height: 36,
                      child: ElevatedButton(
                        onPressed: () => appState.switchTab(1),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: AppColors.primary,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8)),
                        ),
                        child: Text(
                          'Ver detalles',
                          style: GoogleFonts.dmSans(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: _StatCard(
                    value: '${_appointments.length}',
                    label: 'Citas',
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _StatCard(
                    value: '${_prescriptions.length}',
                    label: 'Recetas',
                    color: AppColors.success,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _StatCard(
                    value: '${_services.length}',
                    label: 'Servicios',
                    color: AppColors.warning,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            if (_appointments.isNotEmpty) ...[
              Text(
                'Mis citas',
                style: GoogleFonts.dmSans(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 12),
              ..._appointments.take(3).map((a) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: _ActivityTile(
                      icon: Icons.event,
                      color: AppColors.primary,
                      title: a.typeDisplay,
                      subtitle: a.doctor ?? 'Sin doctor asignado',
                      time: a.date ?? '',
                    ),
                  )),
              const SizedBox(height: 12),
            ],
            if (_prescriptions.isNotEmpty) ...[
              Text(
                'Mis recetas',
                style: GoogleFonts.dmSans(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 12),
              ..._prescriptions.take(3).map((p) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: _ActivityTile(
                      icon: Icons.receipt,
                      color: AppColors.success,
                      title: p.medication,
                      subtitle: p.frequency ?? '',
                      time: p.date,
                    ),
                  )),
            ],
            if (!_loading && _appointments.isEmpty && _prescriptions.isEmpty) ...[
              const SizedBox(height: 40),
              Center(
                child: Column(
                  children: [
                    Icon(Icons.home_outlined, size: 48, color: AppColors.textTertiary),
                    const SizedBox(height: 12),
                    Text(
                      'Bienvenido a MediCerca',
                      style: GoogleFonts.dmSans(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Usa los botones de arriba para navegar',
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

class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _QuickAction({
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
                style: GoogleFonts.dmSans(
                  fontSize: 10,
                  fontWeight: FontWeight.w500,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String value;
  final String label;
  final Color color;

  const _StatCard({required this.value, required this.label, required this.color});

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

class _ActivityTile extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title;
  final String subtitle;
  final String time;

  const _ActivityTile({
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
          if (time.isNotEmpty)
            Text(
              time,
              style: GoogleFonts.dmSans(fontSize: 10, color: AppColors.textTertiary),
            ),
        ],
      ),
    );
  }
}
