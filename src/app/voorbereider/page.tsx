'use client';

import { useState } from 'react';
import { FormField, Textarea, Input, Select, Button } from '@/components/ui/StepForm';
import { AIResponseBlock, ListBlock } from '@/components/ui/AIResponseBlock';
import { SkeletonAdvice } from '@/components/ui/SkeletonState';
import { EmptyState } from '@/components/ui/EmptyState';
import type { GespreksVoorbereiding, CoachingAdvice } from '@/types';
import { gevoeligheidColors, gevoeligheidLabels } from '@/lib/utils';

const defaultForm: GespreksVoorbereiding = {
  gespreksType: 'functioneringsgesprek',
  medewerkernaam: '',
  context: '',
  probleemOfDoel: '',
  alGeprobeerd: '',
  gewensteUitkomst: '',
  gevoeligheid: 'gemiddeld',
};

export default function VoorbereiderPage() {
  const [form, setForm] = useState<GespreksVoorbereiding>(defaultForm);
  const [result, setResult] = useState<CoachingAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/voorbereider', {
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

  const update = (field: keyof GespreksVoorbereiding) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-ink-DEFAULT tracking-tight">Gespreksvoorbereider</h1>
        <p className="text-sm text-ink-muted mt-1">
          Vul in wat je weet over het gesprek. De assistent maakt een concreet plan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-surface-raised rounded-lg border border-border p-4 md:p-5">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Type gesprek" required>
              <Select value={form.gespreksType} onChange={update('gespreksType')}>
                <option value="functioneringsgesprek">Functioneringsgesprek</option>
                <option value="correctiegesprek">Correctiegesprek</option>
                <option value="motivatiegesprek">Motivatiegesprek</option>
                <option value="conflictgesprek">Conflictgesprek</option>
                <option value="verzuimgesprek">Verzuimgesprek</option>
                <option value="ontwikkelgesprek">Ontwikkelgesprek</option>
                <option value="exitgesprek">Exitgesprek</option>
                <option value="overig">Overig</option>
              </Select>
            </FormField>
            <FormField label="Gevoeligheid">
              <Select value={form.gevoeligheid} onChange={update('gevoeligheid')}>
                <option value="laag">Laag</option>
                <option value="gemiddeld">Gemiddeld</option>
                <option value="hoog">Hoog</option>
                <option value="zeer_hoog">Zeer hoog</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Naam medewerker" required>
            <Input
              value={form.medewerkernaam}
              onChange={update('medewerkernaam')}
              placeholder="Bijv. Lisa of de teamleider"
            />
          </FormField>

          <FormField label="Context" hint="Wat speelt er al langer of wat is de achtergrond?">
            <Textarea
              value={form.context}
              onChange={update('context')}
              placeholder="Bijv. Lisa werkt al 3 jaar in het team. De laatste maanden zijn er klachten van collega's..."
              rows={3}
            />
          </FormField>

          <FormField label="Probleem of doel" required hint="Wat wil je in dit gesprek aan de orde stellen?">
            <Textarea
              value={form.probleemOfDoel}
              onChange={update('probleemOfDoel')}
              placeholder="Bijv. Lisa haalt haar targets niet en reageert defensief op feedback."
              rows={3}
            />
          </FormField>

          <FormField label="Al geprobeerd" hint="Wat heb je al gedaan of gezegd?">
            <Textarea
              value={form.alGeprobeerd}
              onChange={update('alGeprobeerd')}
              placeholder="Bijv. Vorige maand al kort aangesproken, maar er is weinig veranderd."
              rows={2}
            />
          </FormField>

          <FormField label="Gewenste uitkomst" hint="Hoe zou dit gesprek er ideaal uitzien?">
            <Textarea
              value={form.gewensteUitkomst}
              onChange={update('gewensteUitkomst')}
              placeholder="Bijv. Concrete afspraken, medewerker voelt zich gehoord en weet wat er verandert."
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
            disabled={!form.medewerkernaam || !form.probleemOfDoel}
            className="w-full"
            size="lg"
          >
            {loading ? 'Voorbereiding maken...' : 'Maak gespreksvoorbereiding'}
          </Button>
        </form>

        {/* Output */}
        <div className="space-y-3">
          {loading && <SkeletonAdvice />}

          {!loading && !result && (
            <div className="hidden lg:block">
              <EmptyState
                title="Vul het formulier in"
                description="De voorbereiding verschijnt hier zodra je het formulier invult en verstuurt."
              />
            </div>
          )}

          {result && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-ink-DEFAULT">Voorbereiding voor {form.medewerkernaam}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${gevoeligheidColors[form.gevoeligheid]}`}>
                  {gevoeligheidLabels[form.gevoeligheid]}
                </span>
              </div>

              <AIResponseBlock label="Gespreksdoel" variant="highlight">
                {result.gespreksdoel}
              </AIResponseBlock>

              <AIResponseBlock label="Aanbevolen toon">
                {result.aanbevolenToon}
              </AIResponseBlock>

              <AIResponseBlock label="Risico&apos;s" variant="warning">
                <ListBlock items={result.risicos} variant="warning" />
              </AIResponseBlock>

              <AIResponseBlock label="Openingszin" variant="success">
                <p className="italic">{result.openingszin}</p>
              </AIResponseBlock>

              <AIResponseBlock label="5 coachvragen">
                <ol className="space-y-2">
                  {result.coachvragen.map((v, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-ink-DEFAULT">
                      <span className="text-ink-faint font-medium w-4 flex-shrink-0">{i + 1}.</span>
                      <span className="leading-relaxed">{v}</span>
                    </li>
                  ))}
                </ol>
              </AIResponseBlock>

              <AIResponseBlock label="Zeg dit liever niet" variant="warning">
                <ul className="space-y-2">
                  {result.vermijdZinnen.map((z, i) => (
                    <li key={i} className="text-sm text-ink-DEFAULT leading-relaxed flex gap-2">
                      <span className="text-warning-DEFAULT mt-0.5 flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M7 1.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM7 4.5v3M7 9v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                      </span>
                      {z}
                    </li>
                  ))}
                </ul>
              </AIResponseBlock>

              <AIResponseBlock label="Gespreksplan">
                {result.gespreksplan}
              </AIResponseBlock>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
