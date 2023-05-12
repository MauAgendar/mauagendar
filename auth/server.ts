import express from "express";
import cors from "cors";
import { Request, Response } from "express";
const app = express(); // Initializing express
import dotenv from "dotenv";
dotenv.config();
app.use(express.json());
app.use(cors());

const port: number = Number(process.env.PORT) || 5000;

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("funfoso");
});

app.listen(port, () => {
  console.log(`Servidor na porta ${port}.`);
});

require("./configs/dotenv");
import client from "./configs/database";

client.connect((err: Error) => {
  // Connected to the database

  if (err) {
    console.log(err);
  } else {
    console.log("Registrando dados...");
  }
});

import user from "./routes/user";

app.use("/user", user);
