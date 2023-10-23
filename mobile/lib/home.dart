import 'package:flutter/material.dart';
import 'package:mauagendar/user.dart';
import 'package:mauagendar/navbar.dart';

class HomePage extends StatefulWidget {
  final User user;
  const HomePage({super.key, required this.user});

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mauagendar - Home'),
        actions: [
          Navbar(
            userId: widget.user.id,
          ),
        ],
      ),
      body: Center(
        child: Text(
          "Olá ${widget.user.email}!",
          style: const TextStyle(color: Colors.deepPurple, fontSize: 24.0),
        ),
      ),
    );
  }
}
