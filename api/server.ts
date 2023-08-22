const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger.json");
import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
app.listen(process.env.API_PORT, () =>
    console.log("SwaggerUI running on port: " + process.env.API_PORT)
);
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerFile));
