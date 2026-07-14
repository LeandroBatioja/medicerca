import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/constants.dart';

class SoporteScreen extends StatelessWidget {
  const SoporteScreen({super.key});

  static const _faqs = [
    _Faq(
      q: 'Como agendar una cita?',
      a: 'Ve a la seccion "Citas" y selecciona el tipo de consulta, luego elige un horario disponible y confirma.',
    ),
    _Faq(
      q: 'Como ver mis recetas?',
      a: 'En la barra de navegacion, selecciona "Recetas" para ver todas tus recetas medicas.',
    ),
    _Faq(
      q: 'Puedo cancelar una cita?',
      a: 'Si, puedes cancelar una cita desde los detalles de la cita hasta 24 horas antes.',
    ),
    _Faq(
      q: 'Como solicitar un servicio a domicilio?',
      a: 'Ve a la seccion "Asistencia" y selecciona el tipo de servicio que necesitas.',
    ),
    _Faq(
      q: 'Como cambio mi contrasena?',
      a: 'Por ahora, contacta a soporte para cambiar tu contrasena. Estamos trabajando en esta funcionalidad.',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Soporte')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Contact card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Column(
                children: [
                  const Icon(Icons.headset_mic_outlined, color: Colors.white, size: 32),
                  const SizedBox(height: 12),
                  Text(
                    'Necesitas ayuda?',
                    style: GoogleFonts.lora(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Nuestro equipo esta disponible 24/7',
                    style: GoogleFonts.dmSans(fontSize: 13, color: Colors.white70),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 40,
                    child: ElevatedButton(
                      onPressed: () async {
                        final uri = Uri.parse('tel:+528001234567');
                        if (await canLaunchUrl(uri)) {
                          await launchUrl(uri);
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: AppColors.primary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      child: Text(
                        'Contactar soporte',
                        style: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // FAQ
            Text(
              'Preguntas frecuentes',
              style: GoogleFonts.dmSans(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 12),
            ...List.generate(_faqs.length, (i) {
              return _FaqTile(faq: _faqs[i]);
            }),
          ],
        ),
      ),
    );
  }
}

class _Faq {
  final String q;
  final String a;
  const _Faq({required this.q, required this.a});
}

class _FaqTile extends StatefulWidget {
  final _Faq faq;
  const _FaqTile({required this.faq});

  @override
  State<_FaqTile> createState() => _FaqTileState();
}

class _FaqTileState extends State<_FaqTile> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          GestureDetector(
            onTap: () => setState(() => _expanded = !_expanded),
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      widget.faq.q,
                      style: GoogleFonts.dmSans(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ),
                  Icon(
                    _expanded ? Icons.expand_less : Icons.expand_more,
                    color: AppColors.textTertiary,
                    size: 20,
                  ),
                ],
              ),
            ),
          ),
          if (_expanded)
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 0, 14, 14),
              child: Text(
                widget.faq.a,
                style: GoogleFonts.dmSans(fontSize: 13, color: AppColors.textSecondary, height: 1.5),
              ),
            ),
        ],
      ),
    );
  }
}
