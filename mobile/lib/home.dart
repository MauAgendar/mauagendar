import 'package:flutter/material.dart';
import 'package:mauagendar/user.dart';
import 'package:mauagendar/navbar.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late User _user;
  String _greeting = '';

  @override
  void initState() {
    super.initState();
    _getUser();
  }

  Future<void> _getUser() async {
    final user = await getUserFromJwt();
    setState(() {
      _user = user;
      _greeting = 'Olá, ${_user.email}!';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mauagendar - Home'),
        actions: const [
          Navbar(),
        ],
      ),
      body: Center(
        child: Text(
          _greeting,
          style: const TextStyle(color: Colors.deepPurple, fontSize: 24.0),
        ),
      ),
    );
  }
}
