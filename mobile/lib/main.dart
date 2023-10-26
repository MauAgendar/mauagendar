import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mauagendar/login.dart';

void main() {
  runApp(const LoginApp());
}

Color primaryColor = const Color.fromARGB(255, 66, 37, 184);
Color secondaryColor = const Color.fromARGB(255, 19, 6, 25);
Color accentColor = const Color.fromARGB(255, 146, 46, 189);
Color textColor = const Color.fromARGB(255, 251, 252, 254);
Color backgroundColor = const Color.fromARGB(255, 9, 17, 37);  

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
              seedColor: accentColor,
              // ···
              brightness: Brightness.dark,
            ),
            textTheme:
                GoogleFonts.robotoMonoTextTheme(Theme.of(context).textTheme)));
  }
}
