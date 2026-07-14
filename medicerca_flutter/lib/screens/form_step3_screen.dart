import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../config/constants.dart';
import '../providers/app_state.dart';
import 'confirmacion_screen.dart';

class FormStep3Screen extends StatefulWidget {
  const FormStep3Screen({super.key});

  @override
  State<FormStep3Screen> createState() => _FormStep3ScreenState();
}

class _FormStep3ScreenState extends State<FormStep3Screen> {
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
                    icon: const Icon(Icons.arrow_back_ios, size: 20),
                    onPressed: () => Navigator.pop(context),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    'Confirmar cita',
                    style: GoogleFonts.lora(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
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
                              color: AppColors.primary, size: 20),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          'Resumen de tu cita',
                          style: GoogleFonts.dmSans(
                            fontSize: 16,
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
                          : booking.type == 'followup'
                              ? 'Seguimiento'
                              : 'Urgencia',
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
                  ],
                ),
              ),
              if (_error != null)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(10),
                  margin: const EdgeInsets.only(top: 12),
                  decoration: BoxDecoration(
                    color: Colors.red.shade50,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.red.shade200),
                  ),
                  child: Text(_error!,
                      style: GoogleFonts.dmSans(
                          fontSize: 13, color: Colors.red.shade700)),
                ),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _submitting ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  child: _submitting
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white))
                      : Text(
                          'Confirmar cita',
                          style: GoogleFonts.dmSans(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
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
          _error = 'Error al agendar: $e';
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
                fontSize: 13, color: AppColors.textSecondary)),
        Flexible(
          child: Text(
            value,
            style: GoogleFonts.dmSans(
              fontSize: 14,
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
      width: 12,
      height: 12,
      decoration: BoxDecoration(
        color: active ? AppColors.primary : AppColors.border,
        shape: BoxShape.circle,
      ),
    );
  }
}
