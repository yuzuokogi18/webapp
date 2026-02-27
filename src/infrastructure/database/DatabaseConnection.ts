import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool: mysql.Pool;

export function getDatabase() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "webso",
      port: Number(process.env.DB_PORT) || 3306,
      connectionLimit: 10,
    });

    console.log("✅ MySQL Connected");
  }

  return pool;
}