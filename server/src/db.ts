import mysql from 'mysql';
import dotenv from "dotenv";
dotenv.config();

export const pool  = mysql.createPool({
    connectionLimit : parseInt(process.env.DB_POOL_SIZE),
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASSWORD,
    database        : process.env.DB_NAME,
});
