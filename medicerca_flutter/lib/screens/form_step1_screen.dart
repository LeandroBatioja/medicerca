import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/constants.dart';
import '../config/models.dart';
import '../providers/app_state.dart';
import 'form_step2_screen.dart';

class FormStep1Screen extends StatefulWidget {
  const FormStep1Screen({super.key});

  @override
  State<FormStep1Screen> createState() => _FormStep1ScreenState();
}

class _FormStep1ScreenState extends State<FormStep1Screen> {
  List<Patient> _doctors = [];
  bool _loadingDoctors = true;

  static const _types = [
    _TypeOption(
      type: 'general',
      icon: Icons.medical_services_outlined,
      title: 'Consulta General',
      description: 'Revision medica general',
    ),
    _TypeOption(
      type: 'specialty',
      icon: Icons.psychology_outlined,
      title: 'Consulta por Especialidad',
      description: 'Evaluacion de especialista',
    ),
    _TypeOption(
      type: 'checkup',
      icon: Icons.health_and_safety_outlined,
      title: 'Chequeo Preventivo',
      description: 'Revision de salud preventiva',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _loadDoctors();
  }

  Future<void> _loadDoctors() async {
    try {
      final appState = context.read<AppState>();
      final list = await appState.api.getDoctors();
      if (mounted) {
        setState(() {
          _doctors = list;
          _loadingDoctors = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _loadingDoctors = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final selectedType = appState.booking.type;

    return Scaffold(
      backgroundColor: AppColors.bg,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back_ios, size: 24),
                    onPressed: () => Navigator.pop(context),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    'Nueva cita',
                    style: GoogleFonts.lora(
                      fontSize: AppFontSize.heading,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
              Text(
                'Selecciona el tipo de consulta',
                style: GoogleFonts.dmSans(
                  fontSize: AppFontSize.body,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  _ProgressDot(active: true),
                  const SizedBox(width: 6),
                  Expanded(
                      child: Container(height: 3, color: AppColors.border)),
                  const SizedBox(width: 6),
                  _ProgressDot(active: false),
                  const SizedBox(width: 6),
                  Expanded(
                      child: Container(height: 3, color: AppColors.border)),
                  const SizedBox(width: 6),
                  _ProgressDot(active: false),
                  const SizedBox(width: 6),
                  Expanded(
                      child: Container(height: 3, color: AppColors.border)),
                  const SizedBox(width: 6),
                  _ProgressDot(active: false),
                ],
              ),
              const SizedBox(height: 4),
              Text(
                'Paso 1 de 4',
                style: GoogleFonts.dmSans(
                  fontSize: AppFontSize.body,
                  color: AppColors.textTertiary,
                ),
              ),
              const SizedBox(height: 16),
              Expanded(
                child: ListView(
                  children: [
                    ...List.generate(_types.length, (i) {
                      final t = _types[i];
                      final isSelected = selectedType == t.type;
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: GestureDetector(
                          onTap: () {
                            appState.updateBooking(
                              appState.booking.copyWith(
                                  type: t.type, clearSlot: true),
                            );
                          },
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? AppColors.primaryBg
                                  : Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: isSelected
                                    ? AppColors.primary
                                    : AppColors.border,
                                width: isSelected ? 2 : 1,
                              ),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 48,
                                  height: 48,
                                  decoration: BoxDecoration(
                                    color: isSelected
                                        ? AppColors.primary.withAlpha(20)
                                        : AppColors.bg,
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Icon(
                                    t.icon,
                                    color: isSelected
                                        ? AppColors.primary
                                        : AppColors.textSecondary,
                                    size: 24,
                                  ),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        t.title,
                                        style: GoogleFonts.dmSans(
                                          fontSize: AppFontSize.body,
                                          fontWeight: FontWeight.w600,
                                          color: isSelected
                                              ? AppColors.primary
                                              : AppColors.textPrimary,
                                        ),
                                      ),
                                      Text(
                                        t.description,
                                        style: GoogleFonts.dmSans(
                                          fontSize: AppFontSize.body,
                                          color: AppColors.textSecondary,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                if (isSelected)
                                  const Icon(Icons.check_circle,
                                      color: AppColors.primary, size: 24),
                              ],
                            ),
                          ),
                        ),
                      );
                    }),
                    const SizedBox(height: 16),
                    GestureDetector(
                      onTap: () => _showEmergencyDialog(context),
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.red.shade50,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.red.shade200),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                color: Colors.red.withAlpha(20),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Icon(Icons.phone_outlined,
                                  color: Colors.red.shade600, size: 24),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Urgencia',
                                    style: GoogleFonts.dmSans(
                                      fontSize: AppFontSize.body,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.red.shade700,
                                    ),
                                  ),
                                  Text(
                                    'Llamar linea de emergencias',
                                    style: GoogleFonts.dmSans(
                                      fontSize: AppFontSize.body,
                                      color: Colors.red.shade400,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Icon(Icons.chevron_right,
                                color: Colors.red.shade400, size: 24),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Doctor',
                      style: GoogleFonts.dmSans(
                        fontSize: AppFontSize.body,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    if (_loadingDoctors)
                      const Center(
                          child: Padding(
                        padding: EdgeInsets.all(16),
                        child: CircularProgressIndicator(
                            color: AppColors.primary),
                      ))
                    else if (_doctors.isEmpty)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppColors.inputBg,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Text(
                          'No hay doctores disponibles',
                          style: GoogleFonts.dmSans(
                            fontSize: AppFontSize.body,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      )
                    else
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        decoration: BoxDecoration(
                          color: AppColors.inputBg,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColors.inputBorder),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<Patient>(
                            value: _selectedDoctor(_doctors, appState),
                            hint: Text(
                              'Seleccionar doctor',
                              style: GoogleFonts.dmSans(
                                fontSize: AppFontSize.body,
                                color: AppColors.textTertiary,
                              ),
                            ),
                            isExpanded: true,
                            items: _doctors.map((d) {
                              return DropdownMenuItem(
                                value: d,
                                child: Text(
                                  d.fullName,
                                  style: GoogleFonts.dmSans(
                                      fontSize: AppFontSize.body),
                                ),
                              );
                            }).toList(),
                            onChanged: (d) {
                              if (d != null) {
                                appState.updateBooking(
                                  appState.booking.copyWith(
                                    doctor: d.fullName,
                                    doctorId: d.id,
                                    clinic: 'Centro Medico MediCerca',
                                  ),
                                );
                              }
                            },
                          ),
                        ),
                      ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  onPressed: selectedType.isEmpty
                      ? null
                      : () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (_) => const FormStep2Screen()),
                          );
                        },
                  icon: const Icon(Icons.arrow_forward, size: 20),
                  label: const Text('Siguiente'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Patient? _selectedDoctor(List<Patient> doctors, AppState appState) {
    final name = appState.booking.doctor;
    if (name == null) return null;
    try {
      return doctors.firstWhere((d) => d.fullName == name);
    } catch (_) {
      return null;
    }
  }

  void _showEmergencyDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Icon(Icons.emergency_outlined, color: Colors.red.shade600, size: 24),
            const SizedBox(width: 10),
            Text(
              'Urgencia',
              style: GoogleFonts.dmSans(
                fontSize: 18,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
        content: Text(
          'Si es una emergencia medica, llama directamente a la linea de emergencias.',
          style: GoogleFonts.dmSans(fontSize: 14, color: AppColors.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(
              'Cancelar',
              style: GoogleFonts.dmSans(fontSize: 14),
            ),
          ),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.pop(ctx);
              launchEmergencyCall();
            },
            icon: const Icon(Icons.phone, size: 18),
            label: const Text('Llamar ahora'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red.shade600,
              foregroundColor: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  static void launchEmergencyCall() {
    const number = 'tel:911';
    launchUrl(Uri.parse(number));
  }
}

class _ProgressDot extends StatelessWidget {
  final bool active;
  const _ProgressDot({required this.active});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 16,
      height: 16,
      decoration: BoxDecoration(
        color: active ? AppColors.primary : AppColors.border,
        shape: BoxShape.circle,
      ),
      child: active
          ? const Icon(Icons.check, color: Colors.white, size: 10)
          : null,
    );
  }
}

class _TypeOption {
  final String type;
  final IconData icon;
  final String title;
  final String description;
  const _TypeOption({
    required this.type,
    required this.icon,
    required this.title,
    required this.description,
  });
}
