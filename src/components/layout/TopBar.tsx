'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TopBarProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/voorbereider': 'Gespreksvoorbereider',
  '/herschrijver': 'Herschrijver',
  '/scenario': 'Scenario cockpit',
  '/live': 'Live coachmodus',
  '/reflectie': 'Reflectie na gesprek',
  '/prompts': 'Promptbibliotheek',
  '/instellingen': 'Instellingen',
};

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? 'Coach Assistent';

  return (
    <header className="flex items-center justify-between h-14 px-4 md:px-6 border-b border-border bg-surface-raised flex-shrink-0">
      {/* Mobile: menu + logo */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded text-ink-muted hover:text-ink-DEFAULT hover:bg-surface-overlay transition-colors"
          aria-label="Menu openen"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-sm bg-accent-DEFAULT flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-ink-DEFAULT tracking-tight">Coach Assistent</span>
        </div>
      </div>

      {/* Desktop: page title */}
      <div className="hidden lg:block">
        <h1 className="text-sm font-medium text-ink-DEFAULT">{title}</h1>
      </div>

      {/* Right side: live coach quick access */}
      <div className="flex items-center gap-2">
        <Link
          href="/live"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-accent-DEFAULT text-white text-xs font-medium hover:bg-accent-hover transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
          Live coach
        </Link>
      </div>
    </header>
  );
}
