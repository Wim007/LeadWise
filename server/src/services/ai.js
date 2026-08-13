/**
 * De enige plek die de AI aanroept.
 *
 * Welke aanbieder gebruikt wordt, bepaalt `AI_PROVIDER` (anthropic of openai).
 * De routes weten daar niets van: zij roepen `askCoach` aan en krijgen een
 * geparst JSON-object terug. Zo blijft het wisselen van aanbieder een
 * instelling, geen verbouwing.
 */
import { AppError } from '../lib/errors.js';
import * as anthropic from './anthropic.js';
import * as openai from './openai.js';

const PROVIDERS = { anthropic, openai };

const name = (process.env.AI_PROVIDER || 'anthropic').trim().toLowerCase();
const provider = PROVIDERS[name];

if (!provider) {
  throw new Error(
    `AI_PROVIDER is "${name}", maar dat kennen we niet. Kies "anthropic" of "openai".`
  );
}

// Alleen de gekozen aanbieder hoeft ingesteld te zijn. Ontbreekt de sleutel,
// dan stopt de server meteen met een duidelijke melding in plaats van pas bij
// het eerste gesprek.
provider.assertConfigured();

console.log(`[ai] Aanbieder: ${name} (model: ${provider.modelName()})`);

/**
 * Haalt het JSON-object uit het antwoord van het model.
 * De prompts vragen om kaal JSON, maar we blijven tolerant voor een codeblok
 * of een inleidende zin — beide aanbieders doen dat af en toe.
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
 * @param {Array}  [options.messages] Berichtgeschiedenis: {role, content}.
 * @param {string} [options.user]     Kortere weg voor één gebruikersbericht.
 * @param {number} [options.maxTokens]
 */
export async function askCoach({ system, messages, user, maxTokens = 1200 }) {
  const payload = messages ?? [{ role: 'user', content: user }];
  const text = await provider.complete({ system, messages: payload, maxTokens });
  return parseJson(text);
}

export const activeProvider = name;
