import { Router } from 'express';

import { query } from '../db.js';
import { AppError } from '../lib/errors.js';
import { CRISIS_ANTWOORD, detectCrisis } from '../lib/safety.js';
import { asyncRoute, normalisePrinciples, requireText } from '../lib/validate.js';
import { reflectionPrompt } from '../prompts/carnegieCoach.js';
import { askCoach } from '../services/anthropic.js';

const router = Router();

router.post(
  '/',
  asyncRoute(async (req, res) => {
    const conversation = requireText(
      req.body?.conversation,
      'Het gesprek dat bleef hangen',
      { min: 5, max: 2000 }
    );
    const didWell = requireText(req.body?.didWell, 'Wat je goed deed', {
      min: 3,
      max: 2000,
    });
    const nextTime = requireText(req.body?.nextTime, 'Wat je anders zou doen', {
      min: 3,
      max: 2000,
    });

    if (detectCrisis(conversation, didWell, nextTime)) {
      return res.status(200).json(CRISIS_ANTWOORD);
    }

    const prompt = reflectionPrompt({ conversation, didWell, nextTime });
    const result = await askCoach({
      system: prompt.system,
      user: prompt.user,
      maxTokens: 1200,
    });

    if (result.crisis) {
      return res.status(200).json(CRISIS_ANTWOORD);
    }

    const points = Array.isArray(result.points)
      ? result.points.filter((p) => typeof p === 'string' && p.trim()).slice(0, 3)
      : [];

    if (points.length === 0 || !result.action) {
      throw new AppError(
        'AI_BAD_RESPONSE',
        'De coach kon je reflectie niet afronden. Probeer het opnieuw.',
        502
      );
    }

    const principles = normalisePrinciples(result.principles);

    const { rows } = await query(
      `INSERT INTO sessions (type, context_label, principles, feedback, action, development_point, status)
       VALUES ('reflection', 'Dagreflectie', $1, $2, $3, $4, 'completed')
       RETURNING id`,
      [
        principles,
        points.join('\n\n'),
        result.action,
        result.developmentPoint ?? null,
      ]
    );

    res.status(201).json({
      crisis: false,
      sessionId: rows[0].id,
      points,
      principles,
      betterSentence: result.betterSentence ?? '',
      action: result.action,
    });
  })
);

export default router;
