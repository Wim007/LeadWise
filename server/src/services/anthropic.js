import Anthropic from '@anthropic-ai/sdk';

import { AppError } from '../lib/errors.js';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error(
    'ANTHROPIC_API_KEY ontbreekt. Zet hem in .env (lokaal) of in de Railway-variabelen.'
  );
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';

/**
 * Haalt het JSON-object uit het antwoord van het model.
 * Het model is geïnstrueerd om kaal JSON te geven, maar we blijven tolerant
 * voor een codeblok of een inleidende zin.
 */
function parseJson(raw) {
  let text = raw.trim();

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) text = fenced[1].trim();

  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        /* valt door naar de fout hieronder */
      }
    }
  }

  throw new AppError(
    'AI_BAD_RESPONSE',
    'De coach gaf een onverwacht antwoord. Probeer het opnieuw.',
    502
  );
}

/**
 * Roept het model aan en geeft het geparste JSON-antwoord terug.
 *
 * @param {object} options
 * @param {string} options.system     Systeemprompt.
 * @param {Array}  [options.messages] Berichtgeschiedenis in Anthropic-formaat.
 * @param {string} [options.user]     Kortere weg voor één gebruikersbericht.
 * @param {number} [options.maxTokens]
 */
export async function askCoach({ system, messages, user, maxTokens = 1200 }) {
  const payload = messages ?? [{ role: 'user', content: user }];

  let response;
  try {
    response = await client.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: payload,
    });
  } catch (err) {
    console.error('[anthropic] aanroep mislukt:', err.message);

    if (err.status === 401) {
      throw new AppError(
        'AI_AUTH',
        'De AI-sleutel wordt niet geaccepteerd. Controleer ANTHROPIC_API_KEY.',
        502
      );
    }
    if (err.status === 429) {
      throw new AppError(
        'AI_RATE_LIMIT',
        'Even te druk bij de AI. Probeer het over een halve minuut opnieuw.',
        429
      );
    }
    throw new AppError(
      'AI_UNAVAILABLE',
      'De coach is nu niet bereikbaar. Probeer het zo opnieuw.',
      502
    );
  }

  const text = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n');

  return parseJson(text);
}
