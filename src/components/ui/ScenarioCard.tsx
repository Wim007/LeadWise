import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ScenarioType } from '@/types';

interface ScenarioCardProps {
  id: ScenarioType;
  titel: string;
  omschrijving: string;
  className?: string;
}

const scenarioIcons: Record<ScenarioType, React.ReactNode> = {
  onderprestatie: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 3v7M6 8l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 15h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  defensief: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2.5l7 3v4c0 3.5-3 6.5-7 7.5C5 16.5 2 13.5 2 10v-4l7-3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  ),
  teamconflict: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="12" cy="6" r="3" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2 15c0-2.2 1.8-4 4-4M16 15c0-2.2-1.8-4-4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M8 15c0-2.2 1.8-4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2 1"/>
    </svg>
  ),
  weinig_eigenaarschap: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M5 15c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M12 9l2 2-2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  weerstand_verandering: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 9h12M9 3l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  gevoelige_correctie: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2.5v9M9 14v1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),
};

export function ScenarioCard({ id, titel, omschrijving, className }: ScenarioCardProps) {
  return (
    <Link
      href={`/scenario?type=${id}`}
      className={cn(
        'group flex items-start gap-3.5 p-4 rounded-lg border border-border bg-surface-raised',
        'hover:border-accent-muted hover:shadow-card-hover transition-all',
        className
      )}
    >
      <div className="w-9 h-9 rounded-lg bg-surface-subtle flex items-center justify-center flex-shrink-0 text-ink-muted group-hover:text-accent-DEFAULT group-hover:bg-accent-light transition-colors mt-0.5">
        {scenarioIcons[id]}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink-DEFAULT group-hover:text-accent-DEFAULT transition-colors">{titel}</p>
        <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">{omschrijving}</p>
      </div>
      <svg
        width="14" height="14" viewBox="0 0 14 14" fill="none"
        className="flex-shrink-0 text-ink-faint group-hover:text-accent-DEFAULT transition-colors mt-1 ml-auto"
      >
        <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </Link>
  );
}
