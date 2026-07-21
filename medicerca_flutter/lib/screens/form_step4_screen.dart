import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../config/constants.dart';
import '../providers/app_state.dart';
import 'confirmacion_screen.dart';

class FormStep4Screen extends StatefulWidget {
  const FormStep4Screen({super.key});

  @override
  State<FormStep4Screen> createState() => _FormStep4ScreenState();
}

class _FormStep4ScreenState extends State<FormStep4Screen> {
  bool _submitting = false;
  String? _error;

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final booking = appState.booking;

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
                    'Confirmar cita',
                    style: GoogleFonts.lora(
                      fontSize: AppFontSize.heading,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Padding(
                padding: const EdgeInsets.only(left: 52),
                child: Text(
                  'Paso 4 de 4',
                  style: GoogleFonts.dmSans(
                    fontSize: AppFontSize.body,
                    color: AppColors.textTertiary,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Padding(
                padding: const EdgeInsets.only(left: 48),
                child: Row(
                  children: [
                    _ProgressDot(active: true),
                    const SizedBox(width: 6),
                    Expanded(
                        child: Container(height: 3, color: AppColors.primary)),
                    const SizedBox(width: 6),
                    _ProgressDot(active: true),
                    const SizedBox(width: 6),
                    Expanded(
                        child: Container(height: 3, color: AppColors.primary)),
                    const SizedBox(width: 6),
                    _ProgressDot(active: true),
                    const SizedBox(width: 6),
                    Expanded(
                        child: Container(height: 3, color: AppColors.primary)),
                    const SizedBox(width: 6),
                    _ProgressDot(active: true),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
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
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppColors.primaryBg,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(Icons.event,
                              color: AppColors.primary, size: 22),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          'Resumen de tu cita',
                          style: GoogleFonts.dmSans(
                            fontSize: AppFontSize.body,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 24),
                    _SummaryRow(
                      label: 'Tipo',
                      value: booking.type == 'general'
                          ? 'Consulta General'
                          : booking.type == 'specialty'
                              ? 'Consulta por Especialidad'
                              : 'Chequeo Preventivo',
                    ),
                    const SizedBox(height: 12),
                    _SummaryRow(label: 'Dia', value: booking.slot?.day ?? ''),
                    const SizedBox(height: 12),
                    _SummaryRow(label: 'Hora', value: booking.slot?.time ?? ''),
                    const SizedBox(height: 12),
                    _SummaryRow(
                        label: 'Doctor',
                        value: booking.doctor ?? 'Dr. Garcia'),
                    const SizedBox(height: 12),
                    _SummaryRow(
                        label: 'Clinica',
                        value: booking.clinic ?? 'Centro Medico MediCerca'),
                    if (booking.serviceType != null) ...[
                      const SizedBox(height: 12),
                      _SummaryRow(
                          label: 'Servicio',
                          value: booking.serviceName ?? booking.serviceType!),
                    ],
                  ],
                ),
              ),
              if (_error != null)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  margin: const EdgeInsets.only(top: 12),
                  decoration: BoxDecoration(
                    color: Colors.red.shade50,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.red.shade200),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.error_outline,
                          size: 20, color: Colors.red.shade700),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _error!,
                          style: GoogleFonts.dmSans(
                            fontSize: AppFontSize.body,
                            color: Colors.red.shade700,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  onPressed: _submitting ? null : _submit,
                  icon: _submitting
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.5,
                            color: Colors.white,
                          ),
                        )
                      : const Icon(Icons.check_circle_outline, size: 22),
                  label: _submitting
                      ? const Text('Confirmando cita...')
                      : const Text('Confirmar cita'),
                  style: ElevatedButton.styleFrom(
                    textStyle: GoogleFonts.dmSans(
                      fontSize: AppFontSize.body,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _submit() async {
    final appState = context.read<AppState>();
    final booking = appState.booking;

    setState(() {
      _submitting = true;
      _error = null;
    });

    try {
      await appState.api.createAppointment(
        slotId: booking.slot?.id ?? 1,
        type: booking.type.isNotEmpty ? booking.type : 'general',
        doctor: booking.doctor ?? 'Dr. Garcia',
        clinic: booking.clinic ?? 'Centro Medico MediCerca',
        doctorId: booking.doctorId,
        date: booking.slot?.day,
        time: booking.slot?.time,
        serviceType: booking.serviceType,
      );

      if (!mounted) return;
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const ConfirmacionScreen()),
        (_) => false,
      );
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'No se pudo agendar la cita. Intenta de nuevo.';
          _submitting = false;
        });
      }
    }
  }
}

class _SummaryRow extends StatelessWidget {
  final String label;
  final String value;
  const _SummaryRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label,
            style: GoogleFonts.dmSans(
              fontSize: AppFontSize.body,
              color: AppColors.textSecondary,
            )),
        Flexible(
          child: Text(
            value,
            style: GoogleFonts.dmSans(
              fontSize: AppFontSize.body,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
            textAlign: TextAlign.end,
          ),
        ),
      ],
    );
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
