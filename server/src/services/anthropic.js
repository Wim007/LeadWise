/**
 * Koppeling met de Anthropic API.
 *
 * Wordt aangesproken via services/ai.js; de routes gebruiken dit bestand niet
 * rechtstreeks. Geeft de kale tekst van het model terug — het parsen van JSON
 * gebeurt op één plek, in ai.js.
 */
import Anthropic from '@anthropic-ai/sdk';

import { AppError } from '../lib/errors.js';

const DEFAULT_MODEL = 'claude-sonnet-5';

let client = null;

export function modelName() {
  return process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
}

/** Draait bij het starten van de server, niet bij het eerste gesprek. */
export function assertConfigured() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      'ANTHROPIC_API_KEY ontbreekt, terwijl AI_PROVIDER op "anthropic" staat. ' +
        'Zet de sleutel in .env (lokaal) of in de Railway-variabelen.'
    );
  }
}

function getClient() {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export async function complete({ system, messages, maxTokens }) {
  let response;

  try {
    response = await getClient().messages.create({
      model: modelName(),
      max_tokens: maxTokens,
      system,
      messages,
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
    if (err.status === 404 || /model/i.test(err.message ?? '')) {
      throw new AppError(
        'AI_MODEL',
        `Het model "${modelName()}" is niet beschikbaar voor deze sleutel. Pas ANTHROPIC_MODEL aan.`,
        502
      );
    }
    throw new AppError(
      'AI_UNAVAILABLE',
      'De coach is nu niet bereikbaar. Probeer het zo opnieuw.',
      502
    );
  }

  return response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n');
}
