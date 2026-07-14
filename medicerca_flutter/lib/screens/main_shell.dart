import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../config/constants.dart';
import '../config/models.dart';
import '../providers/app_state.dart';
import '../widgets/mobile_tab_bar.dart';
import 'login_screen.dart';
import 'inicio_screen.dart';
import 'doctor_dashboard_screen.dart';
import 'recetas_screen.dart';
import 'asistencia_screen.dart';
import 'citas_screen.dart';

class MainShell extends StatelessWidget {
  const MainShell({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();

    if (!appState.isLoggedIn) {
      return const LoginScreen();
    }

    return const _MainShellBody();
  }
}

class _MainShellBody extends StatefulWidget {
  const _MainShellBody();

  @override
  State<_MainShellBody> createState() => _MainShellBodyState();
}

class _MainShellBodyState extends State<_MainShellBody> {
  int _currentIndex = 0;

  List<Widget> get _patientScreens => const [
        InicioScreen(),
        CitasScreen(),
        RecetasScreen(),
        AsistenciaScreen(),
      ];

  List<Widget> get _doctorScreens => const [
        DoctorDashboardScreen(),
        CitasScreen(),
        RecetasScreen(),
        AsistenciaScreen(),
      ];

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final screens = appState.role == UserRole.doctor ? _doctorScreens : _patientScreens;
    final isWide = MediaQuery.of(context).size.width > 800;

    return Scaffold(
      body: Row(
        children: [
          if (isWide) const AppSidebar(),
          Expanded(child: screens[_currentIndex]),
        ],
      ),
      bottomNavigationBar: isWide
          ? null
          : MobileTabBar(
              currentIndex: _currentIndex,
              onTap: (i) => setState(() => _currentIndex = i),
              role: appState.role,
            ),
    );
  }
}

class AppSidebar extends StatelessWidget {
  const AppSidebar({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final isDoctor = appState.role == UserRole.doctor;

    return Container(
      width: 240,
      decoration: const BoxDecoration(
        color: Color(0xFF1E293B),
        border: Border(right: BorderSide(color: Color(0xFF334155), width: 1)),
      ),
      child: Column(
        children: [
          // Logo
          Container(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    gradient: AppColors.primaryGradient,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.local_hospital, color: Colors.white, size: 22),
                ),
                const SizedBox(width: 12),
                Text(
                  'MediCerca',
                  style: GoogleFonts.lora(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
          const Divider(color: Color(0xFF334155), height: 1),
          const SizedBox(height: 8),

          // Nav items
          _SidebarItem(
            icon: Icons.home_outlined,
            label: 'Inicio',
            onTap: () {},
          ),
          _SidebarItem(
            icon: Icons.calendar_today_outlined,
            label: 'Citas',
            onTap: () {},
          ),
          _SidebarItem(
            icon: Icons.receipt_long_outlined,
            label: 'Recetas',
            onTap: () {},
          ),
          _SidebarItem(
            icon: Icons.medical_services_outlined,
            label: 'Asistencia',
            onTap: () {},
          ),
          if (isDoctor)
            _SidebarItem(
              icon: Icons.add_circle_outline,
              label: 'Nueva receta',
              onTap: () {},
            ),

          const Spacer(),

          // User info
          Container(
            margin: const EdgeInsets.all(12),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF334155),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 16,
                  backgroundColor: AppColors.primary,
                  child: Text(
                    appState.user?.initials ?? '?',
                    style: GoogleFonts.dmSans(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        appState.user?.fullName ?? '',
                        style: GoogleFonts.dmSans(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        isDoctor ? 'Doctor' : 'Paciente',
                        style: GoogleFonts.dmSans(
                          fontSize: 11,
                          color: AppColors.textTertiary,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.logout, size: 18, color: AppColors.textTertiary),
                  onPressed: () async {
                    await appState.logout();
                    if (context.mounted) {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (_) => const LoginScreen()),
                      );
                    }
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SidebarItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _SidebarItem({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: AppColors.textTertiary, size: 20),
      title: Text(
        label,
        style: GoogleFonts.dmSans(
          fontSize: 14,
          color: Colors.white.withAlpha(200),
        ),
      ),
      dense: true,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      onTap: onTap,
    );
  }
}
