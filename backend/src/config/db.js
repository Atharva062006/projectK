// Add your postgreSQL credentials in the .env file and then use them here to connect to the database

import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

// Support both DATABASE_URL (for Neon/production) and individual env vars (for local dev)
const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    })
    : new Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DBNAME,
        port: process.env.DB_PORT || process.env.DB_DBPORT || 5432
    });

pool.on("connect", () => {
    console.log("Connection pool established with database");
});

export default pool;