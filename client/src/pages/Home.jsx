import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { api } from '../api.js';
import { PrivacyNote } from '../components/Ui.jsx';

const ACTIES = [
  {
    to: '/oefenen',
    title: 'Gesprek oefenen',
    note: 'Speel een echt gesprek na en krijg daarna een debrief.',
  },
  {
    to: '/tekst',
    title: 'Tekst laten beoordelen',
    note: 'Plak een concept en krijg een bruikbare betere versie.',
  },
  {
    to: '/reflectie',
    title: 'Reflecteren op vandaag',
    note: 'Drie vragen, drie inzichten en één opdracht voor morgen.',
  },
];

export default function Home() {
  const [focus, setFocus] = useState(null);

  useEffect(() => {
    let active = true;

    // Mislukt dit, dan tonen we het blok "Jouw focus" gewoon niet.
    // Het startscherm mag nooit omvallen op een lege of trage database.
    api
      .progress()
      .then((data) => {
        if (active) setFocus(data.lastAction ?? null);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="page stack-lg">
      <div className="stack">
        <h1 className="title">Carnegie Coach</h1>
        <p className="subtitle">Oefen vandaag één beter gesprek.</p>
      </div>

      {focus && (
        <section className="card card-accent">
          <p className="eyebrow">Jouw focus</p>
          <p style={{ marginTop: 'var(--space-2)' }} className="prose">
            {focus}
          </p>
        </section>
      )}

      <nav className="stack" aria-label="Wat wil je doen?">
        {ACTIES.map((actie) => (
          <Link key={actie.to} to={actie.to} className="action-card">
            <span className="action-card-title">{actie.title}</span>
            <span className="action-card-note">{actie.note}</span>
          </Link>
        ))}
      </nav>

      <PrivacyNote />
    </main>
  );
}
