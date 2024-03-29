import cors from "cors";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import user from "./routes/user";
import sequelize from "./configs/database";
require("./configs/dotenv");
const app = express(); // Initializing express
dotenv.config();
app.use(express.json());
app.use(cors());

const port: number = Number(process.env.AUTH_PORT);

app.get("/", (req: Request, res: Response) => {
    res.status(200).send("funfoso");
});

app.listen(port, () => {
    console.log(`Servidor na porta ${port}.`);
});

sequelize.sync({}).then(() => {
    console.log("Registrando dados...");
});

app.use("/user", user);
