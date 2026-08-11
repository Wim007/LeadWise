import './env.js';

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';

import { pool } from './db.js';
import { errorHandler, notFoundHandler } from './lib/errors.js';
import { CONTEXTEN } from './prompts/carnegieCoach.js';
import dataRoutes from './routes/data.js';
import progressRoutes from './routes/progress.js';
import reflectionRoutes from './routes/reflections.js';
import scenarioRoutes from './routes/scenarios.js';
import textReviewRoutes from './routes/textReview.js';

const here = dirname(fileURLToPath(import.meta.url));
const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '128kb' }));

/* --- API ---------------------------------------------------------- */

app.get('/api/health', async (_req, res) => {
  let database = 'ok';
  try {
    await pool.query('SELECT 1');
  } catch {
    database = 'unreachable';
  }

  res.status(database === 'ok' ? 200 : 503).json({
    status: database === 'ok' ? 'ok' : 'degraded',
    database,
    contexts: CONTEXTEN,
    time: new Date().toISOString(),
  });
});

app.use('/api/scenarios', scenarioRoutes);
app.use('/api/text-review', textReviewRoutes);
app.use('/api/reflections', reflectionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api', dataRoutes);

app.use('/api', notFoundHandler);

/* --- Client ------------------------------------------------------- */
// In productie serveert dezelfde server de gebouwde React-app.

const clientDist = join(here, '..', '..', 'client', 'dist');

if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => res.sendFile(join(clientDist, 'index.html')));
}

app.use(errorHandler);

const port = Number(process.env.PORT) || 3001;

app.listen(port, () => {
  console.log(`[server] Carnegie Coach luistert op poort ${port}`);
});
