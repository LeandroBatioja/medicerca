import 'dart:convert';
import 'package:http/http.dart' as http;
import 'models.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  ApiException(this.message, {this.statusCode});
  @override
  String toString() => message;
}

class ApiClient {
  static const String baseUrl = 'https://medicerca-backend.onrender.com';
  String? _token;

  void setToken(String? token) => _token = token;

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (_token != null) 'Authorization': 'Bearer $_token',
      };

  Future<Map<String, dynamic>> _handleResponse(http.Response response) async {
    final body = json.decode(response.body);
    if (response.statusCode >= 400) {
      throw ApiException(
        body['error'] ?? body['message'] ?? 'Error del servidor',
        statusCode: response.statusCode,
      );
    }
    return body;
  }

  Future<http.Response> _get(String path) async {
    return http.get(Uri.parse('$baseUrl$path'), headers: _headers);
  }

  Future<http.Response> _post(String path, {Map<String, dynamic>? body}) async {
    return http.post(
      Uri.parse('$baseUrl$path'),
      headers: _headers,
      body: body != null ? json.encode(body) : null,
    );
  }

  // Auth
  Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await _post('/api/auth/login', body: {
      'email': email,
      'password': password,
    });
    return _handleResponse(res);
  }

  Future<Map<String, dynamic>> register(String email, String password, String fullName, UserRole role) async {
    final res = await _post('/api/auth/register', body: {
      'email': email,
      'password': password,
      'fullName': fullName,
      'role': role == UserRole.doctor ? 'doctor' : 'patient',
    });
    return _handleResponse(res);
  }

  // Appointments
  Future<List<Appointment>> getAppointments() async {
    final res = await _get('/api/appointments');
    final body = await _handleResponse(res);
    final list = body['appointments'] ?? body['data'] ?? [];
    return (list as List).map((a) => Appointment.fromJson(a)).toList();
  }

  Future<Map<String, dynamic>> createAppointment(int slotId, String type) async {
    final res = await _post('/api/appointments', body: {
      'slotId': slotId,
      'type': type,
    });
    return _handleResponse(res);
  }

  // Prescriptions
  Future<List<Prescription>> getPrescriptions() async {
    final res = await _get('/api/prescriptions');
    final body = await _handleResponse(res);
    final list = body['prescriptions'] ?? body['data'] ?? [];
    return (list as List).map((p) => Prescription.fromJson(p)).toList();
  }

  Future<List<Prescription>> getCreatedPrescriptions() async {
    final res = await _get('/api/prescriptions/created');
    final body = await _handleResponse(res);
    final list = body['prescriptions'] ?? body['data'] ?? [];
    return (list as List).map((p) => Prescription.fromJson(p)).toList();
  }

  Future<List<Patient>> getPatients() async {
    final res = await _get('/api/prescriptions/patients');
    final body = await _handleResponse(res);
    final list = body['patients'] ?? body['data'] ?? [];
    return (list as List).map((p) => Patient.fromJson(p)).toList();
  }

  Future<Prescription> createPrescription({
    required int patientId,
    required String medication,
    String? frequency,
    String? refills,
  }) async {
    final res = await _post('/api/prescriptions', body: {
      'patientId': patientId,
      'medication': medication,
      'frequency': frequency,
      'refills': refills,
    });
    final body = await _handleResponse(res);
    return Prescription.fromJson(body['prescription'] ?? body);
  }

  // Home services
  Future<List<HomeService>> getHomeServices() async {
    final res = await _get('/api/home-services');
    final body = await _handleResponse(res);
    final list = body['services'] ?? body['data'] ?? [];
    return (list as List).map((h) => HomeService.fromJson(h)).toList();
  }
}
