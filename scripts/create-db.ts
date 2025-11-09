import { readFileSync, existsSync } from 'fs';
import { Client } from 'pg';
import { URL } from 'url';

// Simple .env loader (no dependency on dotenv) so this script works out of the box.
const envPath = `${process.cwd()}\\.env`;
if (existsSync(envPath)) {
  const raw = readFileSync(envPath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [k, ...rest] = trimmed.split('=');
    const v = rest.join('=').replace(/^\"|\"$/g, '');
    process.env[k] = v;
  }
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL must be set in .env');
}

// Parse the DATABASE_URL and connect to the default "postgres" database
// so we can create the target database if it doesn't exist.
const parsed = new URL(dbUrl);
const targetDb = parsed.pathname ? parsed.pathname.replace(/^\//, '') : 'transfacil';
// Use the postgres database for administrative commands
parsed.pathname = '/postgres';
const adminUrl = parsed.toString();

const client = new Client({ connectionString: adminUrl });

async function main() {
  await client.connect();
  const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [targetDb]);
  if (res.rowCount === 0) {
    await client.query(`CREATE DATABASE "${targetDb}"`);
    console.log(`Created database: ${targetDb}`);
  } else {
    console.log(`Database already exists: ${targetDb}`);
  }
  await client.end();
}

main().catch((err) => {
  console.error('Error creating database:', err);
  process.exit(1);
});
