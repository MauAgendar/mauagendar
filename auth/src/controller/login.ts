import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { publishAuthenticationEvent } from "./publishAuthEvent";
export const login = async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        let token = jwt.sign(
            {
                email: user.email,
                user_id: user.id,
            },
            process.env.SECRET_KEY as string,
            {
                expiresIn: "1h",
            }
        );
        publishAuthenticationEvent(token);
        res.status(200).json({
            message: "User logged in!",
            token: token,
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};
