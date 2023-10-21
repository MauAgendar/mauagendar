import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

class User {
  final String email;
  final String id;

  User({required this.email, required this.id});
}

Future<User> getUserFromJwt() async {
  const storage = FlutterSecureStorage();
  final jwt = await storage.read(key: 'jwt');
  Map<String, dynamic> decodedToken = JwtDecoder.decode(jwt!);
  return User(
      email: decodedToken['email'].toString(),
      id: decodedToken['id'].toString());
}
