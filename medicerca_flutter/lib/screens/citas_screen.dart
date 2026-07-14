import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../config/constants.dart';
import '../config/models.dart';
import '../providers/app_state.dart';
import 'form_step1_screen.dart';

class CitasScreen extends StatefulWidget {
  const CitasScreen({super.key});

  @override
  State<CitasScreen> createState() => _CitasScreenState();
}

class _CitasScreenState extends State<CitasScreen> {
  List<Appointment> _appointments = [];
  bool _loading = true;
  String? _error;
  bool _isDoctor = false;
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
    if (appState.currentTab == 1 && appState.currentTab != _lastLoadedTab) {
      _lastLoadedTab = appState.currentTab;
      _load();
    }
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final appState = context.read<AppState>();
      _isDoctor = appState.role == UserRole.doctor;
      final list = _isDoctor
          ? await appState.api.getDoctorAppointments()
          : await appState.api.getAppointments();
      if (mounted) {
        setState(() {
          _appointments = list;
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString();
          _loading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isDoctor ? 'Citas asignadas' : 'Mis citas'),
        actions: [
          if (!_isDoctor)
            IconButton(
              icon: const Icon(Icons.add_circle_outline),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const FormStep1Screen()),
                );
              },
            ),
        ],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_loading) {
      return const Center(
          child: CircularProgressIndicator(color: AppColors.primary));
    }
    if (_error != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline,
                  size: 48, color: AppColors.textTertiary),
              const SizedBox(height: 12),
              Text(_error!,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.dmSans(color: AppColors.textSecondary)),
              const SizedBox(height: 16),
              ElevatedButton(
                  onPressed: _load, child: const Text('Reintentar')),
            ],
          ),
        ),
      );
    }
    if (_appointments.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.event_outlined,
                size: 48, color: AppColors.textTertiary),
            const SizedBox(height: 12),
            Text(
              'No hay citas',
              style: GoogleFonts.dmSans(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              _isDoctor
                  ? 'Las citas que te asignen apareceran aqui'
                  : 'Agenda tu primera cita',
              style: GoogleFonts.dmSans(
                  fontSize: 13, color: AppColors.textSecondary),
            ),
            if (!_isDoctor) ...[
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (_) => const FormStep1Screen()),
                  );
                },
                icon: const Icon(Icons.add, size: 18),
                label: const Text('Nueva cita'),
              ),
            ],
          ],
        ),
      );
    }
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _appointments.length,
        itemBuilder: (context, i) => GestureDetector(
          onTap: () => _showDetail(_appointments[i]),
          child: _AppointmentCard(appointment: _appointments[i]),
        ),
      ),
    );
  }

  void _showDetail(Appointment appointment) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              appointment.typeDisplay,
              style: GoogleFonts.dmSans(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 16),
            _DetailRow(
                icon: Icons.person_outline,
                label: 'Doctor',
                value: appointment.doctor ?? 'No asignado'),
            const SizedBox(height: 12),
            _DetailRow(
                icon: Icons.location_on_outlined,
                label: 'Clinica',
                value: appointment.clinic ?? 'No especificada'),
            const SizedBox(height: 12),
            _DetailRow(
                icon: Icons.access_time,
                label: 'Dia',
                value: appointment.date ?? 'Sin fecha'),
            const SizedBox(height: 12),
            _DetailRow(
                icon: Icons.schedule,
                label: 'Hora',
                value: appointment.time ?? 'Sin hora'),
            const SizedBox(height: 12),
            _DetailRow(
              icon: appointment.confirmed
                  ? Icons.check_circle_outline
                  : Icons.hourglass_empty_outlined,
              label: 'Estado',
              value: appointment.confirmed ? 'Confirmada' : 'Pendiente',
              valueColor: appointment.confirmed
                  ? AppColors.success
                  : AppColors.warning,
            ),
            if (_isDoctor && appointment.patientName != null) ...[
              const SizedBox(height: 12),
              _DetailRow(
                  icon: Icons.person,
                  label: 'Paciente',
                  value: appointment.patientName!),
            ],
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: SizedBox(
                    height: 44,
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(ctx),
                      child: const Text('Cerrar'),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                SizedBox(
                  height: 44,
                  child: OutlinedButton(
                    onPressed: () async {
                      final confirm = await showDialog<bool>(
                        context: context,
                        builder: (d) => AlertDialog(
                          title: const Text('Eliminar cita'),
                          content: const Text('Seguro que quieres eliminar esta cita?'),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(d, false),
                              child: const Text('Cancelar'),
                            ),
                            TextButton(
                              onPressed: () => Navigator.pop(d, true),
                              child: const Text('Eliminar',
                                  style: TextStyle(color: Colors.red)),
                            ),
                          ],
                        ),
                      );
                      if (confirm == true && context.mounted) {
                        Navigator.pop(ctx);
                        await _deleteAppointment(appointment);
                      }
                    },
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Colors.red),
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                    ),
                    child: const Icon(Icons.delete_outline,
                        color: Colors.red, size: 20),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _deleteAppointment(Appointment appointment) async {
    try {
      final appState = context.read<AppState>();
      await appState.api.deleteAppointment(appointment.id);
      if (mounted) {
        setState(() {
          _appointments.removeWhere((a) => a.id == appointment.id);
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Cita eliminada'),
            backgroundColor: AppColors.success,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }
}

class _AppointmentCard extends StatelessWidget {
  final Appointment appointment;
  const _AppointmentCard({required this.appointment});

  Color get _typeColor {
    switch (appointment.type) {
      case 'general':
        return AppColors.primary;
      case 'followup':
        return AppColors.success;
      case 'emergency':
        return AppColors.warning;
      default:
        return AppColors.primary;
    }
  }

  IconData get _typeIcon {
    switch (appointment.type) {
      case 'general':
        return Icons.medical_services_outlined;
      case 'followup':
        return Icons.autorenew;
      case 'emergency':
        return Icons.emergency_outlined;
      default:
        return Icons.event;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: _typeColor.withAlpha(20),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(_typeIcon, color: _typeColor, size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  appointment.typeDisplay,
                  style: GoogleFonts.dmSans(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                if (appointment.doctor != null)
                  Text(
                    appointment.doctor!,
                    style: GoogleFonts.dmSans(
                        fontSize: 12, color: AppColors.textSecondary),
                  ),
                if (appointment.clinic != null)
                  Text(
                    appointment.clinic!,
                    style: GoogleFonts.dmSans(
                        fontSize: 11, color: AppColors.textTertiary),
                  ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              if (appointment.date != null)
                Text(
                  appointment.date!,
                  style: GoogleFonts.dmSans(
                      fontSize: 11, color: AppColors.textTertiary),
                ),
              if (appointment.time != null)
                Text(
                  appointment.time!,
                  style: GoogleFonts.dmSans(
                      fontSize: 11, color: AppColors.textTertiary),
                ),
              const SizedBox(height: 4),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: appointment.confirmed
                      ? AppColors.successBg
                      : AppColors.warningBg,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  appointment.confirmed ? 'Confirmada' : 'Pendiente',
                  style: GoogleFonts.dmSans(
                    fontSize: 10,
                    fontWeight: FontWeight.w500,
                    color: appointment.confirmed
                        ? AppColors.success
                        : AppColors.warning,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color? valueColor;

  const _DetailRow({
    required this.icon,
    required this.label,
    required this.value,
    this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 18, color: AppColors.textTertiary),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label,
                  style: GoogleFonts.dmSans(
                      fontSize: 11, color: AppColors.textTertiary)),
              Text(value,
                  style: GoogleFonts.dmSans(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: valueColor ?? AppColors.textPrimary,
                  )),
            ],
          ),
        ),
      ],
    );
  }
}
