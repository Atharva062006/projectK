// # Import fs module for file system reading
import fs from 'fs';
// # Import path utilities
import path from 'path';
// # Import URL utilities to convert file paths
import { fileURLToPath } from 'url';
// # Import database connection pool
import pool from '../config/db.js';

// # Define __filename and __dirname for ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// # Function to read schema.sql and initialize the database schema
const initDb = async () => {
    try {
        console.log("Reading schema.sql...");
        const sqlPath = path.join(__dirname, 'schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log("Initializing database tables...");
        // # Execute the schema.sql query against the database
        await pool.query(sql);
        console.log("Database schema and predefined skills initialized successfully!");
    } catch (error) {
        console.error("Failed to initialize database:", error);
    } finally {
        // # Close connection pool to let process terminate gracefully
        await pool.end();
        console.log("Database connection closed.");
    }
};

// # Execute the initialization function
initDb();
