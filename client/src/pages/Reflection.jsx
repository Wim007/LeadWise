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
} from '../components/Ui.jsx';

const VRAGEN = [
  { key: 'conversation', label: 'Welk gesprek bleef bij je hangen?' },
  { key: 'didWell', label: 'Wat deed jij goed?' },
  { key: 'nextTime', label: 'Wat zou je volgende keer anders doen?' },
];

export default function Reflection() {
  const [antwoorden, setAntwoorden] = useState({
    conversation: '',
    didWell: '',
    nextTime: '',
  });
  const [result, setResult] = useState(null);
  const [crisis, setCrisis] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const compleet =
    antwoorden.conversation.trim().length >= 5 &&
    antwoorden.didWell.trim().length >= 3 &&
    antwoorden.nextTime.trim().length >= 3;

  async function verstuur(event) {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      const data = await api.reflect(
        antwoorden.conversation.trim(),
        antwoorden.didWell.trim(),
        antwoorden.nextTime.trim()
      );

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
          <p className="eyebrow">Dagreflectie</p>
          <h1 className="title">Wat opvalt aan je dag</h1>
        </div>

        <div className="stack">
          {result.points.map((point, i) => (
            <section className="card" key={i}>
              <p className="prose">{point}</p>
            </section>
          ))}
        </div>

        {result.principles?.length > 0 && (
          <section className="stack">
            <h2 className="section-title">Relevante principes</h2>
            <PrincipleTags principles={result.principles} />
          </section>
        )}

        {result.betterSentence && (
          <section className="card">
            <h2 className="card-title">Een zin die je kunt gebruiken</h2>
            <p className="prose">“{result.betterSentence}”</p>
          </section>
        )}

        <section className="card card-accent">
          <h2 className="card-title">Je opdracht voor morgen</h2>
          <p className="prose">{result.action}</p>
        </section>

        <div className="btn-row">
          <Link to="/voortgang" className="btn btn-secondary">
            Naar voortgang
          </Link>
          <Link to="/" className="btn">
            Klaar
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page stack-lg">
      <div className="stack">
        <h1 className="title">Reflecteren op vandaag</h1>
        <p className="subtitle">Drie vragen. Kort antwoorden is genoeg.</p>
      </div>

      <form className="stack-lg" onSubmit={verstuur}>
        <div className="stack">
          {VRAGEN.map((vraag) => (
            <Field label={vraag.label} key={vraag.key}>
              <textarea
                className="textarea"
                maxLength={2000}
                value={antwoorden[vraag.key]}
                onChange={(e) =>
                  setAntwoorden((prev) => ({
                    ...prev,
                    [vraag.key]: e.target.value,
                  }))
                }
              />
            </Field>
          ))}
        </div>

        <ErrorBanner message={error} />

        {busy ? (
          <Loader label="De coach leest je reflectie…" />
        ) : (
          <button type="submit" className="btn btn-block" disabled={!compleet}>
            Rond mijn reflectie af
          </button>
        )}
      </form>

      <PrivacyNote />
    </main>
  );
}
