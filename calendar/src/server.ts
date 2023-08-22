import express from "express";
import cors from "cors";
import router from "./routes/appointments";
import dotenv from "dotenv";
import { access } from "fs";
require("./configs/dotenv");
dotenv.config();
const app = express();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("connection", "keep-alive");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Content-Type", "application/json");
    next();
});

app.use(cors());
app.use(express.json());
const PORT = process.env.CALENDAR_PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

app.use(router);
