import './env.js';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { pool } from './db.js';

const here = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const sql = await readFile(join(here, 'schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('[migrate] Schema bijgewerkt.');
}

migrate()
  .then(() => pool.end())
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[migrate] Mislukt:', err.message);
    process.exit(1);
  });
