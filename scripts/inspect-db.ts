import { readFileSync, existsSync } from 'fs';
import { Client } from 'pg';

// Load .env manually
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

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
  await client.connect();
  const res = await client.query(`SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`);
  console.log('Public tables:');
  for (const row of res.rows) console.log('-', row.tablename);
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
