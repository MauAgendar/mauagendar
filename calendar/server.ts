import express, { Request, Response } from "express";
import router from "./routes/appointments";
const app = express();
app.use(express.json());

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running on port 5000.");
});

app.use(router);
