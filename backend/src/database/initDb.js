import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initDb = async () => {
    try {
        console.log("Reading schema.sql...");
        const sqlPath = path.join(__dirname, 'schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log("Initializing database tables...");
        await pool.query(sql);
        console.log("Database schema and predefined skills initialized successfully!");
    } catch (error) {
        console.error("Failed to initialize database:", error);
    } finally {
        await pool.end();
        console.log("Database connection closed.");
    }
};


initDb();
