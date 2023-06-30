import express from "express";
import router from "./routes/appointments";
import dotenv from "dotenv";
dotenv.config();
const app = express();

// Enable CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});

app.use(express.json());
const PORT = process.env.CALENDAR_PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

app.use(router);
