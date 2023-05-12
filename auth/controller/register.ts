import bcrypt from "bcrypt";
import client from "../configs/database";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

// Register function
export const register = async (req: Request, res: Response) => {
  const { name, email, phonenumber, password } = req.body;
  try {
    const data = await client.query(`SELECT * FROM users WHERE email = $1;`, [
      email,
    ]); // Checking if the user is already registered
    const arr = data.rows;
    if (arr.length !== 0) {
      return res.status(400).json({
        error: "Email already registered, no need to register again, master",
      });
    } else {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          res.status(500).json({
            error: "Server error",
          });
        }
        const user = {
          name,
          email,
          phonenumber,
          password: hash,
        };
        let flag = 1; // Declaring a flag

        // Inserting data into the database

        client.query(
          `INSERT INTO users (name, email, phonenumber, password) VALUES ($1, $2, $3, $4);`,
          [user.name, user.email, user.phonenumber, user.password],
          (err) => {
            if (err) {
              flag = 0; // If the user is not in the database, flag = 0
              console.error(err);
              return res.status(500).json({
                error: err.message,
              });
            } else {
              flag = 1;
              res.status(200).send({ message: "User added to the database" });
            }
          }
        );
        if (flag) {
          const token = jwt.sign(
            // Registering jwt
            {
              email: user.email,
            },
            process.env.SECRET_KEY as string
          );
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Database error while registering the user", // Database connection error
    });
  }
};
