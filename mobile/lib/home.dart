import 'package:flutter/material.dart';
import 'package:mauagendar/main.dart';
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
    const LinearGradient gradient = LinearGradient(
    colors: <Color>[Color.fromARGB(255, 66, 37, 184),  Color.fromARGB(255, 146, 46, 189)],
  );
  
    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: accentColor.withOpacity(0.1),
        title: const Text('Mauagendar - Home'),
        actions: [
          Navbar(
            userId: widget.user.id,
          ),
        ],
      ),
      body: Center(
        child: ShaderMask(
          shaderCallback: (Rect rect){
            return gradient.createShader(rect);
          },
          child: Text(
            "Olá ${widget.user.email}!",
            style: const TextStyle(color: Colors.deepPurple, fontSize: 80),
          ),
        ),
      ),
    );
  }
}
