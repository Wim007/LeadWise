import { useState } from 'react';
import { Link } from 'react-router-dom';

import { api } from '../api.js';
import {
  CrisisNotice,
  ErrorBanner,
  Field,
  Loader,
  PrincipleTags,
  PrivacyNote,
  Segmented,
} from '../components/Ui.jsx';

const MAX = 6000;

export default function TextReview() {
  const [context, setContext] = useState('Zakelijk');
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [crisis, setCrisis] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [gekopieerd, setGekopieerd] = useState(false);

  async function beoordeel(event) {
    event.preventDefault();
    setError('');
    setResult(null);
    setBusy(true);

    try {
      const data = await api.reviewText(context, text.trim());
      if (data.crisis) {
        setCrisis(data);
        return;
      }
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function kopieer() {
    try {
      await navigator.clipboard.writeText(result.improved);
      setGekopieerd(true);
      setTimeout(() => setGekopieerd(false), 2000);
    } catch {
      setError('Kopiëren lukte niet. Selecteer de tekst en kopieer handmatig.');
    }
  }

  function opnieuw() {
    setResult(null);
    setText('');
    setError('');
    setGekopieerd(false);
  }

  if (crisis) {
    return (
      <main className="page stack-lg">
        <CrisisNotice notice={crisis} />
        <Link to="/" className="btn btn-secondary btn-block">
          Terug naar start
        </Link>
      </main>
    );
  }

  if (result) {
    return (
      <main className="page stack-lg">
        <div className="stack">
          <p className="eyebrow">{context}</p>
          <h1 className="title">Feedback op je tekst</h1>
        </div>

        <section className="card">
          <h2 className="card-title">Sterkste element</h2>
          <p className="prose">{result.strongest}</p>
        </section>

        <section className="card">
          <h2 className="card-title">Risico of gemiste kans</h2>
          <p className="prose">{result.risk}</p>
        </section>

        {result.principles?.length > 0 && (
          <section className="stack">
            <h2 className="section-title">Relevante principes</h2>
            <PrincipleTags principles={result.principles} />
          </section>
        )}

        <section className="card card-accent">
          <h2 className="card-title">Verbeterde versie</h2>
          <p className="prose">{result.improved}</p>
          <p style={{ marginTop: 'var(--space-4)' }}>
            <button type="button" className="btn btn-secondary" onClick={kopieer}>
              {gekopieerd ? 'Gekopieerd' : 'Kopieer tekst'}
            </button>
          </p>
        </section>

        {result.action && (
          <section className="card">
            <h2 className="card-title">Voor de volgende keer</h2>
            <p className="prose">{result.action}</p>
          </section>
        )}

        <ErrorBanner message={error} />

        <div className="btn-row">
          <button type="button" className="btn btn-secondary" onClick={opnieuw}>
            Nieuwe tekst
          </button>
          <Link to="/" className="btn">
            Klaar
          </Link>
        </div>

        <p className="hint" style={{ textAlign: 'center' }}>
          Alleen deze feedback is bewaard, niet je oorspronkelijke tekst.
        </p>
      </main>
    );
  }

  return (
    <main className="page stack-lg">
      <div className="stack">
        <h1 className="title">Tekst laten beoordelen</h1>
        <p className="subtitle">
          Plak een conceptmail, een appje of een samenvatting van een gesprek.
        </p>
      </div>

      <Field label="Context">
        <Segmented
          label="Kies een context"
          options={['Zakelijk', 'Privé']}
          value={context}
          onChange={setContext}
        />
      </Field>

      <div className="banner banner-warning">
        Plak geen patiëntgegevens, cliëntgegevens, medische gegevens of andere
        gevoelige persoonsgegevens.
      </div>

      <form className="stack" onSubmit={beoordeel}>
        <Field label="Jouw tekst" counter={`${text.length}/${MAX}`}>
          <textarea
            className="textarea textarea-tall"
            maxLength={MAX}
            value={text}
            placeholder="Plak hier je tekst."
            onChange={(e) => setText(e.target.value)}
          />
        </Field>

        <ErrorBanner message={error} />

        {busy ? (
          <Loader label="De coach leest je tekst…" />
        ) : (
          <button
            type="submit"
            className="btn btn-block"
            disabled={text.trim().length < 20}
          >
            Beoordeel mijn tekst
          </button>
        )}
      </form>

      <PrivacyNote />
    </main>
  );
}
