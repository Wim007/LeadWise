import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { api } from '../api.js';
import { ConfirmDialog, ErrorBanner, Loader, PrivacyNote } from '../components/Ui.jsx';

function formatDatum(iso) {
  return new Date(iso).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Progress() {
  const [data, setData] = useState(null);
  const [laden, setLaden] = useState(true);
  const [error, setError] = useState('');
  const [teVerwijderen, setTeVerwijderen] = useState(null);
  const [allesWissen, setAllesWissen] = useState(false);
  const [busy, setBusy] = useState(false);

  const laad = useCallback(async () => {
    setLaden(true);
    setError('');
    try {
      setData(await api.progress());
    } catch (err) {
      setError(err.message);
    } finally {
      setLaden(false);
    }
  }, []);

  useEffect(() => {
    laad();
  }, [laad]);

  async function verwijderSessie() {
    setBusy(true);
    try {
      await api.deleteSession(teVerwijderen.id);
      setTeVerwijderen(null);
      await laad();
    } catch (err) {
      setError(err.message);
      setTeVerwijderen(null);
    } finally {
      setBusy(false);
    }
  }

  async function verwijderAlles() {
    setBusy(true);
    try {
      await api.deleteAll();
      setAllesWissen(false);
      await laad();
    } catch (err) {
      setError(err.message);
      setAllesWissen(false);
    } finally {
      setBusy(false);
    }
  }

  if (laden && !data) {
    return (
      <main className="page stack-lg">
        <h1 className="title">Voortgang</h1>
        <Loader label="Je voortgang wordt opgehaald…" />
      </main>
    );
  }

  if (error && !data) {
    return (
      <main className="page stack-lg">
        <h1 className="title">Voortgang</h1>
        <ErrorBanner message={error} onRetry={laad} />
      </main>
    );
  }

  const leeg = data.sessions.length === 0;

  return (
    <main className="page stack-lg">
      <div className="stack">
        <h1 className="title">Voortgang</h1>
        <p className="subtitle">Wat je oefent en wat er terugkomt.</p>
      </div>

      <ErrorBanner message={error} />

      {leeg ? (
        <>
          <p className="empty">
            Je hebt nog niets opgeslagen. Zodra je een gesprek oefent, een tekst
            laat beoordelen of reflecteert, verschijnt het hier.
          </p>
          <Link to="/" className="btn btn-block">
            Begin met oefenen
          </Link>
        </>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat">
              <span className="stat-value">{data.weekCount}</span>
              <span className="stat-label">oefeningen deze week</span>
            </div>
            <div className="stat">
              <span className="stat-value">{data.sessions.length}</span>
              <span className="stat-label">opgeslagen in totaal</span>
            </div>
          </div>

          {data.lastAction && (
            <section className="card card-accent">
              <p className="eyebrow">Laatste oefenactie</p>
              <p className="prose" style={{ marginTop: 'var(--space-2)' }}>
                {data.lastAction}
              </p>
            </section>
          )}

          {data.topPrinciples.length > 0 && (
            <section className="card">
              <h2 className="card-title">Meest geoefende principes</h2>
              <ul className="list">
                {data.topPrinciples.map((p) => (
                  <li className="list-row" key={p.principle}>
                    <span>{p.principle}</span>
                    <span className="list-row-meta">{p.count}×</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {data.themes.length > 0 && (
            <section className="card">
              <h2 className="card-title">Wat steeds terugkomt</h2>
              <ul className="list">
                {data.themes.map((thema) => (
                  <li className="list-row" key={thema}>
                    <span>{thema}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="stack">
            <h2 className="section-title">Opgeslagen sessies</h2>
            <ul className="list">
              {data.sessions.map((sessie) => (
                <li className="list-row" key={sessie.id}>
                  <div>
                    <p style={{ fontWeight: 600 }}>{sessie.typeLabel}</p>
                    <p className="list-row-meta">
                      {/* Bij een dagreflectie is het contextlabel gelijk aan
                          het type; dat hoeft er niet twee keer te staan. */}
                      {sessie.contextLabel !== sessie.typeLabel &&
                        `${sessie.contextLabel} · `}
                      {formatDatum(sessie.createdAt)}
                    </p>
                    {sessie.action && (
                      <p
                        className="hint"
                        style={{ marginTop: 'var(--space-2)' }}
                      >
                        {sessie.action}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => setTeVerwijderen(sessie)}
                  >
                    Verwijder
                    <span className="sr-only">
                      {' '}
                      {sessie.typeLabel} van {formatDatum(sessie.createdAt)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <hr className="divider" />

          <button
            type="button"
            className="btn btn-danger btn-block"
            onClick={() => setAllesWissen(true)}
          >
            Verwijder al mijn gegevens
          </button>
        </>
      )}

      <PrivacyNote />

      <ConfirmDialog
        open={Boolean(teVerwijderen)}
        title="Deze sessie verwijderen?"
        body="De feedback en oefenactie van deze sessie verdwijnen definitief. Dit kan niet ongedaan worden gemaakt."
        confirmLabel="Verwijder"
        busy={busy}
        onCancel={() => setTeVerwijderen(null)}
        onConfirm={verwijderSessie}
      />

      <ConfirmDialog
        open={allesWissen}
        title="Alles verwijderen?"
        body="Al je oefeningen, feedback en ontwikkelpunten worden definitief gewist. Dit kan niet ongedaan worden gemaakt."
        confirmLabel="Ja, verwijder alles"
        busy={busy}
        onCancel={() => setAllesWissen(false)}
        onConfirm={verwijderAlles}
      />
    </main>
  );
}
