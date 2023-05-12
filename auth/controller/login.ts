import bcrypt from "bcrypt";
import client from "../configs/database";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

// Login function
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const data = await client.query(`SELECT * FROM users WHERE email = $1;`, [
      email,
    ]); // Verifying if the user exists in the database
    const user = data.rows;
    if (user.length === 0) {
      res.status(400).json({
        error: "User not registered, please sign up first",
      });
    } else {
      bcrypt.compare(password, user[0].password, (err, result) => {
        // Comparing hashed password
        if (err) {
          res.status(500).json({
            error: "Server error",
          });
        } else if (result === true) {
          // Checking if the results match
          const token = jwt.sign(
            {
              email: email,
            },
            process.env.SECRET_KEY as string
          );
          res.status(200).json({
            message: "User logged in!",
            token: token,
          });
        } else {
          // Handling errors
          if (!result)
            res.status(400).json({
              error: "Incorrect password!",
            });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Database error while logging in!", // Database connection error
    });
  }
};
