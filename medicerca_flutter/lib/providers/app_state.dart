import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api.dart';
import '../config/models.dart';

class AppState extends ChangeNotifier {
  final ApiClient api = ApiClient();

  User? _user;
  String? _token;
  UserRole _role = UserRole.patient;
  Booking _booking = const Booking();
  bool _isLoading = false;
  bool _initialized = false;

  User? get user => _user;
  String? get token => _token;
  UserRole get role => _role;
  Booking get booking => _booking;
  bool get isLoading => _isLoading;
  bool get initialized => _initialized;
  bool get isLoggedIn => _token != null && _user != null;

  void _setLoading(bool v) {
    _isLoading = v;
    notifyListeners();
  }

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final email = prefs.getString('email');
    final fullName = prefs.getString('fullName');
    final roleStr = prefs.getString('role');

    if (token != null && email != null && fullName != null) {
      _token = token;
      _user = User(id: 0, email: email, fullName: fullName, role: userRoleFromString(roleStr ?? 'patient'));
      _role = _user!.role;
      api.setToken(token);
    }
    _initialized = true;
    notifyListeners();
  }

  Future<String?> login(String email, String password) async {
    _setLoading(true);
    try {
      final res = await api.login(email, password);
      final token = res['token'] ?? '';
      final userJson = res['user'];
      if (token.isEmpty || userJson == null) {
        return 'Respuesta invalida del servidor';
      }
      final user = User.fromJson(userJson);
      await _saveAuth(token, user);
      return null;
    } on ApiException catch (e) {
      return e.message;
    } catch (e) {
      return 'Error de conexion';
    } finally {
      _setLoading(false);
    }
  }

  Future<String?> register(String email, String password, String fullName, UserRole role) async {
    _setLoading(true);
    try {
      final res = await api.register(email, password, fullName, role);
      final token = res['token'] ?? '';
      final userJson = res['user'];
      if (token.isEmpty || userJson == null) {
        return 'Respuesta invalida del servidor';
      }
      final user = User.fromJson(userJson);
      await _saveAuth(token, user);
      return null;
    } on ApiException catch (e) {
      return e.message;
    } catch (e) {
      return 'Error de conexion';
    } finally {
      _setLoading(false);
    }
  }

  Future<void> _saveAuth(String token, User user) async {
    _token = token;
    _user = user;
    _role = user.role;
    api.setToken(token);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
    await prefs.setString('email', user.email);
    await prefs.setString('fullName', user.fullName);
    await prefs.setString('role', user.role == UserRole.doctor ? 'doctor' : 'patient');
    notifyListeners();
  }

  Future<void> logout() async {
    _token = null;
    _user = null;
    _role = UserRole.patient;
    _booking = const Booking();
    api.setToken(null);
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('email');
    await prefs.remove('fullName');
    await prefs.remove('role');
    notifyListeners();
  }

  void updateBooking(Booking booking) {
    _booking = booking;
    notifyListeners();
  }

  void setRole(UserRole role) {
    _role = role;
    notifyListeners();
  }
}
