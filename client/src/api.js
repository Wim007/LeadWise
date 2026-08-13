/**
 * Dunne laag om fetch heen.
 *
 * Alles wat de server teruggeeft aan foutmeldingen is al in het Nederlands en
 * bedoeld om te tonen; die geven we dus ongewijzigd door aan de gebruiker.
 */

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`/api${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Geen verbinding met de server. Controleer je internet.');
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.error?.message ?? 'Er ging iets mis. Probeer het opnieuw.'
    );
  }

  return data;
}

const post = (path, body) =>
  request(path, { method: 'POST', body: JSON.stringify(body) });

export const api = {
  health: () => request('/health'),

  startScenario: (context, situation) =>
    post('/scenarios/start', { context, situation }),

  sendScenarioMessage: (id, message, requestDebrief = false) =>
    post(`/scenarios/${id}/message`, { message, requestDebrief }),

  reviewText: (context, text) => post('/text-review', { context, text }),

  reflect: (conversation, didWell, nextTime) =>
    post('/reflections', { conversation, didWell, nextTime }),

  progress: () => request('/progress'),

  deleteSession: (id) => request(`/sessions/${id}`, { method: 'DELETE' }),

  deleteAll: () => request('/data', { method: 'DELETE' }),
};
