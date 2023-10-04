import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
});
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    process.env.DATABASE_URL || "postgres://postgres:postgres@db:5432",
    { dialect: "postgres" }
);
console.log("Migrating db");

const query = `
SET DATESTYLE TO DMY;
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$ language 'plpgsql';
CREATE TRIGGER appointments_update_updated_at BEFORE
UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    phonenumber VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;
sequelize.query(query);

console.log("Migrated db");
sequelize
    .sync({ force: true })
    .then(() => {
        console.log("Migrations done");
    })
    .catch((err: any) => {
        console.error("Error running migrations:", err);
    });
export default client;
