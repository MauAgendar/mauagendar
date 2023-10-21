import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:mauagendar/login.dart';
import 'package:mauagendar/home.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class Register extends StatefulWidget {
  const Register({super.key});

  @override
  _RegisterState createState() => _RegisterState();
}

class _RegisterState extends State<Register> {
  String name = "";
  String phonenumber = "";
  String email = "";
  String password = "";
  String confirmPassword = "";
  bool passwordsMatch = true;

  final _formKey = GlobalKey<FormState>();

  Future<void> _handleSubmit() async {
    if (password != confirmPassword) {
      setState(() {
        passwordsMatch = false;
      });
      return;
    }

    final formData = {
      'name': name,
      'phonenumber': phonenumber,
      'email': email,
      'password': password,
    };

    try {
      final response = await http.post(
        Uri.parse('http://localhost:5050/user/register'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(formData),
      );

      if (response.statusCode >= 400) {
        throw Exception(jsonDecode(response.body)['message']);
      }

      final responseJson = jsonDecode(response.body);
      if (responseJson.containsKey('token')) {
        final token = responseJson['token'];
        // Create storage
        const storage = FlutterSecureStorage();

        // Write value
        await storage.write(key: 'jwt', value: token);
        _home();
      } else {
        throw Exception('Token não encontrado');
      }
    } catch (error) {
      if (error is http.Response) {
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('Erro ao registrar'),
              content: Text(error.body),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('OK'),
                ),
              ],
            );
          },
        );
      } else {
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('Erro ao registrar'),
              content: Text(error.toString()),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('OK'),
                ),
              ],
            );
          },
        );
      }
    }
  }

  Future<dynamic> _home() {
    return Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const HomePage(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[900],
      body: Center(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Form(
              key: _formKey,
              child: SizedBox(
                width: 800,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Cadastre-se',
                      style: TextStyle(
                        fontSize: 24.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.purple[500],
                      ),
                    ),
                    const SizedBox(height: 16.0),
                    TextFormField(
                      decoration: InputDecoration(
                        labelText: 'Nome',
                        labelStyle: TextStyle(
                          color: Colors.grey[200],
                          fontWeight: FontWeight.bold,
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.grey[700]!,
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.purple[400]!,
                          ),
                        ),
                      ),
                      style: TextStyle(
                        color: Colors.purple[300],
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Por favor, digite seu nome';
                        }
                        return null;
                      },
                      onChanged: (value) {
                        setState(() {
                          name = value;
                        });
                      },
                    ),
                    const SizedBox(height: 16.0),
                    TextFormField(
                      decoration: InputDecoration(
                        labelText: 'Telefone',
                        labelStyle: TextStyle(
                          color: Colors.grey[200],
                          fontWeight: FontWeight.bold,
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.grey[700]!,
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.purple[400]!,
                          ),
                        ),
                      ),
                      style: TextStyle(
                        color: Colors.purple[300],
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Por favor, digite seu telefone';
                        }
                        return null;
                      },
                      onChanged: (value) {
                        setState(() {
                          phonenumber = value;
                        });
                      },
                    ),
                    const SizedBox(height: 16.0),
                    TextFormField(
                      decoration: InputDecoration(
                        labelText: 'Email',
                        labelStyle: TextStyle(
                          color: Colors.grey[200],
                          fontWeight: FontWeight.bold,
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.grey[700]!,
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.purple[400]!,
                          ),
                        ),
                      ),
                      style: TextStyle(
                        color: Colors.purple[300],
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Por favor, digite seu email';
                        }
                        return null;
                      },
                      onChanged: (value) {
                        setState(() {
                          email = value;
                        });
                      },
                    ),
                    const SizedBox(height: 16.0),
                    TextFormField(
                      decoration: InputDecoration(
                        labelText: 'Senha',
                        labelStyle: TextStyle(
                          color: Colors.grey[200],
                          fontWeight: FontWeight.bold,
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.grey[700]!,
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.purple[400]!,
                          ),
                        ),
                      ),
                      style: TextStyle(
                        color: Colors.purple[300],
                      ),
                      obscureText: true,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Por favor, digite sua senha';
                        }
                        return null;
                      },
                      onChanged: (value) {
                        setState(() {
                          password = value;
                        });
                      },
                    ),
                    const SizedBox(height: 16.0),
                    TextFormField(
                      decoration: InputDecoration(
                        labelText: 'Confirmar senha',
                        labelStyle: TextStyle(
                          color: Colors.grey[200],
                          fontWeight: FontWeight.bold,
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.grey[700]!,
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.purple[400]!,
                          ),
                        ),
                        errorBorder: OutlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.red[500]!,
                          ),
                        ),
                        focusedErrorBorder: OutlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.red[500]!,
                          ),
                        ),
                      ),
                      style: TextStyle(
                        color: Colors.purple[300],
                      ),
                      obscureText: true,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Por favor, confirme sua senha';
                        }
                        if (value != password) {
                          return 'As senhas não coincidem. Tente novamente.';
                        }
                        return null;
                      },
                      onChanged: (value) {
                        setState(() {
                          confirmPassword = value;
                          passwordsMatch = true;
                        });
                      },
                    ),
                    if (!passwordsMatch)
                      Padding(
                        padding: const EdgeInsets.only(top: 8.0),
                        child: Text(
                          'As senhas não coincidem. Tente novamente.',
                          style: TextStyle(
                            color: Colors.red[500],
                            fontSize: 12.0,
                          ),
                        ),
                      ),
                    const SizedBox(height: 16.0),
                    ElevatedButton(
                      onPressed: () {
                        if (_formKey.currentState!.validate()) {
                          _handleSubmit();
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        foregroundColor: Colors.white,
                        backgroundColor: Colors.purple[700],
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8.0),
                        ),
                        padding: const EdgeInsets.symmetric(
                          vertical: 16.0,
                        ),
                        minimumSize: const Size(double.infinity, 0),
                      ),
                      child: const Text('Cadastre-se'),
                    ),
                    const SizedBox(height: 16.0),
                    Text(
                      'Já tem uma conta?',
                      style: TextStyle(
                        color: Colors.grey[300],
                        fontSize: 12.0,
                      ),
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const LoginScreen()));
                      },
                      child: Text(
                        'Logar',
                        style: TextStyle(
                          color: Colors.purple[300],
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
