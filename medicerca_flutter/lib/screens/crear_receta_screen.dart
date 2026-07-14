import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../config/constants.dart';
import '../config/models.dart';
import '../providers/app_state.dart';

class CrearRecetaScreen extends StatefulWidget {
  const CrearRecetaScreen({super.key});

  @override
  State<CrearRecetaScreen> createState() => _CrearRecetaScreenState();
}

class _CrearRecetaScreenState extends State<CrearRecetaScreen> {
  final _formKey = GlobalKey<FormState>();
  final _medCtrl = TextEditingController();
  final _freqCtrl = TextEditingController();
  final _refillsCtrl = TextEditingController();
  List<Patient> _patients = [];
  Patient? _selectedPatient;
  bool _loadingPatients = true;
  bool _submitting = false;
  String? _error;
  bool _success = false;

  @override
  void initState() {
    super.initState();
    _loadPatients();
  }

  @override
  void dispose() {
    _medCtrl.dispose();
    _freqCtrl.dispose();
    _refillsCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadPatients() async {
    try {
      final appState = context.read<AppState>();
      final list = await appState.api.getPatients();
      if (mounted) {
        setState(() {
          _patients = list;
          _loadingPatients = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString();
          _loadingPatients = false;
        });
      }
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedPatient == null) {
      setState(() => _error = 'Selecciona un paciente');
      return;
    }
    setState(() {
      _submitting = true;
      _error = null;
    });
    try {
      final appState = context.read<AppState>();
      await appState.api.createPrescription(
        patientId: _selectedPatient!.id,
        medication: _medCtrl.text.trim(),
        frequency: _freqCtrl.text.trim().isNotEmpty ? _freqCtrl.text.trim() : null,
        refills: _refillsCtrl.text.trim().isNotEmpty ? _refillsCtrl.text.trim() : null,
      );
      if (mounted) {
        setState(() => _success = true);
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString();
          _submitting = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_success) {
      return Scaffold(
        body: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: const BoxDecoration(
                      color: AppColors.successBg,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.check, color: AppColors.success, size: 40),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'Receta creada',
                    style: GoogleFonts.lora(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'La receta ha sido registrada exitosamente.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.dmSans(fontSize: 14, color: AppColors.textSecondary),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Volver'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Nueva receta')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Patient selector
              Text(
                'Paciente',
                style: GoogleFonts.dmSans(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              if (_loadingPatients)
                const Center(child: CircularProgressIndicator(color: AppColors.primary))
              else if (_patients.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.inputBg,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Text(
                    'No hay pacientes disponibles',
                    style: GoogleFonts.dmSans(color: AppColors.textSecondary),
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
                      value: _selectedPatient,
                      hint: Text(
                        'Seleccionar paciente',
                        style: GoogleFonts.dmSans(color: AppColors.textTertiary),
                      ),
                      isExpanded: true,
                      items: _patients.map((p) {
                        return DropdownMenuItem(
                          value: p,
                          child: Text(
                            p.fullName,
                            style: GoogleFonts.dmSans(fontSize: 14),
                          ),
                        );
                      }).toList(),
                      onChanged: (v) => setState(() => _selectedPatient = v),
                    ),
                  ),
                ),
              const SizedBox(height: 20),

              // Medication
              TextFormField(
                controller: _medCtrl,
                decoration: const InputDecoration(labelText: 'Medicamento'),
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return 'Medicamento requerido';
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Frequency
              TextFormField(
                controller: _freqCtrl,
                decoration: const InputDecoration(
                  labelText: 'Frecuencia (ej: Cada 8 horas)',
                ),
              ),
              const SizedBox(height: 16),

              // Refills
              TextFormField(
                controller: _refillsCtrl,
                decoration: const InputDecoration(
                  labelText: 'Repeticiones (opcional)',
                ),
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 8),

              // Error
              if (_error != null)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(10),
                  margin: const EdgeInsets.only(bottom: 8),
                  decoration: BoxDecoration(
                    color: Colors.red.shade50,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.red.shade200),
                  ),
                  child: Text(_error!, style: GoogleFonts.dmSans(fontSize: 13, color: Colors.red.shade700)),
                ),

              const SizedBox(height: 12),

              // Submit
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: _submitting ? null : _submit,
                  child: _submitting
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Text('Crear receta'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
