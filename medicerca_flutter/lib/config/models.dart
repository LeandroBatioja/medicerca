enum UserRole { patient, doctor }

UserRole userRoleFromString(String s) {
  switch (s) {
    case 'doctor':
      return UserRole.doctor;
    default:
      return UserRole.patient;
  }
}

class User {
  final int id;
  final String email;
  final String fullName;
  final UserRole role;

  User({
    required this.id,
    required this.email,
    required this.fullName,
    required this.role,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? 0,
      email: json['email'] ?? '',
      fullName: json['fullName'] ?? json['full_name'] ?? '',
      role: userRoleFromString(json['role'] ?? 'patient'),
    );
  }

  String get initials {
    final parts = fullName.split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return fullName.isNotEmpty ? fullName[0].toUpperCase() : '?';
  }
}

class Appointment {
  final int id;
  final String type;
  final int? slotId;
  final String? doctor;
  final String? clinic;
  final String? date;
  final String? time;
  final bool confirmed;

  Appointment({
    required this.id,
    required this.type,
    this.slotId,
    this.doctor,
    this.clinic,
    this.date,
    this.time,
    this.confirmed = false,
  });

  factory Appointment.fromJson(Map<String, dynamic> json) {
    return Appointment(
      id: json['id'] ?? 0,
      type: json['type'] ?? '',
      slotId: json['slotId'],
      doctor: json['doctor'],
      clinic: json['clinic'],
      date: json['date'],
      time: json['time'],
      confirmed: json['confirmed'] ?? false,
    );
  }

  String get typeDisplay {
    switch (type) {
      case 'general':
        return 'Consulta General';
      case 'followup':
        return 'Seguimiento';
      case 'emergency':
        return 'Urgencia';
      default:
        return type;
    }
  }
}

class Prescription {
  final int id;
  final String medication;
  final String? frequency;
  final String? refills;
  final String date;
  final int? doctorId;
  final int? patientId;
  final String? patientName;
  final String? doctorName;

  Prescription({
    required this.id,
    required this.medication,
    this.frequency,
    this.refills,
    required this.date,
    this.doctorId,
    this.patientId,
    this.patientName,
    this.doctorName,
  });

  factory Prescription.fromJson(Map<String, dynamic> json) {
    return Prescription(
      id: json['id'] ?? 0,
      medication: json['medication'] ?? '',
      frequency: json['frequency'],
      refills: json['refills'],
      date: json['date'] ?? '',
      doctorId: json['doctorId'],
      patientId: json['patientId'],
      patientName: json['patientName'] ?? json['patient_name'],
      doctorName: json['doctorName'] ?? json['doctor_name'],
    );
  }
}

class Patient {
  final int id;
  final String fullName;
  final String email;

  Patient({
    required this.id,
    required this.fullName,
    required this.email,
  });

  factory Patient.fromJson(Map<String, dynamic> json) {
    return Patient(
      id: json['id'] ?? 0,
      fullName: json['fullName'] ?? json['full_name'] ?? '',
      email: json['email'] ?? '',
    );
  }
}

class HomeService {
  final int id;
  final String serviceType;
  final String? address;
  final String? status;
  final String? createdAt;
  final String? serviceName;

  HomeService({
    required this.id,
    required this.serviceType,
    this.address,
    this.status,
    this.createdAt,
    this.serviceName,
  });

  factory HomeService.fromJson(Map<String, dynamic> json) {
    return HomeService(
      id: json['id'] ?? 0,
      serviceType: json['serviceType'] ?? json['service_type'] ?? '',
      address: json['address'],
      status: json['status'],
      createdAt: json['createdAt'] ?? json['created_at'],
      serviceName: json['serviceName'] ?? json['service_name'],
    );
  }

  String get displayType {
    switch (serviceType) {
      case 'nursing':
        return 'Enfermeria';
      case 'lab':
        return 'Laboratorio';
      case 'physiotherapy':
        return 'Fisioterapia';
      case 'medication':
        return 'Medicamentos';
      default:
        return serviceType;
    }
  }
}

class Slot {
  final int id;
  final String day;
  final String time;
  final String? doctor;
  final bool available;

  const Slot({
    required this.id,
    required this.day,
    required this.time,
    this.doctor,
    this.available = true,
  });

  factory Slot.fromJson(Map<String, dynamic> json) {
    return Slot(
      id: json['id'] ?? 0,
      day: json['day'] ?? '',
      time: json['time'] ?? '',
      doctor: json['doctor'],
      available: json['available'] ?? true,
    );
  }
}

class Booking {
  final String type;
  final Slot? slot;

  const Booking({this.type = '', this.slot});

  Booking copyWith({String? type, Slot? slot, bool clearSlot = false}) {
    return Booking(
      type: type ?? this.type,
      slot: clearSlot ? null : (slot ?? this.slot),
    );
  }
}
