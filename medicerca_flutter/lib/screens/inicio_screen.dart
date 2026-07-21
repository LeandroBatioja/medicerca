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
  bool _loading = true;
  String? _error;
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
      ]);
      if (mounted) {
        setState(() {
          _appointments = results[0] as List<Appointment>;
          _prescriptions = results[1] as List<Prescription>;
          _loading = false;
          _error = null;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _loading = false;
          _error = 'No se pudieron cargar los datos';
        });
      }
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
      child: RefreshIndicator(
        onRefresh: _load,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 24,
                    backgroundColor: AppColors.primary,
                    child: Text(
                      user?.initials ?? '?',
                      style: GoogleFonts.dmSans(
                        fontSize: AppFontSize.body,
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
                            fontSize: AppFontSize.body,
                            color: AppColors.textSecondary,
                          ),
                        ),
                        Text(
                          user?.fullName.split(' ').first ?? '',
                          style: GoogleFonts.dmSans(
                            fontSize: AppFontSize.subtitle,
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
                  const SizedBox(width: 12),
                  _QuickAction(
                    icon: Icons.receipt_long_outlined,
                    label: 'Recetas',
                    color: AppColors.success,
                    onTap: () => appState.switchTab(2),
                  ),
                  const SizedBox(width: 12),
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
              _WeeklyCalendar(appointments: _appointments),
              const SizedBox(height: 20),
              if (_loading)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.all(32),
                    child: Column(
                      children: [
                        CircularProgressIndicator(color: AppColors.primary),
                        SizedBox(height: 12),
                        Text('Cargando información...'),
                      ],
                    ),
                  ),
                )
              else if (_error != null)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      children: [
                        const Icon(Icons.error_outline,
                            size: 48, color: AppColors.textTertiary),
                        const SizedBox(height: 12),
                        Text(
                          _error!,
                          textAlign: TextAlign.center,
                          style: GoogleFonts.dmSans(
                            fontSize: AppFontSize.body,
                            color: AppColors.textSecondary,
                          ),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          onPressed: _load,
                          icon: const Icon(Icons.refresh, size: 18),
                          label: const Text('Reintentar'),
                        ),
                      ],
                    ),
                  ),
                )
              else ...[
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
                              child: const Icon(Icons.event, color: Colors.white, size: 20),
                            ),
                            const SizedBox(width: 10),
                            Text(
                              'Proxima cita',
                              style: GoogleFonts.dmSans(
                                fontSize: AppFontSize.body,
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
                            fontSize: AppFontSize.body,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(Icons.access_time, color: Colors.white70, size: 16),
                            const SizedBox(width: 4),
                            Text(
                              nextAppointment.date ?? 'Sin fecha',
                              style: GoogleFonts.dmSans(
                                  fontSize: AppFontSize.body, color: Colors.white70),
                            ),
                            if (nextAppointment.time != null) ...[
                              const SizedBox(width: 8),
                              const Icon(Icons.schedule, color: Colors.white70, size: 16),
                              const SizedBox(width: 4),
                              Text(
                                nextAppointment.time!,
                                style: GoogleFonts.dmSans(
                                    fontSize: AppFontSize.body, color: Colors.white70),
                              ),
                            ],
                          ],
                        ),
                        const SizedBox(height: 12),
                        SizedBox(
                          width: double.infinity,
                          height: 48,
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
                                fontSize: AppFontSize.body,
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
                    const SizedBox(width: 12),
                    Expanded(
                      child: _StatCard(
                        value: '${_prescriptions.length}',
                        label: 'Recetas',
                        color: AppColors.success,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                if (_appointments.isNotEmpty) ...[
                  Text(
                    'Mis citas',
                    style: GoogleFonts.dmSans(
                      fontSize: AppFontSize.body,
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
                      fontSize: AppFontSize.body,
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
                if (_appointments.isEmpty && _prescriptions.isEmpty) ...[
                  const SizedBox(height: 40),
                  Center(
                    child: Column(
                      children: [
                        Icon(Icons.home_outlined, size: 48, color: AppColors.textTertiary),
                        const SizedBox(height: 12),
                        Text(
                          'Bienvenido a MediCerca',
                          style: GoogleFonts.dmSans(
                            fontSize: AppFontSize.body,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Usa los botones de arriba para navegar',
                          style: GoogleFonts.dmSans(
                            fontSize: AppFontSize.body,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ],
          ),
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
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            children: [
              Icon(icon, color: color, size: 24),
              const SizedBox(height: 6),
              Text(
                label,
                style: GoogleFonts.dmSans(
                  fontSize: AppFontSize.small,
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
            style: GoogleFonts.dmSans(
              fontSize: AppFontSize.title,
              fontWeight: FontWeight.w700,
              color: color,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: GoogleFonts.dmSans(
              fontSize: AppFontSize.body,
              color: AppColors.textSecondary,
            ),
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
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: color.withAlpha(20),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.dmSans(
                    fontSize: AppFontSize.body,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                Text(
                  subtitle,
                  style: GoogleFonts.dmSans(
                    fontSize: AppFontSize.body,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          if (time.isNotEmpty)
            Text(
              time,
              style: GoogleFonts.dmSans(
                fontSize: AppFontSize.body,
                color: AppColors.textTertiary,
              ),
            ),
        ],
      ),
    );
  }
}

class _WeeklyCalendar extends StatelessWidget {
  final List<Appointment> appointments;
  const _WeeklyCalendar({required this.appointments});

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final startOfWeek = now.subtract(Duration(days: now.weekday - 1));
    final dayNames = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

    final appointmentDays = <int>{};
    for (final a in appointments) {
      if (a.date != null) {
        for (int i = 0; i < 7; i++) {
          final dayName = a.date!.toLowerCase();
          if ((dayName == 'lunes' && i == 0) ||
              (dayName == 'martes' && i == 1) ||
              (dayName == 'miercoles' && i == 2) ||
              (dayName == 'jueves' && i == 3) ||
              (dayName == 'viernes' && i == 4) ||
              (dayName == 'sabado' && i == 5) ||
              (dayName == 'domingo' && i == 6)) {
            appointmentDays.add(i);
          }
        }
      }
    }

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.calendar_today_outlined,
                  size: 18, color: AppColors.primary),
              const SizedBox(width: 8),
              Text(
                'Semana actual',
                style: GoogleFonts.dmSans(
                  fontSize: AppFontSize.body,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: List.generate(7, (i) {
              final day = startOfWeek.add(Duration(days: i));
              final isToday = day.day == now.day &&
                  day.month == now.month &&
                  day.year == now.year;
              final hasAppointment = appointmentDays.contains(i);
              return Expanded(
                child: Column(
                  children: [
                    Text(
                      dayNames[i],
                      style: GoogleFonts.dmSans(
                        fontSize: 10,
                        fontWeight: FontWeight.w500,
                        color: AppColors.textTertiary,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: isToday
                            ? AppColors.primary
                            : hasAppointment
                                ? AppColors.primaryBg
                                : Colors.transparent,
                        borderRadius: BorderRadius.circular(10),
                        border: hasAppointment && !isToday
                            ? Border.all(color: AppColors.primary, width: 1.5)
                            : null,
                      ),
                      child: Center(
                        child: Text(
                          '${day.day}',
                          style: GoogleFonts.dmSans(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: isToday
                                ? Colors.white
                                : hasAppointment
                                    ? AppColors.primary
                                    : AppColors.textSecondary,
                          ),
                        ),
                      ),
                    ),
                    if (hasAppointment) ...[
                      const SizedBox(height: 4),
                      Container(
                        width: 6,
                        height: 6,
                        decoration: const BoxDecoration(
                          color: AppColors.primary,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ] else
                      const SizedBox(height: 10),
                  ],
                ),
              );
            }),
          ),
        ],
      ),
    );
  }
}
