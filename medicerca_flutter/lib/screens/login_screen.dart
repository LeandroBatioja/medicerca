import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../config/constants.dart';
import '../providers/app_state.dart';
import 'registro_screen.dart';
import 'main_shell.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  bool _obscure = true;
  String? _error;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;
    final appState = context.read<AppState>();
    final err = await appState.login(_emailCtrl.text.trim(), _passCtrl.text);
    if (!mounted) return;
    if (err != null) {
      setState(() => _error = err);
    } else {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const MainShell()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final isWide = MediaQuery.of(context).size.width > 640;

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF0369A1), Color(0xFF0284C7), Color(0xFF0EA5E9)],
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            padding: EdgeInsets.symmetric(horizontal: isWide ? 0 : 24, vertical: 32),
            child: Container(
              width: isWide ? 420 : double.infinity,
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withAlpha(15),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        gradient: AppColors.primaryGradient,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(Icons.local_hospital, color: Colors.white, size: 28),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'MediCerca',
                      style: GoogleFonts.lora(
                        fontSize: AppFontSize.heading,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Tu salud, cerca de ti',
                      style: GoogleFonts.dmSans(
                        fontSize: AppFontSize.subtitle,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Trust badge
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: AppColors.successBg,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.verified_user, size: 18, color: AppColors.success),
                          const SizedBox(width: 6),
                          Text(
                            'Conexion segura',
                            style: GoogleFonts.dmSans(
                              fontSize: AppFontSize.body,
                              color: AppColors.success,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 28),

                    // Email
                    TextFormField(
                      controller: _emailCtrl,
                      keyboardType: TextInputType.emailAddress,
                      style: GoogleFonts.dmSans(fontSize: AppFontSize.body),
                      decoration: InputDecoration(
                        labelText: 'Email',
                        labelStyle: GoogleFonts.dmSans(fontSize: AppFontSize.body),
                        prefixIcon: const Icon(Icons.email_outlined, size: 22),
                      ),
                      validator: (v) {
                        if (v == null || v.trim().isEmpty) return 'Email requerido';
                        if (!v.contains('@')) return 'Email invalido';
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),

                    // Password
                    TextFormField(
                      controller: _passCtrl,
                      obscureText: _obscure,
                      style: GoogleFonts.dmSans(fontSize: AppFontSize.body),
                      decoration: InputDecoration(
                        labelText: 'Contrasena',
                        labelStyle: GoogleFonts.dmSans(fontSize: AppFontSize.body),
                        prefixIcon: const Icon(Icons.lock_outline, size: 22),
                        suffixIcon: IconButton(
                          icon: Icon(_obscure ? Icons.visibility_off : Icons.visibility, size: 22),
                          onPressed: () => setState(() => _obscure = !_obscure),
                        ),
                      ),
                      validator: (v) {
                        if (v == null || v.isEmpty) return 'Contrasena requerida';
                        return null;
                      },
                    ),
                    const SizedBox(height: 8),

                    // Error
                    if (_error != null)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(12),
                        margin: const EdgeInsets.only(bottom: 8),
                        decoration: BoxDecoration(
                          color: Colors.red.shade50,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.red.shade200),
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.error_outline, size: 20, color: Colors.red.shade700),
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

                    const SizedBox(height: 8),

                    // Login button
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton.icon(
                        onPressed: appState.isLoading ? null : _login,
                        icon: appState.isLoading
                            ? const SizedBox(
                                width: 22,
                                height: 22,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2.5,
                                  color: Colors.white,
                                ),
                              )
                            : const Icon(Icons.login, size: 22),
                        label: appState.isLoading
                            ? const Text('Iniciando sesion...')
                            : const Text('Iniciar sesion'),
                        style: ElevatedButton.styleFrom(
                          textStyle: GoogleFonts.dmSans(
                            fontSize: AppFontSize.body,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Register link
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'No tienes cuenta? ',
                          style: GoogleFonts.dmSans(
                            color: AppColors.textSecondary,
                            fontSize: AppFontSize.body,
                          ),
                        ),
                        GestureDetector(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const RegistroScreen()),
                            );
                          },
                          child: Text(
                            'Registrate',
                            style: GoogleFonts.dmSans(
                              color: AppColors.primary,
                              fontWeight: FontWeight.w600,
                              fontSize: AppFontSize.body,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
