import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mauagendar/login.dart';

void main() {
  runApp(const LoginApp());
}

class LoginApp extends StatelessWidget {
  const LoginApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Mauagendar',
        initialRoute: '/',
        routes: {
          '/': (context) => const LoginScreen(),
        },
        theme: ThemeData(
            useMaterial3: true,
            colorScheme: ColorScheme.fromSeed(
              seedColor: Colors.deepPurple.shade900,
              // ···
              brightness: Brightness.dark,
            ),
            textTheme:
                GoogleFonts.robotoMonoTextTheme(Theme.of(context).textTheme)));
  }
}
