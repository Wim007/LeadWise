'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { LiveCoachResponse } from '@/types';

interface Entry {
  id: number;
  input: string;
  response: LiveCoachResponse;
  timestamp: Date;
}

export default function LivePage() {
  const [input, setInput] = useState('');
  const [context, setContext] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showContext, setShowContext] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const currentInput = input.trim();
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medewerkerUiting: currentInput, gesprekContext: context }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setEntries((prev) => [...prev, {
        id: Date.now(),
        input: currentInput,
        response: data,
        timestamp: new Date(),
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is iets misgegaan.');
      setInput(currentInput);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full -my-5 md:-my-6 lg:-my-8">
      {/* Page header */}
      <div className="px-4 md:px-6 lg:px-8 py-5 border-b border-border bg-surface-raised flex-shrink-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-accent-DEFAULT animate-pulse" />
                <h1 className="text-base font-semibold text-ink-DEFAULT tracking-tight">Live coachmodus</h1>
              </div>
              <p className="text-xs text-ink-muted mt-0.5">
                Typ wat de medewerker zegt. Druk Enter voor directe coaching.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowContext(!showContext)}
                className={cn(
                  'text-xs px-2.5 py-1.5 rounded-md border transition-colors',
                  showContext ? 'border-accent-muted bg-accent-light text-accent-DEFAULT' : 'border-border text-ink-muted hover:text-ink-DEFAULT'
                )}
              >
                Context
              </button>
              {entries.length > 0 && (
                <button
                  onClick={() => setEntries([])}
                  className="text-xs px-2.5 py-1.5 rounded-md border border-border text-ink-muted hover:text-danger-DEFAULT hover:border-danger-DEFAULT transition-colors"
                >
                  Wis gesprek
                </button>
              )}
            </div>
          </div>

          {/* Context input */}
          {showContext && (
            <div className="mt-3 pt-3 border-t border-border">
              <label className="block text-xs font-medium text-ink-muted mb-1.5">
                Gesprekcontext (optioneel)
              </label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Bijv. Functioneringsgesprek met Lisa, thema: motivatie"
                className="w-full h-9 px-3 rounded-lg border border-border bg-white text-xs text-ink-DEFAULT placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent-DEFAULT/20 focus:border-accent-DEFAULT"
              />
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 py-4">
        <div className="max-w-5xl mx-auto space-y-4">
          {entries.length === 0 && !loading && (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-accent-light mx-auto flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-accent-DEFAULT animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink-DEFAULT">Gesprek loopt</p>
                <p className="text-xs text-ink-muted mt-1 max-w-xs mx-auto">
                  Typ hieronder wat de medewerker zegt en krijg direct coaching.
                </p>
              </div>
              <div className="pt-2 space-y-2">
                <p className="text-[11px] text-ink-faint uppercase tracking-wider font-semibold">Voorbeelden om te proberen</p>
                {[
                  'Ik doe toch alles wat je vraagt, wat wil je dan nog meer?',
                  'Dit is altijd al zo gegaan, waarom moet dat nu ineens veranderen?',
                  'Het ligt niet aan mij, het ligt aan de samenwerking met collega\'s.',
                ].map((v) => (
                  <button
                    key={v}
                    onClick={() => { setInput(v); inputRef.current?.focus(); }}
                    className="block w-full max-w-sm mx-auto text-left text-xs px-3 py-2.5 rounded-lg border border-border bg-surface-raised hover:border-accent-muted hover:shadow-card text-ink-muted hover:text-ink-DEFAULT transition-all"
                  >
                    &ldquo;{v}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          )}

          {entries.map((entry) => (
            <div key={entry.id} className="space-y-2.5">
              {/* Medewerker uiting */}
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-xl rounded-tr-sm bg-surface-overlay px-3.5 py-2.5">
                  <p className="text-[10px] text-ink-faint font-medium mb-1">Medewerker</p>
                  <p className="text-sm text-ink-DEFAULT leading-relaxed italic">&ldquo;{entry.input}&rdquo;</p>
                </div>
              </div>

              {/* Coach response */}
              <div className="rounded-xl border border-border bg-surface-raised overflow-hidden">
                <div className="px-4 py-2.5 border-b border-border bg-accent-light flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-DEFAULT" />
                  <span className="text-[11px] font-semibold text-accent-DEFAULT uppercase tracking-wider">
                    Coaching
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-border">
                  <LiveBlock
                    icon="💬"
                    label="Reactie"
                    content={entry.response.aanbevolenReactie}
                    highlight
                  />
                  <LiveBlock
                    icon="?"
                    label="Coachvraag"
                    content={entry.response.coachvraag}
                  />
                  <div className="sm:col-span-2 lg:col-span-1">
                    <LiveBlock
                      icon="!"
                      label="Valkuil nu"
                      content={entry.response.valkuil}
                      warning
                    />
                  </div>
                </div>

                <div className="px-4 py-2.5 border-t border-border bg-surface">
                  <p className="text-[10px] font-semibold text-ink-faint uppercase tracking-wider mb-1">Wat speelt er</p>
                  <p className="text-xs text-ink-muted leading-relaxed">{entry.response.interpretatie}</p>
                </div>

                <div className="px-4 py-2.5 border-t border-border flex items-start gap-2">
                  <svg className="text-success-DEFAULT mt-0.5 flex-shrink-0" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1.5 6l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    <span className="font-medium text-ink-DEFAULT">Volgende stap: </span>
                    {entry.response.volgendestap}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 px-2">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-accent-DEFAULT animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <span className="text-xs text-ink-faint">Aan het denken...</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-border bg-surface-raised px-4 md:px-6 lg:px-8 py-3 flex-shrink-0 pb-[calc(12px+env(safe-area-inset-bottom))] lg:pb-3">
        <div className="max-w-5xl mx-auto">
          {error && (
            <div className="text-xs text-danger-DEFAULT mb-2">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="flex gap-2.5 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Typ wat de medewerker zegt..."
              rows={1}
              className="flex-1 min-h-[40px] max-h-[120px] px-3.5 py-2.5 rounded-xl border border-border bg-white text-sm text-ink-DEFAULT placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent-DEFAULT/20 focus:border-accent-DEFAULT resize-none transition-colors overflow-hidden"
              style={{ height: 'auto' }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = 'auto';
                t.style.height = Math.min(t.scrollHeight, 120) + 'px';
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-accent-DEFAULT text-white hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center flex-shrink-0"
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"/>
                  <path d="M7 1.5a5.5 5.5 0 015.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M10 5l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </form>
          <p className="text-[10px] text-ink-faint mt-1.5 text-center">
            Enter om te versturen &middot; Shift+Enter voor nieuwe regel
          </p>
        </div>
      </div>
    </div>
  );
}

function LiveBlock({
  label, content, highlight, warning,
}: {
  icon: string;
  label: string;
  content: string;
  highlight?: boolean;
  warning?: boolean;
}) {
  return (
    <div className={cn(
      'px-4 py-3',
      highlight ? 'bg-success-light' : warning ? 'bg-warning-light' : ''
    )}>
      <p className={cn(
        'text-[10px] font-semibold uppercase tracking-wider mb-1',
        highlight ? 'text-success-DEFAULT' : warning ? 'text-warning-DEFAULT' : 'text-ink-faint'
      )}>
        {label}
      </p>
      <p className={cn(
        'text-sm leading-relaxed',
        highlight ? 'text-ink-DEFAULT font-medium italic' : 'text-ink-DEFAULT'
      )}>
        {highlight ? `"${content}"` : content}
      </p>
    </div>
  );
}
