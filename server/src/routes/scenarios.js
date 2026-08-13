import { Router } from 'express';

import { query } from '../db.js';
import { AppError } from '../lib/errors.js';
import { CRISIS_ANTWOORD, detectCrisis } from '../lib/safety.js';
import {
  asyncRoute,
  normalisePrinciples,
  requireOneOf,
  requireText,
  requireUuid,
} from '../lib/validate.js';
import {
  CONTEXTEN,
  scenarioDebriefPrompt,
  scenarioStartPrompt,
  scenarioTurnPrompt,
} from '../prompts/carnegieCoach.js';
import { askCoach } from '../services/anthropic.js';

const router = Router();

/** Vanaf hoeveel antwoorden van Wim de debrief mag / moet volgen. */
const DEBRIEF_BESCHIKBAAR_VANAF = 2;
const DEBRIEF_VERPLICHT_VANAF = 3;

async function loadSession(id) {
  const { rows } = await query(
    `SELECT id, type, context_label, situation, principles, partner_role, status
       FROM sessions
      WHERE id = $1 AND type = 'scenario'`,
    [id]
  );

  if (rows.length === 0) {
    throw new AppError('NOT_FOUND', 'Dit scenario bestaat niet meer.', 404);
  }
  return rows[0];
}

async function loadMessages(sessionId) {
  const { rows } = await query(
    `SELECT role, content, turn_index
       FROM messages
      WHERE session_id = $1
      ORDER BY turn_index ASC`,
    [sessionId]
  );
  return rows;
}

/** Zet onze berichten om naar het formaat van de Anthropic API. */
function toApiMessages(messages) {
  return messages.map((m) => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: m.content,
  }));
}

/* ------------------------------------------------------------------ */
/* POST /api/scenarios/start                                           */
/* ------------------------------------------------------------------ */

router.post(
  '/start',
  asyncRoute(async (req, res) => {
    const context = requireOneOf(req.body?.context, CONTEXTEN, 'context');
    const situation = requireText(req.body?.situation, 'De situatie', {
      min: 10,
      max: 1500,
    });

    if (detectCrisis(situation)) {
      return res.status(200).json(CRISIS_ANTWOORD);
    }

    const prompt = scenarioStartPrompt({ context, situation });
    const result = await askCoach({
      system: prompt.system,
      user: prompt.user,
      maxTokens: 700,
    });

    if (result.crisis) {
      return res.status(200).json(CRISIS_ANTWOORD);
    }

    const principles = normalisePrinciples(result.principles);
    const opening = typeof result.opening === 'string' ? result.opening.trim() : '';

    if (!opening) {
      throw new AppError(
        'AI_BAD_RESPONSE',
        'De coach kon het scenario niet openen. Probeer het opnieuw.',
        502
      );
    }

    const { rows } = await query(
      `INSERT INTO sessions (type, context_label, situation, principles, partner_role, status)
       VALUES ('scenario', $1, $2, $3, $4, 'active')
       RETURNING id`,
      [context, situation, principles, result.partnerRole ?? null]
    );
    const sessionId = rows[0].id;

    await query(
      `INSERT INTO messages (session_id, role, content, turn_index)
       VALUES ($1, 'coach', $2, 0)`,
      [sessionId, opening]
    );

    res.status(201).json({
      crisis: false,
      sessionId,
      principles,
      partnerRole: result.partnerRole ?? null,
      opening,
    });
  })
);

/* ------------------------------------------------------------------ */
/* POST /api/scenarios/:id/message                                     */
/* ------------------------------------------------------------------ */

router.post(
  '/:id/message',
  asyncRoute(async (req, res) => {
    const id = requireUuid(req.params.id, 'scenario');
    const message = requireText(req.body?.message, 'Je antwoord', {
      min: 2,
      max: 2000,
    });
    const wantsDebrief = req.body?.requestDebrief === true;

    const session = await loadSession(id);
    if (session.status === 'completed') {
      throw new AppError(
        'SESSION_CLOSED',
        'Dit scenario is al afgerond. Start een nieuw scenario.',
        409
      );
    }

    if (detectCrisis(message)) {
      return res.status(200).json(CRISIS_ANTWOORD);
    }

    const history = await loadMessages(id);
    const turnIndex = history.length;

    await query(
      `INSERT INTO messages (session_id, role, content, turn_index)
       VALUES ($1, 'user', $2, $3)`,
      [id, message, turnIndex]
    );

    const conversation = [...history, { role: 'user', content: message }];
    const userTurns = conversation.filter((m) => m.role === 'user').length;
    const mustDebrief = wantsDebrief || userTurns >= DEBRIEF_VERPLICHT_VANAF;

    /* --- Debrief: coach stapt uit zijn rol --- */
    if (mustDebrief) {
      const prompt = scenarioDebriefPrompt({
        context: session.context_label,
        situation: session.situation,
        principles: session.principles,
      });

      const debrief = await askCoach({
        system: prompt.system,
        messages: [
          ...toApiMessages(conversation),
          {
            role: 'user',
            content:
              'Het rollenspel stopt hier. Geef nu de debrief volgens je instructies.',
          },
        ],
        maxTokens: 1400,
      });

      if (debrief.crisis) {
        return res.status(200).json(CRISIS_ANTWOORD);
      }

      const principles = normalisePrinciples(debrief.principles);
      const feedback = [
        debrief.strong && `Sterk: ${debrief.strong}`,
        debrief.lost && `Aandachtspunt: ${debrief.lost}`,
        debrief.betterSentence && `Betere zin: "${debrief.betterSentence}"`,
      ]
        .filter(Boolean)
        .join('\n\n');

      await query(
        `UPDATE sessions
            SET status = 'completed',
                principles = $2,
                feedback = $3,
                action = $4,
                development_point = $5
          WHERE id = $1`,
        [
          id,
          principles.length > 0 ? principles : session.principles,
          feedback,
          debrief.action ?? null,
          debrief.developmentPoint ?? null,
        ]
      );

      return res.json({
        crisis: false,
        done: true,
        debrief: {
          strong: debrief.strong ?? '',
          lost: debrief.lost ?? '',
          principles: principles.length > 0 ? principles : session.principles,
          betterSentence: debrief.betterSentence ?? '',
          action: debrief.action ?? '',
        },
      });
    }

    /* --- Gewone beurt: coach blijft in rol --- */
    const prompt = scenarioTurnPrompt({
      context: session.context_label,
      situation: session.situation,
      principles: session.principles,
      partnerRole: session.partner_role,
    });

    const result = await askCoach({
      system: prompt.system,
      messages: toApiMessages(conversation),
      maxTokens: 500,
    });

    if (result.crisis) {
      return res.status(200).json(CRISIS_ANTWOORD);
    }

    const reply = typeof result.reply === 'string' ? result.reply.trim() : '';
    if (!reply) {
      throw new AppError(
        'AI_BAD_RESPONSE',
        'De gesprekspartner gaf geen antwoord. Probeer het opnieuw.',
        502
      );
    }

    await query(
      `INSERT INTO messages (session_id, role, content, turn_index)
       VALUES ($1, 'coach', $2, $3)`,
      [id, reply, turnIndex + 1]
    );

    res.json({
      crisis: false,
      done: false,
      reply,
      canDebrief: userTurns >= DEBRIEF_BESCHIKBAAR_VANAF,
    });
  })
);

export default router;
