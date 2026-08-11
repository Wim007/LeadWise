import { AppError } from './errors.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Controleert een tekstveld en geeft de opgeschoonde waarde terug.
 * Foutmeldingen zijn geschreven om direct in de UI te tonen.
 */
export function requireText(value, label, { min = 1, max = 4000 } = {}) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new AppError('VALIDATION', `${label} is nog leeg.`, 400);
  }

  const clean = value.trim();

  if (clean.length < min) {
    throw new AppError(
      'VALIDATION',
      `${label} is wat kort — schrijf minstens ${min} tekens.`,
      400
    );
  }
  if (clean.length > max) {
    throw new AppError(
      'VALIDATION',
      `${label} is te lang (maximaal ${max} tekens).`,
      400
    );
  }

  return clean;
}

export function requireOneOf(value, allowed, label) {
  if (!allowed.includes(value)) {
    throw new AppError('VALIDATION', `Kies eerst een ${label}.`, 400);
  }
  return value;
}

export function requireUuid(value, label = 'sessie') {
  if (typeof value !== 'string' || !UUID_RE.test(value)) {
    throw new AppError('VALIDATION', `Deze ${label} bestaat niet.`, 400);
  }
  return value;
}

/** Beperkt een lijst principes tot maximaal drie nette strings. */
export function normalisePrinciples(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((p) => typeof p === 'string' && p.trim().length > 0)
    .map((p) => p.trim())
    .slice(0, 3);
}

/** Vangt fouten uit async routes af zonder overal try/catch. */
export function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}
