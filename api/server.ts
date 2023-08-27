const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger.json");
import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();

const PORT: any = process.env.API_PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerFile));
