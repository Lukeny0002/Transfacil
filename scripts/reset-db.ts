import { readFileSync, existsSync } from 'fs';
import { Client } from 'pg';

// Load .env manually (same logic as other scripts)
const envPath = `${process.cwd()}\\.env`;
if (existsSync(envPath)) {
  const raw = readFileSync(envPath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [k, ...rest] = trimmed.split('=');
    const v = rest.join('=').replace(/^"|"$/g, '');
    process.env[k] = v;
  }
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL must be set in .env');
}

// Parse and switch to the postgres administrative DB
const url = new URL(dbUrl);
const targetDb = url.pathname ? url.pathname.replace(/^\//, '') : 'transfacil';
url.pathname = '/postgres';
const adminUrl = url.toString();

const client = new Client({ connectionString: adminUrl });

async function main() {
  await client.connect();
  // Terminate connections to the target DB (required on Windows sometimes)
  try {
    await client.query(`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()`, [targetDb]);
  } catch (e) {
    // ignore
  }
  await client.query(`DROP DATABASE IF EXISTS "${targetDb}"`);
  console.log(`Dropped database (if existed): ${targetDb}`);
  await client.query(`CREATE DATABASE "${targetDb}"`);
  console.log(`Created database: ${targetDb}`);
  await client.end();
}

main().catch((err) => {
  console.error('Error resetting database:', err);
  process.exit(1);
});
