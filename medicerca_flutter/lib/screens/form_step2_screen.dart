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
  int? _selectedSlotId;

  static const _slots = [
    Slot(id: 1, day: 'Lunes', time: '09:00 AM'),
    Slot(id: 2, day: 'Lunes', time: '11:00 AM'),
    Slot(id: 3, day: 'Martes', time: '10:00 AM'),
    Slot(id: 4, day: 'Martes', time: '02:00 PM'),
    Slot(id: 5, day: 'Miercoles', time: '09:00 AM'),
    Slot(id: 6, day: 'Miercoles', time: '03:00 PM'),
    Slot(id: 7, day: 'Jueves', time: '10:00 AM'),
    Slot(id: 8, day: 'Viernes', time: '09:00 AM'),
    Slot(id: 9, day: 'Viernes', time: '11:00 AM'),
  ];

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();

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
                    'Seleccionar horario',
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
                  appState.booking.type == 'general'
                      ? 'Consulta General'
                      : appState.booking.type == 'followup'
                          ? 'Seguimiento'
                          : 'Urgencia',
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
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Expanded(
                child: ListView.separated(
                  itemCount: _slots.length,
                  separatorBuilder: (_, index) => const SizedBox(height: 8),
                  itemBuilder: (context, i) {
                    final slot = _slots[i];
                    final isSelected = _selectedSlotId == slot.id;
                    return GestureDetector(
                      onTap: () => setState(() => _selectedSlotId = slot.id),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: isSelected ? AppColors.primaryBg : Colors.white,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: isSelected ? AppColors.primary : AppColors.border,
                            width: isSelected ? 2 : 1,
                          ),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              Icons.access_time,
                              color: isSelected
                                  ? AppColors.primary
                                  : AppColors.textTertiary,
                              size: 20,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    '${slot.day}, ${slot.time}',
                                    style: GoogleFonts.dmSans(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: isSelected
                                          ? AppColors.primary
                                          : AppColors.textPrimary,
                                    ),
                                  ),
                                  Text(
                                    'Disponible',
                                    style: GoogleFonts.dmSans(
                                      fontSize: 11,
                                      color: AppColors.success,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            if (isSelected)
                              const Icon(Icons.check_circle,
                                  color: AppColors.primary, size: 20),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: _selectedSlotId == null
                      ? null
                      : () {
                          final slot =
                              _slots.firstWhere((s) => s.id == _selectedSlotId);
                          appState.updateBooking(
                              appState.booking.copyWith(slot: slot));
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
