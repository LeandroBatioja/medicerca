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

  Future<dynamic> _handleResponse(http.Response response) async {
    final body = json.decode(response.body);
    if (response.statusCode >= 400) {
      throw ApiException(
        body is Map ? (body['error'] ?? body['message'] ?? 'Error del servidor') : 'Error del servidor',
        statusCode: response.statusCode,
      );
    }
    return body;
  }

  List<dynamic> _extractList(dynamic body) {
    if (body is List) return body;
    if (body is Map) {
      return body['prescriptions'] ?? body['appointments'] ?? body['patients'] ?? body['services'] ?? body['data'] ?? [];
    }
    return [];
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
    final body = await _handleResponse(res);
    if (body is! Map<String, dynamic>) throw ApiException('Respuesta invalida');
    return body;
  }

  Future<Map<String, dynamic>> register(String email, String password, String fullName, UserRole role) async {
    final res = await _post('/api/auth/register', body: {
      'email': email,
      'password': password,
      'fullName': fullName,
      'role': role == UserRole.doctor ? 'doctor' : 'patient',
    });
    final body = await _handleResponse(res);
    if (body is! Map<String, dynamic>) throw ApiException('Respuesta invalida');
    return body;
  }

  // Appointments
  Future<List<Appointment>> getAppointments() async {
    final res = await _get('/api/appointments');
    final body = await _handleResponse(res);
    final list = _extractList(body);
    return list.map((a) => Appointment.fromJson(a)).toList();
  }

  Future<List<Appointment>> getDoctorAppointments() async {
    final res = await _get('/api/appointments/doctor');
    final body = await _handleResponse(res);
    final list = _extractList(body);
    return list.map((a) => Appointment.fromJson(a)).toList();
  }

  Future<Map<String, dynamic>> createAppointment({
    required int slotId,
    required String type,
    required String doctor,
    required String clinic,
    int? doctorId,
    String? date,
    String? time,
  }) async {
    final res = await _post('/api/appointments', body: {
      'slotId': slotId,
      'type': type,
      'doctor': doctor,
      'clinic': clinic,
      if (doctorId != null) 'doctorId': doctorId,
      if (date != null) 'date': date,
      if (time != null) 'time': time,
    });
    final body = await _handleResponse(res);
    if (body is! Map<String, dynamic>) throw ApiException('Respuesta invalida');
    return body;
  }

  Future<void> deleteAppointment(int id) async {
    final res = await http.delete(
      Uri.parse('$baseUrl/api/appointments/$id'),
      headers: _headers,
    );
    await _handleResponse(res);
  }

  // Prescriptions
  Future<List<Prescription>> getPrescriptions() async {
    final res = await _get('/api/prescriptions');
    final body = await _handleResponse(res);
    final list = _extractList(body);
    return list.map((p) => Prescription.fromJson(p)).toList();
  }

  Future<List<Prescription>> getCreatedPrescriptions() async {
    final res = await _get('/api/prescriptions/created');
    final body = await _handleResponse(res);
    final list = _extractList(body);
    return list.map((p) => Prescription.fromJson(p)).toList();
  }

  Future<List<Patient>> getPatients() async {
    final res = await _get('/api/prescriptions/patients');
    final body = await _handleResponse(res);
    final list = _extractList(body);
    return list.map((p) => Patient.fromJson(p)).toList();
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
    if (body is Map) {
      return Prescription.fromJson(body['prescription'] ?? body);
    }
    throw ApiException('Respuesta invalida');
  }

  // Doctors
  Future<List<Patient>> getDoctors() async {
    final res = await _get('/api/doctors');
    final body = await _handleResponse(res);
    final list = _extractList(body);
    return list.map((d) => Patient.fromJson(d)).toList();
  }

  // Home services
  Future<List<HomeService>> getHomeServices() async {
    final res = await _get('/api/home-services');
    final body = await _handleResponse(res);
    final list = _extractList(body);
    return list.map((h) => HomeService.fromJson(h)).toList();
  }

  Future<Map<String, dynamic>> createHomeService({
    required String serviceType,
    required String address,
  }) async {
    final res = await _post('/api/home-services', body: {
      'serviceType': serviceType,
      'address': address,
    });
    final body = await _handleResponse(res);
    if (body is! Map<String, dynamic>) throw ApiException('Respuesta invalida');
    return body;
  }
}
