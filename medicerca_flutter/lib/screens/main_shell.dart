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
import 'citas_screen.dart';
import 'perfil_screen.dart';
import 'crear_receta_screen.dart';
import 'pacientes_screen.dart';

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

class _MainShellBody extends StatelessWidget {
  const _MainShellBody();

  List<Widget> get _patientScreens => const [
        InicioScreen(),
        CitasScreen(),
        RecetasScreen(),
        PerfilScreen(),
      ];

  List<Widget> get _doctorScreens => const [
        DoctorDashboardScreen(),
        CitasScreen(),
        RecetasScreen(),
        PacientesScreen(),
        PerfilScreen(),
      ];

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final isDoctor = appState.role == UserRole.doctor;
    final screens = isDoctor ? _doctorScreens : _patientScreens;
    final isWide = MediaQuery.of(context).size.width > 800;

    return Scaffold(
      body: Row(
        children: [
          if (isWide) const AppSidebar(),
          Expanded(child: screens[appState.currentTab]),
        ],
      ),
      bottomNavigationBar: isWide
          ? null
          : MobileTabBar(
              currentIndex: appState.currentTab,
              onTap: (i) => appState.switchTab(i),
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
                  child: const Icon(Icons.local_hospital,
                      color: Colors.white, size: 22),
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
          _SidebarItem(
            icon: Icons.home_outlined,
            label: 'Inicio',
            active: appState.currentTab == 0,
            onTap: () => appState.switchTab(0),
          ),
          _SidebarItem(
            icon: Icons.calendar_today_outlined,
            label: 'Citas',
            active: appState.currentTab == 1,
            onTap: () => appState.switchTab(1),
          ),
          _SidebarItem(
            icon: Icons.receipt_long_outlined,
            label: 'Recetas',
            active: appState.currentTab == 2,
            onTap: () => appState.switchTab(2),
          ),
          if (isDoctor) ...[
            const Divider(color: Color(0xFF334155), height: 1, indent: 16, endIndent: 16),
            _SidebarItem(
              icon: Icons.people_outline,
              label: 'Mis pacientes',
              active: false,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const PacientesScreen()),
                );
              },
            ),
            _SidebarItem(
              icon: Icons.add_circle_outline,
              label: 'Nueva receta',
              active: false,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (_) => const CrearRecetaScreen()),
                );
              },
            ),
          ],
          _SidebarItem(
            icon: Icons.person_outline,
            label: 'Perfil',
            active: appState.currentTab == 3,
            onTap: () => appState.switchTab(3),
          ),
          const Spacer(),
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
                          fontSize: AppFontSize.body,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        isDoctor ? 'Doctor' : 'Paciente',
                        style: GoogleFonts.dmSans(
                          fontSize: AppFontSize.body,
                          color: const Color(0xFF94A3B8),
                        ),
                      ),
                    ],
                  ),
                ),
                Tooltip(
                  message: 'Cerrar sesion',
                  child: IconButton(
                    icon: const Icon(Icons.logout,
                        size: 22, color: Color(0xFF94A3B8)),
                    onPressed: () async {
                      await appState.logout();
                      if (context.mounted) {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                              builder: (_) => const LoginScreen()),
                        );
                      }
                    },
                  ),
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
  final bool active;
  final VoidCallback onTap;

  const _SidebarItem({
    required this.icon,
    required this.label,
    required this.active,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon,
          color: active ? Colors.white : const Color(0xFF94A3B8), size: 22),
      title: Text(
        label,
        style: GoogleFonts.dmSans(
          fontSize: AppFontSize.body,
          fontWeight: active ? FontWeight.w600 : FontWeight.w400,
          color: active ? Colors.white : Colors.white.withAlpha(180),
        ),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      tileColor: active ? const Color(0xFF334155) : Colors.transparent,
      onTap: onTap,
    );
  }
}
