import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../config/constants.dart';
import '../config/models.dart';
import '../providers/app_state.dart';
import 'form_step3_screen.dart';

class FormStep2Screen extends StatefulWidget {
  const FormStep2Screen({super.key});

  @override
  State<FormStep2Screen> createState() => _FormStep2ScreenState();
}

class _FormStep2ScreenState extends State<FormStep2Screen> {
  String? _selectedType;

  final _serviceTypes = [
    _ServiceOption(
      value: 'lab',
      label: 'Laboratorio clinico',
      icon: Icons.science_outlined,
      description: 'Analisis y toma de muestras',
    ),
    _ServiceOption(
      value: 'imaging',
      label: 'Estudios de imagen',
      icon: Icons.camera_alt_outlined,
      description: 'Rayos X, ultrasonido, resonancia',
    ),
    _ServiceOption(
      value: 'nursing',
      label: 'Atencion de enfermeria',
      icon: Icons.healing_outlined,
      description: 'Curaciones, inyecciones, cuidados',
    ),
    _ServiceOption(
      value: 'procedure',
      label: 'Procedimiento medico',
      icon: Icons.medical_information_outlined,
      description: 'Procedimientos ambulatorios',
    ),
    _ServiceOption(
      value: 'vaccination',
      label: 'Vacunacion',
      icon: Icons.vaccines_outlined,
      description: 'Aplicacion de vacunas',
    ),
    _ServiceOption(
      value: 'physiotherapy',
      label: 'Fisioterapia',
      icon: Icons.sports_gymnastics_outlined,
      description: 'Rehabilitacion y terapia fisica',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final selectedType = _selectedType ?? appState.booking.serviceType;

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
                    'Servicio',
                    style: GoogleFonts.lora(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Padding(
                padding: const EdgeInsets.only(left: 48),
                child: Text(
                  'Que servicio necesita el paciente',
                  style:
                      GoogleFonts.dmSans(fontSize: 13, color: AppColors.textSecondary),
                ),
              ),
              const SizedBox(height: 8),
              Padding(
                padding: const EdgeInsets.only(left: 48),
                child: Row(
                  children: [
                    _ProgressDot(active: true),
                    const SizedBox(width: 6),
                    Expanded(child: Container(height: 3, color: AppColors.primary)),
                    const SizedBox(width: 6),
                    _ProgressDot(active: true),
                    const SizedBox(width: 6),
                    Expanded(child: Container(height: 3, color: AppColors.border)),
                    const SizedBox(width: 6),
                    _ProgressDot(active: false),
                    const SizedBox(width: 6),
                    Expanded(child: Container(height: 3, color: AppColors.border)),
                    const SizedBox(width: 6),
                    _ProgressDot(active: false),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Expanded(
                child: ListView(
                  children: [
                    ...List.generate(_serviceTypes.length, (i) {
                      final s = _serviceTypes[i];
                      final isSelected = selectedType == s.value;
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: GestureDetector(
                          onTap: () => setState(() => _selectedType = s.value),
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
                                    s.icon,
                                    color: isSelected
                                        ? AppColors.primary
                                        : AppColors.textSecondary,
                                    size: 24,
                                  ),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        s.label,
                                        style: GoogleFonts.dmSans(
                                          fontSize: AppFontSize.body,
                                          fontWeight: FontWeight.w600,
                                          color: isSelected
                                              ? AppColors.primary
                                              : AppColors.textPrimary,
                                        ),
                                      ),
                                      Text(
                                        s.description,
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
                    const SizedBox(height: 10),
                    GestureDetector(
                      onTap: () => setState(() => _selectedType = null),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: selectedType == null
                              ? AppColors.primaryBg
                              : Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: selectedType == null
                                ? AppColors.primary
                                : AppColors.border,
                            width: selectedType == null ? 2 : 1,
                          ),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                color: selectedType == null
                                    ? AppColors.primary.withAlpha(20)
                                    : AppColors.bg,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Icon(
                                Icons.not_interested_outlined,
                                color: selectedType == null
                                    ? AppColors.primary
                                    : AppColors.textSecondary,
                                size: 24,
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Ninguno',
                                    style: GoogleFonts.dmSans(
                                      fontSize: AppFontSize.body,
                                      fontWeight: FontWeight.w600,
                                      color: selectedType == null
                                          ? AppColors.primary
                                          : AppColors.textPrimary,
                                    ),
                                  ),
                                  Text(
                                    'Solo consulta',
                                    style: GoogleFonts.dmSans(
                                      fontSize: AppFontSize.body,
                                      color: AppColors.textSecondary,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            if (selectedType == null)
                              const Icon(Icons.check_circle,
                                  color: AppColors.primary, size: 24),
                          ],
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
                  onPressed: () {
                    String? serviceName;
                    if (_selectedType != null) {
                      final match = _serviceTypes.where((s) => s.value == _selectedType);
                      serviceName = match.isNotEmpty ? match.first.label : _selectedType;
                    }
                    appState.updateBooking(
                      appState.booking.copyWith(
                        serviceType: _selectedType,
                        serviceName: serviceName,
                        clearService: _selectedType == null,
                      ),
                    );
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (_) => const FormStep3Screen()),
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

class _ServiceOption {
  final String value;
  final String label;
  final IconData icon;
  final String description;
  const _ServiceOption({
    required this.value,
    required this.label,
    required this.icon,
    required this.description,
  });
}
