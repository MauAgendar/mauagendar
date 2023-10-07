import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { register } from "./controller/register";
import User from "./models/user";
import { publishAuthenticationEvent } from "./controller/publishAuthEvent";

jest.mock("./models/user");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("./controller/publishAuthEvent");

describe("register function", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            body: {
                name: "John Doe",
                email: "johndoe@example.com",
                password: "Mauagendar$up3r$3nh4!",
                phonenumber: "(99)99999-9999",
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should register a new user", async () => {
        const hashedPassword = "h4$h3dP4$$w0rd";
        const token = "token";

        // Mock the bcrypt.hash function to return the hashed password
        (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
        req.body.password = hashedPassword;
        // Mock the User.create function to return a new user
        const newUser = new User(req.body);
        (User.create as jest.Mock).mockResolvedValue(newUser);

        // Mock the jwt.sign function to return a token
        (jwt.sign as jest.Mock).mockReturnValue(token);

        await register(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            id: newUser.id,
            message: "User registered successfully!",
            token: token,
        });
        expect(User.create).toHaveBeenCalledWith(req.body);
        expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, undefined);
        expect(jwt.sign).toHaveBeenCalledWith(
            {
                email: undefined,
                user_id: undefined,
            },
            undefined,
            { expiresIn: "1h" }
        );
        expect(publishAuthenticationEvent).toHaveBeenCalledWith(token);
    });

    it("should return an error if the email already exists", async () => {
        // Mock the User.exists function to return true
        (User.exists as jest.Mock).mockResolvedValue(true);

        await register(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "User already exists",
        });
        expect(User.exists).toHaveBeenCalledWith(req.body.email);
        expect(User.create).not.toHaveBeenCalled();
        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(jwt.sign).not.toHaveBeenCalled();
        expect(publishAuthenticationEvent).not.toHaveBeenCalled();
    });

    it("should return an error if the email is invalid", async () => {
        req.body.email = "invalidEmail";

        await register(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid email" });
        expect(User.create).not.toHaveBeenCalled();
        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(jwt.sign).not.toHaveBeenCalled();
        expect(publishAuthenticationEvent).not.toHaveBeenCalled();
    });

    it("should return an error if the password is not secure", async () => {
        req.body.password = "pass";

        await register(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid password",
        });
        expect(User.create).not.toHaveBeenCalled();
        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(jwt.sign).not.toHaveBeenCalled();
        expect(publishAuthenticationEvent).not.toHaveBeenCalled();
    });
});
