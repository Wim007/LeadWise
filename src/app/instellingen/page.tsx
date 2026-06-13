'use client';

import { useState } from 'react';
import { FormField, Input, Select, Button } from '@/components/ui/StepForm';
import { SYSTEM_BEHAVIOR_RULES } from '@/lib/ai/prompts';
import type { AppInstellingen } from '@/types';

const defaultInstellingen: AppInstellingen = {
  gebruikersnaam: '',
  organisatie: '',
  rol: '',
  aiModel: 'claude-sonnet-4-6',
  taalNiveau: 'B1',
  mockModus: true,
};

export default function InstellingenPage() {
  const [instellingen, setInstellingen] = useState<AppInstellingen>(defaultInstellingen);
  const [saved, setSaved] = useState(false);

  const update = (field: keyof AppInstellingen) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setInstellingen((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-ink-DEFAULT tracking-tight">Instellingen</h1>
        <p className="text-sm text-ink-muted mt-1">
          Configureer de AI-assistent en je persoonlijke voorkeuren.
        </p>
      </div>

      {/* Profiel */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-ink-DEFAULT">Jouw profiel</h2>
        <div className="bg-surface-raised rounded-lg border border-border p-4 md:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Jouw naam">
              <Input
                value={instellingen.gebruikersnaam}
                onChange={update('gebruikersnaam')}
                placeholder="Bijv. Johan"
              />
            </FormField>
            <FormField label="Organisatie">
              <Input
                value={instellingen.organisatie}
                onChange={update('organisatie')}
                placeholder="Bijv. Zorgcentrum De Eik"
              />
            </FormField>
          </div>
          <FormField label="Jouw rol">
            <Input
              value={instellingen.rol}
              onChange={update('rol')}
              placeholder="Bijv. Teamleider verpleegkunde, Praktijkhouder, HR-manager"
            />
          </FormField>
        </div>
      </section>

      {/* AI configuratie */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-ink-DEFAULT">AI-configuratie</h2>
        <div className="bg-surface-raised rounded-lg border border-border p-4 md:p-5 space-y-4">
          <div className="rounded-lg border border-warning-DEFAULT/30 bg-warning-light px-3.5 py-3">
            <p className="text-xs font-medium text-warning-DEFAULT mb-1">API key vereist</p>
            <p className="text-xs text-ink-muted leading-relaxed">
              Zonder API key gebruikt de app mock-antwoorden. Voeg je Anthropic API key toe als omgevingsvariabele{' '}
              <code className="bg-surface-overlay px-1 py-0.5 rounded text-[11px]">ANTHROPIC_API_KEY</code>{' '}
              in Railway of in je <code className="bg-surface-overlay px-1 py-0.5 rounded text-[11px]">.env.local</code> bestand.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="AI-model" hint="claude-sonnet-4-6 is de aanbevolen keuze">
              <Select value={instellingen.aiModel} onChange={update('aiModel')}>
                <option value="claude-sonnet-4-6">claude-sonnet-4-6 (aanbevolen)</option>
                <option value="claude-opus-4-8">claude-opus-4-8 (uitgebreider)</option>
                <option value="claude-haiku-4-5-20251001">claude-haiku-4-5 (sneller)</option>
              </Select>
            </FormField>
            <FormField label="Taalsniveau output">
              <Select value={instellingen.taalNiveau} onChange={update('taalNiveau')}>
                <option value="B1">B1 — eenvoudig en direct</option>
                <option value="B2">B2 — wat complexer</option>
              </Select>
            </FormField>
          </div>
        </div>
      </section>

      {/* Gedragsregels */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-ink-DEFAULT">Gedragsspecificatie assistent</h2>
        <div className="bg-surface-raised rounded-lg border border-border p-4 md:p-5 space-y-4">
          <p className="text-xs text-ink-muted leading-relaxed">
            De assistent volgt deze gedragsregels altijd. Ze zijn ingebakken in het systeem en kun je niet uitschakelen.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-semibold text-danger-DEFAULT/80 uppercase tracking-wider mb-2">
                Nooit
              </p>
              <ul className="space-y-1.5">
                {SYSTEM_BEHAVIOR_RULES.verboden.map((regel) => (
                  <li key={regel} className="flex gap-2 text-xs text-ink-muted">
                    <svg className="flex-shrink-0 mt-0.5 text-danger-DEFAULT/60" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    {regel}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-success-DEFAULT/80 uppercase tracking-wider mb-2">
                Altijd
              </p>
              <ul className="space-y-1.5">
                {SYSTEM_BEHAVIOR_RULES.verplicht.map((regel) => (
                  <li key={regel} className="flex gap-2 text-xs text-ink-muted">
                    <svg className="flex-shrink-0 mt-0.5 text-success-DEFAULT/70" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1.5 6l3 3 6-6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {regel}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <p className="text-[11px] font-semibold text-ink-faint uppercase tracking-wider mb-2">
              Systeemprompt (technisch)
            </p>
            <div className="bg-canvas-DEFAULT rounded-lg p-3 max-h-40 overflow-y-auto">
              <pre className="text-[11px] text-stone-300 whitespace-pre-wrap font-mono leading-relaxed">
                {`BASE_SYSTEM_PROMPT\n\nTaal: Nederlands B1/B2\nToon: ${SYSTEM_BEHAVIOR_RULES.toonprofiel}\nOutput: ${SYSTEM_BEHAVIOR_RULES.outputStijl}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} size="lg">
          {saved ? 'Opgeslagen' : 'Instellingen opslaan'}
        </Button>
        {saved && (
          <span className="text-sm text-success-DEFAULT">
            Instellingen zijn opgeslagen.
          </span>
        )}
      </div>
    </div>
  );
}
