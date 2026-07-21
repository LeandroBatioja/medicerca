import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../config/constants.dart';
import '../config/models.dart';

class MobileTabBar extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;
  final UserRole role;

  const MobileTabBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
    required this.role,
  });

  List<_TabItem> get _patientTabs => const [
        _TabItem(icon: Icons.home_outlined, activeIcon: Icons.home, label: 'Inicio'),
        _TabItem(icon: Icons.calendar_today_outlined, activeIcon: Icons.calendar_today, label: 'Citas'),
        _TabItem(icon: Icons.receipt_long_outlined, activeIcon: Icons.receipt_long, label: 'Recetas'),
        _TabItem(icon: Icons.person_outline, activeIcon: Icons.person, label: 'Perfil'),
      ];

  List<_TabItem> get _doctorTabs => const [
        _TabItem(icon: Icons.home_outlined, activeIcon: Icons.home, label: 'Inicio'),
        _TabItem(icon: Icons.calendar_today_outlined, activeIcon: Icons.calendar_today, label: 'Citas'),
        _TabItem(icon: Icons.receipt_long_outlined, activeIcon: Icons.receipt_long, label: 'Recetas'),
        _TabItem(icon: Icons.people_outline, activeIcon: Icons.people, label: 'Pacientes'),
        _TabItem(icon: Icons.person_outline, activeIcon: Icons.person, label: 'Perfil'),
      ];

  @override
  Widget build(BuildContext context) {
    final tabs = role == UserRole.doctor ? _doctorTabs : _patientTabs;
    final bottomPadding = MediaQuery.of(context).padding.bottom;

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: AppColors.border, width: 1)),
      ),
      padding: EdgeInsets.only(bottom: bottomPadding),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 64,
          child: Row(
            children: List.generate(tabs.length, (i) {
              final tab = tabs[i];
              final isActive = currentIndex == i;
              return Expanded(
                child: GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: () => onTap(i),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        isActive ? tab.activeIcon : tab.icon,
                        size: 24,
                        color: isActive ? AppColors.primary : AppColors.textTertiary,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        tab.label,
                        style: GoogleFonts.dmSans(
                          fontSize: AppFontSize.small,
                          fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                          color: isActive ? AppColors.primary : AppColors.textTertiary,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}

class _TabItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  const _TabItem({required this.icon, required this.activeIcon, required this.label});
}
