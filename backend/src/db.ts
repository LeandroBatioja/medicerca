import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT DEFAULT 'patient',
        created_at TIMESTAMPTZ DEFAULT now()
      );

      ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'patient';

      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        doctor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        type TEXT NOT NULL,
        slot_id TEXT NOT NULL,
        doctor TEXT NOT NULL,
        clinic TEXT NOT NULL,
        date TEXT,
        time TEXT,
        confirmed_at TIMESTAMPTZ DEFAULT now()
      );

      ALTER TABLE appointments ADD COLUMN IF NOT EXISTS doctor_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
      ALTER TABLE appointments ADD COLUMN IF NOT EXISTS date TEXT;
      ALTER TABLE appointments ADD COLUMN IF NOT EXISTS time TEXT;

      CREATE TABLE IF NOT EXISTS prescriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        doctor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        medication TEXT NOT NULL,
        frequency TEXT NOT NULL,
        refills INTEGER DEFAULT 0,
        date TEXT NOT NULL
      );

      ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS doctor_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

      CREATE TABLE IF NOT EXISTS home_services (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        service_type TEXT NOT NULL,
        address TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    console.log("Database tables created/verified");
  } finally {
    client.release();
  }
}

export default pool;
