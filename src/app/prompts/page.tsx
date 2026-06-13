'use client';

import { useState } from 'react';
import type { PromptTemplate } from '@/types';

const promptData: PromptTemplate[] = [
  {
    id: '1',
    categorie: 'Opening',
    titel: 'Neutrale opening bij moeilijk gesprek',
    situatie: 'Je wilt een gesprek openen zonder direct lading te leggen.',
    prompt: '"Ik heb dit gesprek ingepland omdat ik graag even rustig wil begrijpen hoe jij de afgelopen tijd hebt ervaren. Niet om te oordelen — maar omdat ik denk dat we samen iets kunnen verbeteren."',
    tags: ['opening', 'rustig', 'algemeen'],
  },
  {
    id: '2',
    categorie: 'Opening',
    titel: 'Opening na een incident',
    situatie: 'Er is iets concreets voorgevallen en je wilt dat bespreken.',
    prompt: '"Ik wil het vandaag hebben over wat er [dag/situatie] is voorgevallen. Ik wil graag jouw kant van het verhaal horen voordat ik er iets van vind."',
    tags: ['opening', 'incident', 'neutraal'],
  },
  {
    id: '3',
    categorie: 'Doorvragen',
    titel: 'Doorvragen bij vage antwoorden',
    situatie: 'De medewerker geeft een ontwijkend of vaag antwoord.',
    prompt: '"Kun je me daar een concreet voorbeeld van geven? Dan begrijp ik beter wat je bedoelt."',
    tags: ['doorvragen', 'helder', 'voorbeelden'],
  },
  {
    id: '4',
    categorie: 'Doorvragen',
    titel: 'Doorvragen bij stilte',
    situatie: 'De medewerker zwijgt of reageert niet.',
    prompt: '"Neem gerust even de tijd. Er is geen haast. Wat gaat er door je heen?"',
    tags: ['stilte', 'ruimte', 'veiligheid'],
  },
  {
    id: '5',
    categorie: 'Eigenaarschap',
    titel: 'Eigenaarschap activeren',
    situatie: 'Medewerker legt problemen altijd bij anderen.',
    prompt: '"Ik begrijp dat anderen ook een rol spelen. Tegelijk: wat is jouw invloed in deze situatie? Wat kun jij doen, ongeacht wat anderen doen?"',
    tags: ['eigenaarschap', 'verantwoordelijkheid', 'invloed'],
  },
  {
    id: '6',
    categorie: 'Eigenaarschap',
    titel: 'Eerste kleine stap',
    situatie: 'Je wilt een concrete, haalbare actie afspreken.',
    prompt: '"Wat is de kleinste stap die jij deze week kunt zetten om hier een begin mee te maken?"',
    tags: ['actie', 'haalbaar', 'concreet'],
  },
  {
    id: '7',
    categorie: 'Weerstand',
    titel: 'Reageren op "dat is niet mijn schuld"',
    situatie: 'Medewerker ontkent de situatie of verdedigt zich direct.',
    prompt: '"Ik hoor je en ik wil je niet de schuld geven. Laten we kijken naar wat er nu is en wat we samen kunnen doen."',
    tags: ['weerstand', 'schuld', 'de-escalatie'],
  },
  {
    id: '8',
    categorie: 'Weerstand',
    titel: 'Reageren op frustratie',
    situatie: 'Medewerker reageert geïrriteerd of emotioneel.',
    prompt: '"Ik merk dat dit wat losmaakt bij je. Dat snap ik. Wil je me vertellen wat er precies achter die frustratie zit?"',
    tags: ['emotie', 'frustratie', 'erkenning'],
  },
  {
    id: '9',
    categorie: 'Afsluiting',
    titel: 'Concreet afsluiten',
    situatie: 'Je wilt het gesprek afronden met duidelijke afspraken.',
    prompt: '"We spreken dan het volgende af: [actie] vóór [datum]. Ik schrijf dit op. Klopt dit met wat jij ook hebt begrepen?"',
    tags: ['afsluiting', 'afspraak', 'duidelijkheid'],
  },
  {
    id: '10',
    categorie: 'Afsluiting',
    titel: 'Positief afsluiten',
    situatie: 'Je wilt het gesprek afsluiten op een constructieve toon.',
    prompt: '"Ik waardeer dat je dit gesprek serieus hebt genomen. Ik heb er vertrouwen in dat dit gaat lukken. Over [termijn] kijk ik er even mee je naar — dan hoor ik hoe het gaat."',
    tags: ['afsluiting', 'waardering', 'vertrouwen'],
  },
  {
    id: '11',
    categorie: 'Feedback geven',
    titel: 'Observatie zonder oordeel',
    situatie: 'Je wilt gedrag benoemen zonder het te labelen.',
    prompt: '"Ik heb de afgelopen weken gezien dat [concreet gedrag]. Ik deel dat niet als verwijt — ik noem het omdat ik wil begrijpen wat er speelt."',
    tags: ['feedback', 'observatie', 'gedrag'],
  },
  {
    id: '12',
    categorie: 'Feedback geven',
    titel: 'Positieve feedback geven',
    situatie: 'Je wilt specifiek en geloofwaardig iets positiefs benoemen.',
    prompt: '"Ik wil even benoemen dat [specifieke actie of gedrag] goed werkte. Dat viel me echt op en het heeft effect gehad."',
    tags: ['positief', 'waardering', 'specifiek'],
  },
];

