import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:mauagendar/calendar.dart';
import 'dart:convert';

class Appointment {
  final int id;
  final String title;
  final String description;
  final String startTime;
  final String endTime;

  Appointment({
    required this.id,
    required this.title,
    required this.description,
    required this.startTime,
    required this.endTime,
  });
  Appointment copyWith({
    int? id,
    String? title,
    String? description,
    String? startTime,
    String? endTime,
  }) {
    return Appointment(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
    );
  }

  factory Appointment.fromJson(Map<String, dynamic> json) {
    return Appointment(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      startTime: json['start_time'],
      endTime: json['end_time'],
    );
  }
  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'description': description,
      'start_time': startTime,
      'end_time': endTime,
    };
  }
}

class Compromissos extends StatefulWidget {
  final String userId;
  const Compromissos({super.key, required this.userId});

  @override
  _CompromissosState createState() => _CompromissosState();
}

class _CompromissosState extends State<Compromissos> {
  late List<Appointment> _appointments;
  late Appointment _newAppointment;

  @override
  void initState() {
    super.initState();
    _appointments = [];
    _newAppointment = Appointment(
      id: 0,
      title: '',
      description: '',
      startTime: '',
      endTime: '',
    );
    _fetchAppointments();
  }

  Future<void> _fetchAppointments() async {
    const storage = FlutterSecureStorage();
    final token = await storage.read(key: 'jwt');
    if (widget.userId == '0') {
      return;
    }

    try {
      final response = await http.get(
        Uri.parse('http://localhost:5000/user/${widget.userId}/appointments'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token'
        },
      );

      if (response.statusCode < 400) {
        final data = jsonDecode(response.body) as List<dynamic>;
        final appointments = data.map((e) => Appointment.fromJson(e)).toList();
        setState(() {
          _appointments = appointments;
        });
      } else {
        setState(() {
          _appointments = [];
        });
      }
    } catch (error) {
      throw Exception('Error fetching appointments: $error');
    }
  }

  Future<void> _createAppointment() async {
    const storage = FlutterSecureStorage();
    final token = await storage.read(key: 'jwt');
    if (widget.userId == '0') {
      return;
    }

    try {
      final response = await http.post(
        Uri.parse('http://localhost:5000/user/${widget.userId}/appointments'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token'
        },
        body: jsonEncode(_newAppointment),
      );

      if (response.statusCode < 400) {
        final data = jsonDecode(response.body);
        final appointment = Appointment.fromJson(data);
        setState(() {
          _appointments = [..._appointments, appointment];
          _newAppointment = Appointment(
            id: 0,
            title: '',
            description: '',
            startTime: '',
            endTime: '',
          );
        });
      } else {
        throw Exception('Error creating appointment: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Error creating appointment: $error');
    }
  }

  Future<void> _updateAppointment(int id) async {
    const storage = FlutterSecureStorage();
    final token = await storage.read(key: 'jwt');
    if (widget.userId == '0') {
      return;
    }

    try {
      final response = await http.put(
        Uri.parse(
            'http://localhost:5000/user/${widget.userId}/appointments/$id'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token'
        },
        body: jsonEncode(_newAppointment),
      );

      if (response.statusCode >= 400) {
        throw Exception('Error updating appointment: ${response.statusCode}');
      }
      setState(() {
        _fetchAppointments();
      });
    } catch (error) {
      throw Exception('Error updating appointment: $error');
    }
  }

  Future<void> _deleteAppointment(int id) async {
    const storage = FlutterSecureStorage();
    final token = await storage.read(key: 'jwt');
    if (widget.userId == '0') {
      return;
    }

    try {
      final response = await http.delete(
        Uri.parse(
            'http://localhost:5000/user/${widget.userId}/appointments/$id'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token'
        },
      );

      if (response.statusCode < 400) {
        setState(() {
          _fetchAppointments();
        });
      } else {
        throw Exception('Error deleting appointment: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Error deleting appointment: $error');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Compromissos'),
        actions: [
          IconButton(
            icon: const Icon(Icons.calendar_today),
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => CalendarPage(userId: widget.userId)),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 16),
            Column(
              children: _appointments.map((appointment) {
                return Container(
                  padding: const EdgeInsets.all(16),
                  margin:
                      const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.purple[300]!),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        appointment.title,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        appointment.description,
                        style: const TextStyle(
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Tempo de Início: ${appointment.startTime}',
                        style: const TextStyle(
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Prazo: ${appointment.endTime}',
                        style: const TextStyle(
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          TextButton(
                            onPressed: () => _deleteAppointment(appointment.id),
                            child: Text(
                              'Deletar',
                              style: TextStyle(
                                color: Colors.red[500],
                              ),
                            ),
                          ),
                          TextButton(
                            onPressed: () => setState(() {
                              _newAppointment = appointment;
                            }),
                            child: Text(
                              'Editar',
                              style: TextStyle(
                                color: Colors.blue[500],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 16),
            const Text(
              'Criar Compromisso',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 16),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TextField(
                    decoration: const InputDecoration(
                      labelText: 'Título',
                    ),
                    style: const TextStyle(
                      color: Colors.white,
                    ),
                    onChanged: (value) {
                      setState(() {
                        _newAppointment =
                            _newAppointment.copyWith(title: value);
                      });
                    },
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    decoration: const InputDecoration(
                      labelText: 'Descrição',
                    ),
                    style: const TextStyle(
                      color: Colors.white,
                    ),
                    onChanged: (value) {
                      setState(() {
                        _newAppointment =
                            _newAppointment.copyWith(description: value);
                      });
                    },
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    decoration: const InputDecoration(
                      labelText: 'Tempo de Início',
                    ),
                    style: const TextStyle(
                      color: Colors.white,
                    ),
                    onChanged: (value) {
                      setState(() {
                        _newAppointment =
                            _newAppointment.copyWith(startTime: value);
                      });
                    },
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    decoration: const InputDecoration(
                      labelText: 'Prazo',
                    ),
                    style: const TextStyle(
                      color: Colors.white,
                    ),
                    onChanged: (value) {
                      setState(() {
                        _newAppointment =
                            _newAppointment.copyWith(endTime: value);
                      });
                    },
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      if (_newAppointment.id == 0) {
                        _createAppointment().catchError((error) {
                          showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              title: const Text('Error'),
                              content: Text(error.toString()),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(context),
                                  child: const Text('OK'),
                                ),
                              ],
                            ),
                          );
                        });
                      } else {
                        _updateAppointment(_newAppointment.id)
                            .catchError((error) {
                          showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              title: const Text('Error'),
                              content: Text(error.toString()),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(context),
                                  child: const Text('OK'),
                                ),
                              ],
                            ),
                          );
                        });
                      }
                    },
                    child: Text(
                      _newAppointment.id == 0 ? 'Criar' : 'Atualizar',
                      style: const TextStyle(
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}
