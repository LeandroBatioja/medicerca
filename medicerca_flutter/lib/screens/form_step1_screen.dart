import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
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
      type: 'followup',
      icon: Icons.autorenew,
      title: 'Seguimiento',
      description: 'Seguimiento de tratamiento',
    ),
    _TypeOption(
      type: 'emergency',
      icon: Icons.emergency_outlined,
      title: 'Urgencia',
      description: 'Atencion urgente',
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
                    icon: const Icon(Icons.arrow_back_ios, size: 20),
                    onPressed: () => Navigator.pop(context),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    'Nueva cita',
                    style: GoogleFonts.lora(
                      fontSize: 24,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
              Text(
                'Selecciona el tipo de consulta',
                style: GoogleFonts.dmSans(
                    fontSize: 14, color: AppColors.textSecondary),
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
                ],
              ),
              const SizedBox(height: 20),
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
                                  width: 44,
                                  height: 44,
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
                                    size: 22,
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
                                          fontSize: 15,
                                          fontWeight: FontWeight.w600,
                                          color: isSelected
                                              ? AppColors.primary
                                              : AppColors.textPrimary,
                                        ),
                                      ),
                                      Text(
                                        t.description,
                                        style: GoogleFonts.dmSans(
                                          fontSize: 12,
                                          color: AppColors.textSecondary,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                if (isSelected)
                                  const Icon(Icons.check_circle,
                                      color: AppColors.primary, size: 22),
                              ],
                            ),
                          ),
                        ),
                      );
                    }),
                    const SizedBox(height: 8),
                    Text(
                      'Doctor',
                      style: GoogleFonts.dmSans(
                        fontSize: 13,
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
                              color: AppColors.textSecondary),
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
                                  color: AppColors.textTertiary),
                            ),
                            isExpanded: true,
                            items: _doctors.map((d) {
                              return DropdownMenuItem(
                                value: d,
                                child: Text(
                                  d.fullName,
                                  style: GoogleFonts.dmSans(fontSize: 14),
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
                height: 48,
                child: ElevatedButton(
                  onPressed: selectedType.isEmpty
                      ? null
                      : () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (_) => const FormStep2Screen()),
                          );
                        },
                  child: const Text('Siguiente'),
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
}

class _ProgressDot extends StatelessWidget {
  final bool active;
  const _ProgressDot({required this.active});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 12,
      height: 12,
      decoration: BoxDecoration(
        color: active ? AppColors.primary : AppColors.border,
        shape: BoxShape.circle,
      ),
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
