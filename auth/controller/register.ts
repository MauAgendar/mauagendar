import bcrypt from "bcrypt";
import client from "../configs/database";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { publishAuthenticationEvent } from "./publishAuthEvent";

// Register function
export const register = async (req: Request, res: Response) => {
    const { name, email, phonenumber, password } = req.body;
    // regex para validar numero de celular brasileiro
    const regex_phone = /^\([1-9]{2}\)[9]{1}[0-9]{4}-[0-9]{4}$/;
    if (!regex_phone.test(phonenumber)) {
        return res.status(400).json({
            error: "Invalid phone number",
        });
    }

    const regex_email = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
    if (!regex_email.test(email)) {
        return res.status(400).json({
            error: "Invalid email",
        });
    }

    const regex_password =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!regex_password.test(password)) {
        return res.status(400).json({
            error: "Invalid password",
        });
    }
    try {
        const data = await client.query(
            `SELECT * FROM users WHERE email = $1;`,
            [email]
        ); // Checking if the user is already registered
        const arr = data.rows;
        if (arr.length !== 0) {
            return res.status(400).json({
                error: "Email already registered, no need to register again",
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
                    `INSERT INTO users (name, email, phonenumber, password) VALUES ($1, $2, $3, $4) RETURNING id;`,
                    [user.name, user.email, user.phonenumber, user.password],
                    (err, result) => {
                        if (err) {
                            flag = 0; // If the user is not in the database, flag = 0
                            console.error(err);
                            return res.status(500).json({
                                error: err.message,
                            });
                        } else {
                            flag = 1;
                            const id = result.rows[0].id;

                            const token = jwt.sign(
                                // Registering jwt
                                {
                                    email: user.email,
                                    user_id: id,
                                },
                                process.env.SECRET_KEY as string
                            );
                            publishAuthenticationEvent(user.email, id);
                            res.status(200).json({
                                message: "User registered successfully!",
                                token: token,
                                id: id,
                            });
                        }
                    }
                );
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Database error",
        });
    }
};
