'use client';

import { useState } from 'react';
import { Textarea, Button } from '@/components/ui/StepForm';
import { RewriteCard } from '@/components/ui/RewriteCard';
import { SkeletonCard } from '@/components/ui/SkeletonState';
import { EmptyState } from '@/components/ui/EmptyState';
import type { HerschrijverResultaat } from '@/types';

const voorbeeldteksten = [
  'Je moet gewoon meer initiatief nemen. Iedereen ziet dat het niet loopt.',
  'Dit is echt de zoveelste keer dat ik dit moet zeggen. Wanneer verandert er nou iets?',
  'Je bent al zo lang in dienst, dan verwacht ik meer van je.',
];

export default function HerschrijverPage() {
  const [tekst, setTekst] = useState('');
  const [result, setResult] = useState<HerschrijverResultaat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tekst.trim().length < 10) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/herschrijver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origineel: tekst }),
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-ink-DEFAULT tracking-tight">Herschrijver</h1>
        <p className="text-sm text-ink-muted mt-1">
          Typ wat je wilt zeggen. De assistent herschrijft het in vier varianten.
        </p>
      </div>

      {/* Input */}
      <div className="bg-surface-raised rounded-lg border border-border p-4 md:p-5 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink-DEFAULT">
              Jouw originele boodschap
            </label>
            <Textarea
              value={tekst}
              onChange={(e) => setTekst(e.target.value)}
              placeholder="Typ hier wat je wilt zeggen tegen de medewerker..."
              rows={4}
              className="text-sm"
            />
          </div>

          {/* Voorbeeldteksten */}
          <div>
            <p className="text-xs text-ink-faint mb-2">Of probeer een voorbeeld:</p>
            <div className="flex flex-wrap gap-2">
              {voorbeeldteksten.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTekst(v)}
                  className="text-xs px-2.5 py-1.5 rounded-md bg-surface-subtle hover:bg-surface-overlay border border-border text-ink-muted hover:text-ink-DEFAULT transition-colors text-left max-w-full"
                >
                  {v.length > 50 ? v.substring(0, 50) + '...' : v}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-sm text-danger-DEFAULT bg-danger-light px-3 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            disabled={tekst.trim().length < 10}
            size="lg"
          >
            {loading ? 'Herschrijven...' : 'Herschrijf in 4 varianten'}
          </Button>
        </form>
      </div>

      {/* Results */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && !result && (
        <EmptyState
          title="Nog geen resultaat"
          description="Voer een managerboodschap in om vier verbeterde versies te zien."
        />
      )}

      {result && (
        <div className="space-y-4">
          {/* Original */}
          <div className="rounded-lg border border-border bg-surface-subtle p-3.5">
            <p className="text-[11px] font-semibold text-ink-faint uppercase tracking-wider mb-2">
              Origineel
            </p>
            <p className="text-sm text-ink-muted italic leading-relaxed">
              &ldquo;{result.origineel}&rdquo;
            </p>
          </div>

          {/* Varianten */}
          <div>
            <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-3">
              Vier varianten
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.varianten.map((v) => (
                <RewriteCard key={v.type} variant={v} />
              ))}
            </div>
          </div>

          {/* Tip */}
          <div className="rounded-lg border border-border bg-surface-raised p-4">
            <p className="text-xs text-ink-faint leading-relaxed">
              <span className="font-semibold text-ink-muted">Tip: </span>
              Kies de variant die past bij de situatie en je relatie met de medewerker. Gebruik de empathische versie als je vermoedt dat er meer achter zit.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
