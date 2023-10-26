import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/user";
import { login } from "./controller/login";
import { publishAuthenticationEvent } from "./controller/publishAuthEvent";

jest.mock("./models/user");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("./controller/publishAuthEvent");

describe("login function", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        email: "johndoe@example.com",
        password: "Mauagendar$up3r$3nh4!",
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

  it("should log in a user with correct credentials", async () => {
    const user = new User({
      email: "johndoe@example.com",
      password: await bcrypt.hash("Mauagendar$up3r$3nh4!", undefined),
    });

    (User.findOne as jest.Mock).mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("token");

    await login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User logged in!",
      token: "token",
    });
    expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, user.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        email: user.email,
        user_id: user.id,
      },
      undefined,
      { expiresIn: "1h" }
    );
    expect(publishAuthenticationEvent).toHaveBeenCalledWith("token");
  });

  it("should return an error if the user is not found", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(publishAuthenticationEvent).not.toHaveBeenCalled();
  });

  it("should return an error if the password is incorrect", async () => {
    const user = new User({
      email: "johndoe@example.com",
      password: await bcrypt.hash("Mauagendar$up3r$3nh4!", 10),
    });

    (User.findOne as jest.Mock).mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, user.password);
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(publishAuthenticationEvent).not.toHaveBeenCalled();
  });
});
