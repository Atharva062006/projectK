import pool from "../config/db.js";

async function migrate() {
    try {
        console.log("Applying Google Auth schema migration to Neon DB...");
        await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;");
        await pool.query("ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;");
        console.log("✓ Migration successful! Table updated.");
        process.exit(0);
    } catch (err) {
        console.error("Migration error:", err.message);
        process.exit(1);
    }
}

migrate();
