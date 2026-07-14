import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../config/constants.dart';
import '../providers/app_state.dart';

class SolicitarServicioScreen extends StatefulWidget {
  const SolicitarServicioScreen({super.key});

  @override
  State<SolicitarServicioScreen> createState() =>
      _SolicitarServicioScreenState();
}

class _SolicitarServicioScreenState extends State<SolicitarServicioScreen> {
  final _formKey = GlobalKey<FormState>();
  final _addressCtrl = TextEditingController();
  String _selectedType = 'nursing';
  bool _submitting = false;
  String? _error;
  bool _success = false;

  final _serviceTypes = [
    {'value': 'nursing', 'label': 'Enfermeria', 'icon': Icons.healing_outlined},
    {'value': 'lab', 'label': 'Laboratorio', 'icon': Icons.science_outlined},
    {
      'value': 'physiotherapy',
      'label': 'Fisioterapia',
      'icon': Icons.sports_gymnastics_outlined
    },
    {
      'value': 'medication',
      'label': 'Medicamentos',
      'icon': Icons.medication_outlined
    },
  ];

  @override
  void dispose() {
    _addressCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _submitting = true;
      _error = null;
    });
    try {
      final appState = context.read<AppState>();
      await appState.api.createHomeService(
        serviceType: _selectedType,
        address: _addressCtrl.text.trim(),
      );
      if (mounted) setState(() => _success = true);
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
                    child: const Icon(Icons.check,
                        color: AppColors.success, size: 40),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'Servicio solicitado',
                    style: GoogleFonts.lora(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Tu solicitud ha sido registrada. Nos pondremos en contacto contigo pronto.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.dmSans(
                        fontSize: 14, color: AppColors.textSecondary),
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
      appBar: AppBar(title: const Text('Solicitar servicio')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Tipo de servicio',
                style: GoogleFonts.dmSans(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 12),
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 2,
                mainAxisSpacing: 10,
                crossAxisSpacing: 10,
                childAspectRatio: 1.6,
                children: _serviceTypes.map((s) {
                  final isSelected = _selectedType == s['value'];
                  return GestureDetector(
                    onTap: () =>
                        setState(() => _selectedType = s['value'] as String),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color:
                            isSelected ? AppColors.primaryBg : Colors.white,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: isSelected
                              ? AppColors.primary
                              : AppColors.border,
                          width: isSelected ? 2 : 1,
                        ),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            s['icon'] as IconData,
                            color: isSelected
                                ? AppColors.primary
                                : AppColors.textTertiary,
                            size: 24,
                          ),
                          const SizedBox(height: 6),
                          Text(
                            s['label'] as String,
                            style: GoogleFonts.dmSans(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: isSelected
                                  ? AppColors.primary
                                  : AppColors.textPrimary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),
              TextFormField(
                controller: _addressCtrl,
                decoration: const InputDecoration(
                  labelText: 'Direccion',
                  hintText: 'Av. Insurgentes 1234',
                ),
                validator: (v) {
                  if (v == null || v.trim().isEmpty)
                    return 'Direccion requerida';
                  return null;
                },
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
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: _submitting ? null : _submit,
                  child: _submitting
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white),
                        )
                      : const Text('Solicitar servicio'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
