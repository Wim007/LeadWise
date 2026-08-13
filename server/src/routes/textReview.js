import { Router } from 'express';

import { query } from '../db.js';
import { AppError } from '../lib/errors.js';
import { CRISIS_ANTWOORD, detectCrisis } from '../lib/safety.js';
import {
  asyncRoute,
  normalisePrinciples,
  requireOneOf,
  requireText,
} from '../lib/validate.js';
import { textReviewPrompt } from '../prompts/carnegieCoach.js';
import { askCoach } from '../services/ai.js';

const router = Router();

const CONTEXTEN = ['Zakelijk', 'Privé'];

router.post(
  '/',
  asyncRoute(async (req, res) => {
    const context = requireOneOf(req.body?.context, CONTEXTEN, 'context');
    const text = requireText(req.body?.text, 'De tekst', { min: 20, max: 6000 });

    if (detectCrisis(text)) {
      return res.status(200).json(CRISIS_ANTWOORD);
    }

    const prompt = textReviewPrompt({ context, text });
    const result = await askCoach({
      system: prompt.system,
      user: prompt.user,
      maxTokens: 1600,
    });

    if (result.crisis) {
      return res.status(200).json(CRISIS_ANTWOORD);
    }

    if (!result.improved) {
      throw new AppError(
        'AI_BAD_RESPONSE',
        'De coach kon geen verbeterde versie maken. Probeer het opnieuw.',
        502
      );
    }

    const principles = normalisePrinciples(result.principles);

    // We bewaren de feedback en de actie, niet de geplakte tekst zelf.
    const feedback = [
      result.strongest && `Sterkste element: ${result.strongest}`,
      result.risk && `Risico of gemiste kans: ${result.risk}`,
    ]
      .filter(Boolean)
      .join('\n\n');

    const { rows } = await query(
      `INSERT INTO sessions (type, context_label, principles, feedback, action, development_point, status)
       VALUES ('text_review', $1, $2, $3, $4, $5, 'completed')
       RETURNING id`,
      [
        context,
        principles,
        feedback,
        result.action ?? null,
        result.developmentPoint ?? null,
      ]
    );

    res.status(201).json({
      crisis: false,
      sessionId: rows[0].id,
      strongest: result.strongest ?? '',
      risk: result.risk ?? '',
      principles,
      improved: result.improved,
      action: result.action ?? '',
    });
  })
);

export default router;
