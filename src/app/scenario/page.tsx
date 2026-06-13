'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ScenarioCard } from '@/components/ui/ScenarioCard';
import { AIResponseBlock, ListBlock } from '@/components/ui/AIResponseBlock';
import { SkeletonAdvice } from '@/components/ui/SkeletonState';
import { Button } from '@/components/ui/StepForm';
import type { ConversationScenario, ScenarioType } from '@/types';

const scenarios: Array<{ id: ScenarioType; titel: string; omschrijving: string }> = [
  { id: 'onderprestatie', titel: 'Onderprestatie', omschrijving: 'Medewerker haalt de verwachte resultaten niet.' },
  { id: 'defensief', titel: 'Defensieve medewerker', omschrijving: 'Medewerker reageert met ontkenning of afsluiting.' },
  { id: 'teamconflict', titel: 'Conflict in team', omschrijving: 'Er is spanning of openlijk conflict tussen teamleden.' },
  { id: 'weinig_eigenaarschap', titel: 'Weinig eigenaarschap', omschrijving: 'Medewerker wacht af en neemt geen initiatief.' },
  { id: 'weerstand_verandering', titel: 'Weerstand tegen verandering', omschrijving: 'Medewerker verzet zich tegen nieuwe aanpak.' },
  { id: 'gevoelige_correctie', titel: 'Gevoelige correctie', omschrijving: 'Je moet iets moeilijks persoonlijk bespreekbaar maken.' },
];

function ScenarioContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') as ScenarioType | null;

  const [selected, setSelected] = useState<ScenarioType | null>(typeParam);
  const [result, setResult] = useState<ConversationScenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadScenario = async (type: ScenarioType) => {
    setSelected(type);
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is iets misgegaan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeParam) loadScenario(typeParam);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-DEFAULT tracking-tight">Scenario cockpit</h1>
        <p className="text-sm text-ink-muted mt-1">
          Kies een situatie. De assistent geeft je direct een complete aanpak.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Scenario list */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-3">
            Kies een scenario
          </p>
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => loadScenario(s.id)}
              className={`w-full text-left rounded-lg border p-3.5 transition-all flex items-start gap-3 ${
                selected === s.id
                  ? 'border-accent-DEFAULT bg-accent-light shadow-card'
                  : 'border-border bg-surface-raised hover:border-accent-muted hover:shadow-card'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 transition-colors ${
                selected === s.id ? 'bg-accent-DEFAULT' : 'bg-border'
              }`} />
              <div>
                <p className={`text-sm font-medium ${selected === s.id ? 'text-accent-DEFAULT' : 'text-ink-DEFAULT'}`}>
                  {s.titel}
                </p>
                <p className="text-xs text-ink-muted mt-0.5">{s.omschrijving}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Result */}
        <div className="space-y-3">
          {loading && <SkeletonAdvice />}

          {error && (
            <div className="text-sm text-danger-DEFAULT bg-danger-light px-3 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          {!loading && !result && !error && (
            <div className="rounded-lg border border-dashed border-border p-8 flex items-center justify-center">
              <p className="text-sm text-ink-faint text-center">
                Selecteer een scenario<br />om de aanpak te zien.
              </p>
            </div>
          )}

          {result && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-ink-DEFAULT">{result.titel}</h2>
                <Button variant="ghost" size="sm" onClick={() => loadScenario(result.id)}>
                  Vernieuwen
                </Button>
              </div>

              <AIResponseBlock label="Openingszin" variant="success">
                <p className="italic leading-relaxed">{result.openingszin}</p>
              </AIResponseBlock>

              <AIResponseBlock label="5 vervolgvragen">
                <ol className="space-y-2">
                  {result.vervolgvragen.map((v, i) => (
                    <li key={i} className="flex gap-2.5 text-sm">
                      <span className="text-ink-faint font-medium w-4 flex-shrink-0">{i + 1}.</span>
                      <span className="leading-relaxed">{v}</span>
                    </li>
                  ))}
                </ol>
              </AIResponseBlock>

              <AIResponseBlock label="Vermijd deze zinnen" variant="warning">
                <ListBlock items={result.waarschuwingszinnen} variant="warning" />
              </AIResponseBlock>

              <AIResponseBlock label="Als er weerstand is">
                <ListBlock items={result.reactiesOpWeerstand} />
              </AIResponseBlock>

              <AIResponseBlock label="Afsluiting" variant="highlight">
                <p className="italic leading-relaxed">{result.afsluitingMet}</p>
              </AIResponseBlock>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ScenarioPage() {
  return (
    <Suspense>
      <ScenarioContent />
    </Suspense>
  );
}
