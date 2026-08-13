/** Fout met een boodschap die we rechtstreeks aan de gebruiker mogen tonen. */
export class AppError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
  }
}

/** Express-foutafhandelaar: altijd hetzelfde JSON-formaat, altijd Nederlands. */
export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message },
    });
  }

  console.error('[server] onverwachte fout:', err);

  return res.status(500).json({
    error: {
      code: 'INTERNAL',
      message: 'Er ging iets mis aan onze kant. Probeer het opnieuw.',
    },
  });
}

export function notFoundHandler(_req, res) {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'Dit adres bestaat niet.' },
  });
}
