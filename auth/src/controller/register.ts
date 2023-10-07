import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { publishAuthenticationEvent } from "./publishAuthEvent";
export const register = async (req: Request, res: Response) => {
    const {
        name,
        email,
        password,
        phonenumber,
    }: { name: string; email: string; password: string; phonenumber: string } =
        req.body;

    // Verify if phone number is valid
    const phoneRegex = /^\(\d{2}\)9\d{4}-\d{4}$/;
    if (!phoneRegex.test(phonenumber)) {
        return res.status(400).json({ error: "Invalid phone number" });
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
        // Check if user already exists
        const existingUser = await User.exists(email);
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phonenumber,
        });

        let token = jwt.sign(
            { email: newUser.email, user_id: newUser.id },
            process.env.SECRET_KEY as string,
            {
                expiresIn: "1h",
            }
        );
        publishAuthenticationEvent(token);
        res.status(201).json({
            message: "User registered successfully!",
            token: token,
            id: newUser.id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
