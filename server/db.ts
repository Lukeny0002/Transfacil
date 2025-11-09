import { config } from 'dotenv';
config(); // Carrega as variáveis de ambiente do .env

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Use node-postgres Pool for local Postgres connections
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create a Drizzle client using the pg Pool. Passing the schema helps with
// type inference in some setups; Drizzle will still work if you use `drizzle(pool)`.
export const db = drizzle(pool, { schema });