import { readFileSync, existsSync } from 'fs';

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

export {};
