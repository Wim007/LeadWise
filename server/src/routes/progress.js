import { Router } from 'express';

import { query } from '../db.js';
import { asyncRoute } from '../lib/validate.js';
import { developmentThemesPrompt } from '../prompts/carnegieCoach.js';
import { askCoach } from '../services/ai.js';

const router = Router();

const TYPE_LABELS = {
  scenario: 'Gesprek geoefend',
  text_review: 'Tekst beoordeeld',
  reflection: 'Dagreflectie',
};

/**
 * Themadetectie kost een AI-aanroep. De uitkomst verandert alleen als de
 * ontwikkelpunten veranderen, dus cachen we op de inhoud daarvan.
 */
let themeCache = { key: '', themes: [] };

async function deriveThemes(points) {
  if (points.length < 3) return [];

  const key = points.join('|');
  if (themeCache.key === key) return themeCache.themes;

  try {
    const prompt = developmentThemesPrompt(points);
    const result = await askCoach({
      system: prompt.system,
      user: prompt.user,
      maxTokens: 400,
    });

    const themes = Array.isArray(result.themes)
      ? result.themes.filter((t) => typeof t === 'string' && t.trim()).slice(0, 3)
      : [];

    themeCache = { key, themes };
    return themes;
  } catch (err) {
    // De Voortgangspagina mag nooit omvallen op een AI-storing: we tonen dan
    // gewoon de ruwe ontwikkelpunten die we al hadden.
    console.error('[progress] thema-analyse mislukt:', err.message);
    return [...new Set(points)].slice(0, 3);
  }
}

router.get(
  '/',
  asyncRoute(async (_req, res) => {
    const [weekResult, principleResult, actionResult, sessionResult, pointResult] =
      await Promise.all([
        query(
          `SELECT COUNT(*)::int AS count
             FROM sessions
            WHERE status = 'completed'
              AND created_at >= now() - INTERVAL '7 days'`
        ),
        query(
          `SELECT principe, COUNT(*)::int AS count
             FROM sessions, UNNEST(principles) AS principe
            WHERE status = 'completed'
            GROUP BY principe
            ORDER BY count DESC, principe ASC
            LIMIT 5`
        ),
        query(
          `SELECT action, created_at
             FROM sessions
            WHERE status = 'completed' AND action IS NOT NULL AND action <> ''
            ORDER BY created_at DESC
            LIMIT 1`
        ),
        query(
          `SELECT id, type, context_label, principles, action, created_at
             FROM sessions
            WHERE status = 'completed'
            ORDER BY created_at DESC
            LIMIT 30`
        ),
        query(
          `SELECT development_point
             FROM sessions
            WHERE status = 'completed'
              AND development_point IS NOT NULL
              AND development_point <> ''
            ORDER BY created_at DESC
            LIMIT 15`
        ),
      ]);

    const points = pointResult.rows.map((r) => r.development_point);
    const themes = await deriveThemes(points);

    res.json({
      weekCount: weekResult.rows[0].count,
      totalCount: sessionResult.rowCount,
      topPrinciples: principleResult.rows.map((r) => ({
        principle: r.principe,
        count: r.count,
      })),
      lastAction: actionResult.rows[0]?.action ?? null,
      lastActionAt: actionResult.rows[0]?.created_at ?? null,
      themes,
      sessions: sessionResult.rows.map((r) => ({
        id: r.id,
        type: r.type,
        typeLabel: TYPE_LABELS[r.type] ?? r.type,
        contextLabel: r.context_label,
        principles: r.principles,
        action: r.action,
        createdAt: r.created_at,
      })),
    });
  })
);

export default router;
