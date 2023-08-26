import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
    url: process.env.DATABASE_URL,
});

export default client;
