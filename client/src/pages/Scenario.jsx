import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { api } from '../api.js';
import {
  ChoiceList,
  CrisisNotice,
  ErrorBanner,
  Field,
  Loader,
  PrincipleTags,
  PrivacyNote,
} from '../components/Ui.jsx';

const CONTEXTEN = [
  'Stakeholder of samenwerkingspartner',
  'Collega of medewerker',
  'Klant of zorgpartner',
  'Conflict of lastig gesprek',
  'Privégesprek',
];

const LEEG = {
  stap: 'context',
  context: '',
  situation: '',
  sessionId: null,
  principles: [],
  messages: [],
  canDebrief: false,
  debrief: null,
};

export default function Scenario() {
  const [state, setState] = useState(LEEG);
  const [antwoord, setAntwoord] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [crisis, setCrisis] = useState(null);

  const chatEinde = useRef(null);

  useEffect(() => {
    if (state.stap === 'chat') {
      chatEinde.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [state.messages, state.stap, state.debrief]);

  function opnieuw() {
    setState(LEEG);
    setAntwoord('');
    setError('');
    setCrisis(null);
  }

  async function startScenario(event) {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      const data = await api.startScenario(state.context, state.situation.trim());

      if (data.crisis) {
        setCrisis(data);
        return;
      }

      setState((prev) => ({
        ...prev,
        stap: 'chat',
        sessionId: data.sessionId,
        principles: data.principles,
        messages: [{ role: 'coach', content: data.opening }],
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function stuurAntwoord(requestDebrief = false) {
    const bericht = antwoord.trim();
    if (!bericht || busy) return;

    setError('');
    setBusy(true);
    setAntwoord('');
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, { role: 'user', content: bericht }],
    }));

    try {
      const data = await api.sendScenarioMessage(
        state.sessionId,
        bericht,
        requestDebrief
      );

      if (data.crisis) {
        setCrisis(data);
        return;
      }

      if (data.done) {
        setState((prev) => ({ ...prev, stap: 'debrief', debrief: data.debrief }));
        return;
      }

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, { role: 'coach', content: data.reply }],
        canDebrief: data.canDebrief,
      }));
    } catch (err) {
      // Het verstuurde bericht blijft staan; alleen het antwoord ontbreekt.
      setError(err.message);
      setAntwoord(bericht);
      setState((prev) => ({ ...prev, messages: prev.messages.slice(0, -1) }));
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

  /* --- Stap 1: context kiezen ------------------------------------- */

  if (state.stap === 'context') {
    return (
      <main className="page stack-lg">
        <div className="stack">
          <h1 className="title">Gesprek oefenen</h1>
          <p className="subtitle">Wat voor gesprek wil je oefenen?</p>
        </div>

        <ChoiceList
          name="Kies een context"
          options={CONTEXTEN}
          value={state.context}
          onChange={(context) => setState((prev) => ({ ...prev, context }))}
        />

        <button
          type="button"
          className="btn btn-block"
          disabled={!state.context}
          onClick={() => setState((prev) => ({ ...prev, stap: 'situatie' }))}
        >
          Verder
        </button>

        <PrivacyNote />
      </main>
    );
  }

  /* --- Stap 2: situatie beschrijven -------------------------------- */

  if (state.stap === 'situatie') {
    return (
      <main className="page stack-lg">
        <div className="stack">
          <p className="eyebrow">{state.context}</p>
          <h1 className="title">Wat is de situatie?</h1>
        </div>

        <form className="stack" onSubmit={startScenario}>
          <Field
            label="Beschrijf het gesprek kort"
            hint="Eén of twee zinnen is genoeg. Wie zit tegenover je en waar gaat het over?"
            counter={`${state.situation.length}/1500`}
          >
            <textarea
              className="textarea"
              maxLength={1500}
              value={state.situation}
              autoFocus
              placeholder="Bijvoorbeeld: mijn samenwerkingspartner wil de planning opnieuw uitstellen en ik heb dit al twee keer geaccepteerd."
              onChange={(e) =>
                setState((prev) => ({ ...prev, situation: e.target.value }))
              }
            />
          </Field>

          <ErrorBanner message={error} />

          {busy ? (
            <Loader label="De coach zet het scenario klaar…" />
          ) : (
            <div className="btn-row">
              <button
                type="button"
                className="btn btn-quiet"
                onClick={() => setState((prev) => ({ ...prev, stap: 'context' }))}
              >
                Terug
              </button>
              <button
                type="submit"
                className="btn"
                disabled={state.situation.trim().length < 10}
              >
                Start het gesprek
              </button>
            </div>
          )}
        </form>

        <PrivacyNote />
      </main>
    );
  }

  /* --- Stap 3: het rollenspel -------------------------------------- */

  if (state.stap === 'chat') {
    return (
      <main className="page stack-lg">
        <div className="stack">
          <p className="eyebrow">{state.context}</p>
          <PrincipleTags principles={state.principles} />
        </div>

        <div className="chat">
          {state.messages.map((m, i) => (
            <div
              key={i}
              className={`bubble ${m.role === 'user' ? 'bubble-user' : 'bubble-coach'}`}
            >
              <p className="bubble-who">
                {m.role === 'user' ? 'Jij' : 'Gesprekspartner'}
              </p>
              {m.content}
            </div>
          ))}
          {busy && <Loader label="De ander denkt na…" />}
          <div ref={chatEinde} />
        </div>

        <ErrorBanner message={error} />

        <form
          className="stack"
          onSubmit={(e) => {
            e.preventDefault();
            stuurAntwoord(false);
          }}
        >
          <Field label="Jouw antwoord">
            <textarea
              className="textarea"
              maxLength={2000}
              value={antwoord}
              disabled={busy}
              placeholder="Typ wat je zou zeggen."
              onChange={(e) => setAntwoord(e.target.value)}
            />
          </Field>

          <button
            type="submit"
            className="btn btn-block"
            disabled={busy || antwoord.trim().length < 2}
          >
            Versturen
          </button>

          {state.canDebrief && (
            <button
              type="button"
              className="btn btn-secondary btn-block"
              disabled={busy || antwoord.trim().length < 2}
              onClick={() => stuurAntwoord(true)}
            >
              Versturen en debrief opvragen
            </button>
          )}

          <p className="hint" style={{ textAlign: 'center' }}>
            Je krijgt feedback na afloop, niet tussendoor.
          </p>
        </form>
      </main>
    );
  }

  /* --- Stap 4: debrief --------------------------------------------- */

  const { debrief } = state;

  return (
    <main className="page stack-lg">
      <div className="stack">
        <p className="eyebrow">Debrief · {state.context}</p>
        <h1 className="title">Zo ging het</h1>
      </div>

      <section className="card">
        <h2 className="card-title">Wat ging sterk</h2>
        <p className="prose">{debrief.strong}</p>
      </section>

      <section className="card">
        <h2 className="card-title">Waar je invloed verloor</h2>
        <p className="prose">{debrief.lost}</p>
      </section>

      {debrief.principles?.length > 0 && (
        <section className="stack">
          <h2 className="section-title">Relevante principes</h2>
          <PrincipleTags principles={debrief.principles} />
        </section>
      )}

      {debrief.betterSentence && (
        <section className="card card-accent">
          <h2 className="card-title">Zo had je het kunnen zeggen</h2>
          <p className="prose">“{debrief.betterSentence}”</p>
        </section>
      )}

      {debrief.action && (
        <section className="card">
          <h2 className="card-title">Voor het echte gesprek</h2>
          <p className="prose">{debrief.action}</p>
        </section>
      )}

      <div className="btn-row">
        <button type="button" className="btn btn-secondary" onClick={opnieuw}>
          Nieuw scenario
        </button>
        <Link to="/voortgang" className="btn">
          Opslaan en afronden
        </Link>
      </div>

      <p className="hint" style={{ textAlign: 'center' }}>
        Deze oefening is opgeslagen in je voortgang.
      </p>
    </main>
  );
}
