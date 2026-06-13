'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { RewriteVariant } from '@/types';

const variantConfig: Record<string, { color: string; bg: string; border: string }> = {
  vriendelijk_duidelijk: {
    color: 'text-success-DEFAULT',
    bg: 'bg-success-light',
    border: 'border-success-DEFAULT/20',
  },
  empathisch: {
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  begrenzend_respectvol: {
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  motiverend_coachend: {
    color: 'text-accent-DEFAULT',
    bg: 'bg-accent-light',
    border: 'border-accent-muted',
  },
};

interface RewriteCardProps {
  variant: RewriteVariant;
}

export function RewriteCard({ variant }: RewriteCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const config = variantConfig[variant.type] ?? variantConfig.vriendelijk_duidelijk;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(variant.tekst);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('rounded-lg border bg-surface-raised overflow-hidden', config.border)}>
      {/* Header */}
      <div className={cn('flex items-center justify-between px-4 py-3', config.bg)}>
        <span className={cn('text-xs font-semibold uppercase tracking-wider', config.color)}>
          {variant.label}
        </span>
        <button
          onClick={handleCopy}
          className={cn(
            'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-sm font-medium transition-colors',
            copied ? 'text-success-DEFAULT bg-success-light' : 'text-ink-muted hover:text-ink-DEFAULT bg-white/80 hover:bg-white'
          )}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Gekopieerd
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M1 8V2a1 1 0 011-1h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Kopieer
            </>
          )}
        </button>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <p className="text-sm text-ink-DEFAULT leading-relaxed italic">
          &ldquo;{variant.tekst}&rdquo;
        </p>
      </div>

      {/* Toggle detail */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 border-t border-border text-xs text-ink-muted hover:text-ink-DEFAULT hover:bg-surface transition-colors"
      >
        <span>Waarom werkt dit?</span>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          className={cn('transition-transform', expanded ? 'rotate-180' : '')}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2.5 border-t border-border pt-3 bg-surface">
          <div>
            <p className="text-[11px] font-semibold text-ink-faint uppercase tracking-wider mb-1">Waarom beter</p>
            <p className="text-xs text-ink-muted leading-relaxed">{variant.waaromBeter}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-ink-faint uppercase tracking-wider mb-1">Vermijdt risico</p>
            <p className="text-xs text-ink-muted leading-relaxed">{variant.vermijdtRisico}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-ink-faint uppercase tracking-wider mb-1">Gebruik wanneer</p>
            <p className="text-xs text-ink-muted leading-relaxed">{variant.gebruikWanneer}</p>
          </div>
        </div>
      )}
    </div>
  );
}
