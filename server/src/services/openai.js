/**
 * Koppeling met de OpenAI API.
 *
 * Wordt aangesproken via services/ai.js; de routes gebruiken dit bestand niet
 * rechtstreeks. Geeft de kale tekst van het model terug — het parsen van JSON
 * gebeurt op één plek, in ai.js.
 *
 * De berichtstructuur is bij beide aanbieders gelijk ({role, content}); alleen
 * de systeemprompt zit hier als eerste bericht in de lijst in plaats van als
 * apart veld.
 */
import OpenAI from 'openai';

import { AppError } from '../lib/errors.js';

const DEFAULT_MODEL = 'gpt-4o';

let client = null;

// Nieuwere modellen verwachten max_completion_tokens, oudere max_tokens.
// We onthouden per proces welke van de twee werkte, zodat we die fout maar
// één keer maken.
let tokenField = 'max_completion_tokens';

export function modelName() {
  return process.env.OPENAI_MODEL || DEFAULT_MODEL;
}

/** Draait bij het starten van de server, niet bij het eerste gesprek. */
export function assertConfigured() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      'OPENAI_API_KEY ontbreekt, terwijl AI_PROVIDER op "openai" staat. ' +
        'Zet de sleutel in .env (lokaal) of in de Railway-variabelen.'
    );
  }
}

function getClient() {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

function isTokenFieldError(err) {
  const message = err?.message ?? '';
  return err?.status === 400 && /max_(completion_)?tokens/i.test(message);
}

async function call({ system, messages, maxTokens, field }) {
  return getClient().chat.completions.create({
    model: modelName(),
    messages: [{ role: 'system', content: system }, ...messages],
    [field]: maxTokens,
  });
}

export async function complete({ system, messages, maxTokens }) {
  let response;

  try {
    try {
      response = await call({ system, messages, maxTokens, field: tokenField });
    } catch (err) {
      // Klaagt het model over het tokenveld, dan proberen we de andere naam en
      // houden we die vast voor de volgende aanroepen.
      if (!isTokenFieldError(err)) throw err;

      tokenField =
        tokenField === 'max_completion_tokens' ? 'max_tokens' : 'max_completion_tokens';
      console.warn(`[openai] overgeschakeld op ${tokenField}`);

      response = await call({ system, messages, maxTokens, field: tokenField });
    }
  } catch (err) {
    console.error('[openai] aanroep mislukt:', err.message);

    if (err.status === 401) {
      throw new AppError(
        'AI_AUTH',
        'De AI-sleutel wordt niet geaccepteerd. Controleer OPENAI_API_KEY.',
        502
      );
    }
    if (err.status === 429) {
      throw new AppError(
        'AI_RATE_LIMIT',
        'Even te druk bij de AI, of je tegoed is op. Probeer het zo opnieuw.',
        429
      );
    }
    if (err.status === 404 || /model/i.test(err.message ?? '')) {
      throw new AppError(
        'AI_MODEL',
        `Het model "${modelName()}" is niet beschikbaar voor deze sleutel. Pas OPENAI_MODEL aan.`,
        502
      );
    }
    throw new AppError(
      'AI_UNAVAILABLE',
      'De coach is nu niet bereikbaar. Probeer het zo opnieuw.',
      502
    );
  }

  return response.choices?.[0]?.message?.content ?? '';
}
