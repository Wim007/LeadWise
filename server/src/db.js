import pg from 'pg';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL ontbreekt. Zet hem in .env (lokaal) of in de Railway-variabelen.'
  );
}

// Of we TLS gebruiken hangt af van de verbinding, niet van NODE_ENV:
// Railway's interne verbinding (postgres.railway.internal) loopt over een
// privénetwerk zonder TLS, terwijl een publieke verbinding sslmode=require
// in de URL zet. Forceren op productie zou de interne verbinding breken.
// Zet DATABASE_SSL=true als je het toch wilt afdwingen.
const needsSsl =
  /[?&]sslmode=(require|verify-ca|verify-full)\b/.test(process.env.DATABASE_URL) ||
  process.env.DATABASE_SSL === 'true';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: needsSsl ? { rejectUnauthorized: false } : false,
  max: 5,
  idleTimeoutMillis: 30_000,
});

pool.on('error', (err) => {
  console.error('[db] onverwachte poolfout:', err.message);
});

export function query(text, params) {
  return pool.query(text, params);
}

export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
