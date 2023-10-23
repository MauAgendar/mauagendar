import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:table_calendar/table_calendar.dart';

class Appointment {
  final int id;
  final String title;
  final DateTime startTime;
  final DateTime endTime;
  final String description;

  Appointment({
    required this.id,
    required this.title,
    required this.startTime,
    required this.endTime,
    required this.description,
  });

  factory Appointment.fromJson(Map<String, dynamic> json) {
    return Appointment(
      id: json['id'],
      title: json['title'],
      startTime: DateTime.parse(json['start_time']),
      endTime: DateTime.parse(json['end_time']),
      description: json['description'],
    );
  }
}

class CalendarPage extends StatefulWidget {
  final String userId;

  const CalendarPage({super.key, required this.userId});

  @override
  _CalendarPageState createState() => _CalendarPageState();
}

class _CalendarPageState extends State<CalendarPage> {
  late Map<DateTime, List<Appointment>> _events;
  late List<Appointment> _appointments;

  @override
  void initState() {
    super.initState();
    _events = {};
    _appointments = [];
    _fetchAppointments();
  }

  Future<void> _fetchAppointments() async {
    const storage = FlutterSecureStorage();
    final token = await storage.read(key: 'jwt');
    final url =
        Uri.parse('http://localhost:5000/user/${widget.userId}/appointments');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode < 400) {
      final data = jsonDecode(response.body);
      final appointments = List<Appointment>.from(
          data.map((appointment) => Appointment.fromJson(appointment)));
      setState(() {
        _appointments = appointments;
        _events = _groupAppointmentsByDate(appointments);
      });
    } else {
      throw Exception('Failed to fetch appointments');
    }
  }

  Map<DateTime, List<Appointment>> _groupAppointmentsByDate(
      List<Appointment> appointments) {
    final Map<DateTime, List<Appointment>> events = {};
    for (final appointment in appointments) {
      final date = DateTime(appointment.startTime.year,
          appointment.startTime.month, appointment.startTime.day);
      if (events[date] == null) {
        events[date] = [];
      }
      events[date]!.add(appointment);
    }
    return events;
  }

  List<Appointment> _getAppointmentsForDay(DateTime day) {
    return _events[day] ?? [];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Meus Compromissos'),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TableCalendar(
            calendarBuilders: CalendarBuilders(
              selectedBuilder: (context, date, _) {
                return Container(
                  margin: const EdgeInsets.all(4.0),
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: Colors.deepPurple[800],
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    date.day.toString(),
                    style: const TextStyle(color: Colors.white),
                  ),
                );
              },
              todayBuilder: (context, date, _) {
                return Container(
                  margin: const EdgeInsets.all(4.0),
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: Colors.deepPurple[800],
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    date.day.toString(),
                    style: const TextStyle(color: Colors.white),
                  ),
                );
              },
            ),
            headerStyle: const HeaderStyle(
              formatButtonVisible: false,
            ),
            eventLoader: _getAppointmentsForDay,
            calendarStyle: CalendarStyle(
              todayDecoration: BoxDecoration(
                color: Colors.deepPurple[800],
                shape: BoxShape.circle,
              ),
              selectedDecoration: BoxDecoration(
                color: Colors.deepPurple[800],
                shape: BoxShape.circle,
              ),
              selectedTextStyle: const TextStyle(color: Colors.white),
              todayTextStyle: const TextStyle(color: Colors.white),
            ),
            focusedDay: DateTime.now(),
            firstDay: DateTime.utc(2022, 1, 1),
            lastDay: DateTime.utc(2025, 12, 31),
            onDaySelected: (DateTime selectedDay, DateTime focusedDay) {
              setState(() {
                _appointments = _getAppointmentsForDay(selectedDay);
              });
            },
          ),
          Expanded(
            child: ListView.builder(
              itemCount: _appointments.length,
              itemBuilder: (context, index) {
                final appointment = _appointments[index];
                return ListTile(
                  title: Text(appointment.title),
                  subtitle: Text(appointment.description),
                  trailing: Text(
                      '${appointment.startTime.hour}:${appointment.startTime.minute} - ${appointment.endTime.hour}:${appointment.endTime.minute}'),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
