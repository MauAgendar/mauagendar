import express from "express";
import { Request, Response } from "express";
import { register } from "../controller/register";
import { login } from "../controller/login";

const router = express.Router();

router.post("/register", register); // POST request de cadastro

router.post("/login", login); // POST request de login

export default router;
