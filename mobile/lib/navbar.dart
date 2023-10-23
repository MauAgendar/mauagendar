import 'package:flutter/material.dart';
import 'package:mauagendar/calendar.dart';
import 'package:mauagendar/appointments.dart';

class Navbar extends StatefulWidget {
  final String userId;
  const Navbar({super.key, required this.userId});

  @override
  _NavbarState createState() => _NavbarState();
}

class _NavbarState extends State<Navbar> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Image.asset(
              'assets/images/mauagendar.png',
              height: 64.0,
              width: 64.0,
            ),
            Row(
              children: [
                _buildNavLink(
                    context, 'Calendario', '/calendar', widget.userId),
                _buildNavLink(
                    context, 'Compromissos', '/appointments', widget.userId),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

Widget _buildNavLink(
    BuildContext context, String title, String route, String userId) {
  return Padding(
    padding: const EdgeInsets.symmetric(horizontal: 16.0),
    child: TextButton(
      onPressed: () {
        if (route == '/calendar') {
          Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => CalendarPage(userId: userId)),
          );
        } else if (route == '/appointments') {
          Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => Compromissos(userId: userId)),
          );
        }
      },
      child: Text(
        title,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 16.0,
        ),
      ),
    ),
  );
}
