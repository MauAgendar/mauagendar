import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const pgHost: string = process.env.PG_HOST as string;
const pgPort: number = parseInt(process.env.PG_PORT as string);
const pgUser: string = process.env.PG_USER as string;
const pgPassword: string = process.env.PG_PASSWORD as string;
const pgDatabase: string = process.env.PG_DATABASE as string;

console.log(pgHost, pgPort, pgUser, pgPassword, pgDatabase);
const sequelize = new Sequelize({
    dialect: "postgres",
    host: pgHost,
    port: pgPort,
    username: pgUser,
    password: pgPassword,
    database: pgDatabase,
});

export default sequelize;