const categorieën = Array.from(new Set(promptData.map((p) => p.categorie)));

export default function PromptsPage() {
  const [filter, setFilter] = useState<string>('alle');
  const [copied, setCopied] = useState<string>('');

  const filtered = filter === 'alle'
    ? promptData
    : promptData.filter((p) => p.categorie === filter);

  const handleCopy = async (id: string, tekst: string) => {
    await navigator.clipboard.writeText(tekst);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-DEFAULT tracking-tight">Promptbibliotheek</h1>
        <p className="text-sm text-ink-muted mt-1">
          Kant-en-klare zinnen en vragen voor veelvoorkomende coachingssituaties.
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('alle')}
          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
            filter === 'alle'
              ? 'bg-accent-DEFAULT text-white border-accent-DEFAULT'
              : 'border-border text-ink-muted hover:text-ink-DEFAULT hover:border-accent-muted'
          }`}
        >
          Alle
        </button>
        {categorieën.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              filter === cat
                ? 'bg-accent-DEFAULT text-white border-accent-DEFAULT'
                : 'border-border text-ink-muted hover:text-ink-DEFAULT hover:border-accent-muted'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Prompts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((prompt) => (
          <div
            key={prompt.id}
            className="rounded-lg border border-border bg-surface-raised p-4 space-y-3 hover:border-accent-muted hover:shadow-card transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-semibold text-ink-faint uppercase tracking-wider">
                  {prompt.categorie}
                </span>
                <h3 className="text-sm font-semibold text-ink-DEFAULT mt-0.5">
                  {prompt.titel}
                </h3>
              </div>
              <button
                onClick={() => handleCopy(prompt.id, prompt.prompt)}
                className={`flex-shrink-0 flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border font-medium transition-colors ${
                  copied === prompt.id
                    ? 'border-success-DEFAULT/30 bg-success-light text-success-DEFAULT'
                    : 'border-border bg-surface-subtle text-ink-muted hover:text-ink-DEFAULT hover:border-accent-muted'
                }`}
              >
                {copied === prompt.id ? 'Gekopieerd' : 'Kopieer'}
              </button>
            </div>

            <p className="text-xs text-ink-muted leading-relaxed bg-surface-subtle rounded-md px-2.5 py-2">
              {prompt.situatie}
            </p>

            <p className="text-sm text-ink-DEFAULT leading-relaxed italic border-l-2 border-accent-muted pl-3">
              {prompt.prompt}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {prompt.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-surface-overlay text-ink-faint"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
