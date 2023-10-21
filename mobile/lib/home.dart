import 'package:flutter/material.dart';
import 'package:mauagendar/user.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String greeting = 'Olá, visitante!';

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<User>(
      future: getUserFromJwt(),
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        }
        greeting = 'Olá, ${snapshot.data?.email}!';
        return Scaffold(
          appBar: AppBar(
            title: const Text('Home Page'),
          ),
          body: Center(
            child: Text(
              greeting,
              style: const TextStyle(color: Colors.deepPurple, fontSize: 24.0),
            ),
          ),
        );
      },
    );
  }
}
