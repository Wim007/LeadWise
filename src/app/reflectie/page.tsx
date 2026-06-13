'use client';

import { useState } from 'react';
import { FormField, Textarea, Button } from '@/components/ui/StepForm';
import { AIResponseBlock } from '@/components/ui/AIResponseBlock';
import { SkeletonAdvice } from '@/components/ui/SkeletonState';
import { EmptyState } from '@/components/ui/EmptyState';
import type { ReflectieInput, ReflectionReview } from '@/types';

const defaultForm: ReflectieInput = {
  watGebeurd: '',
  watWerkte: '',
  waarVastgelopen: '',
  vervolgactie: '',
};

export default function ReflectiePage() {
  const [form, setForm] = useState<ReflectieInput>(defaultForm);
  const [result, setResult] = useState<ReflectionReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/reflectie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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

  const update = (field: keyof ReflectieInput) => (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleCopyFollowup = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.followupBericht);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-DEFAULT tracking-tight">Reflectie na gesprek</h1>
        <p className="text-sm text-ink-muted mt-1">
          Beschrijf hoe het gesprek ging. De assistent geeft je een concrete analyse en opvolgbericht.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-surface-raised rounded-lg border border-border p-4 md:p-5">

          <FormField label="Wat is er gebeurd?" required hint="Beschrijf kort het verloop van het gesprek.">
            <Textarea
              value={form.watGebeurd}
              onChange={update('watGebeurd')}
              placeholder="Bijv. Ik had een gesprek met Lisa over haar functioneren. Ze reageerde aanvankelijk defensief maar werd later rustiger..."
              rows={4}
            />
          </FormField>

          <FormField label="Wat werkte goed?" hint="Welke momenten liepen goed of voelden goed?">
            <Textarea
              value={form.watWerkte}
              onChange={update('watWerkte')}
              placeholder="Bijv. De opening werkte goed. Ze voelde dat ik er serieus over nagedacht had."
              rows={3}
            />
          </FormField>

          <FormField label="Waar liep het vast?" hint="Op welke momenten verloor het gesprek zijn richting?">
            <Textarea
              value={form.waarVastgelopen}
              onChange={update('waarVastgelopen')}
              placeholder="Bijv. Toen ik concrete eisen stelde werd ze stil en sloot ze zich af."
              rows={3}
            />
          </FormField>

          <FormField label="Vervolgactie" hint="Wat is er afgesproken of wat wil jij als volgende stap zetten?">
            <Textarea
              value={form.vervolgactie}
              onChange={update('vervolgactie')}
              placeholder="Bijv. Over twee weken een kort check-in. Lisa stuurt mij een update over haar planning."
              rows={2}
            />
          </FormField>

          {error && (
            <div className="text-sm text-danger-DEFAULT bg-danger-light px-3 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            disabled={form.watGebeurd.trim().length < 10}
            className="w-full"
            size="lg"
          >
            {loading ? 'Analyseren...' : 'Analyseer gesprek'}
          </Button>
        </form>

        {/* Output */}
        <div className="space-y-3">
          {loading && <SkeletonAdvice />}

          {!loading && !result && (
            <div className="hidden lg:block">
              <EmptyState
                title="Vul het reflectieformulier in"
                description="Na het invullen verschijnt hier een analyse, sterke punten en een kant-en-klaar opvolgbericht."
              />
            </div>
          )}

          {result && (
            <>
              <h2 className="text-sm font-semibold text-ink-DEFAULT">Reflectie-analyse</h2>

              <AIResponseBlock label="Analyse">
                {result.analyse}
              </AIResponseBlock>

              <AIResponseBlock label="Wat je goed deed" variant="success">
                {result.watGoedGedaan}
              </AIResponseBlock>

              <AIResponseBlock label="Gemiste kans" variant="warning">
                {result.gemistekans}
              </AIResponseBlock>

              <AIResponseBlock label="Verbeterpunt voor volgende keer" variant="highlight">
                {result.verbeterpunt}
              </AIResponseBlock>

              {/* Follow-up bericht */}
              <div className="rounded-lg border border-border bg-surface-raised overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-surface-subtle border-b border-border">
                  <p className="text-[11px] font-semibold text-ink-faint uppercase tracking-wider">
                    Opvolgbericht aan medewerker
                  </p>
                  <button
                    onClick={handleCopyFollowup}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-sm font-medium border border-border bg-white hover:border-accent-muted text-ink-muted hover:text-ink-DEFAULT transition-colors"
                  >
                    {copied ? (
                      <>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <path d="M1.5 5.5l2.5 2.5 5-5" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-success-DEFAULT">Gekopieerd</span>
                      </>
                    ) : (
                      <>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.1"/>
                          <path d="M1 7V2a1 1 0 011-1h5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                        </svg>
                        Kopieer
                      </>
                    )}
                  </button>
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm text-ink-DEFAULT leading-relaxed whitespace-pre-line">
                    {result.followupBericht}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
