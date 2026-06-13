'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onClose?: () => void;
}

const navItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    href: '/voorbereider',
    label: 'Gespreksvoorbereider',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 3h12M2 6h8M2 9h10M2 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/herschrijver',
    label: 'Herschrijver',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 12.5L5.5 10l-2-2 2.5-2.5 2 2 3-3 2 2-3 3 2 2-2.5 2.5-2-2-2.5 2.5-2-2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/scenario',
    label: 'Scenario cockpit',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/live',
    label: 'Live coachmodus',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="3" fill="currentColor"/>
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2"/>
      </svg>
    ),
    accent: true,
  },
  {
    href: '/reflectie',
    label: 'Reflectie',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2a6 6 0 100 12A6 6 0 008 2z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 5.5v3l1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const secondaryItems = [
  { href: '/prompts', label: 'Promptbibliotheek' },
  { href: '/instellingen', label: 'Instellingen' },
];

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-canvas-DEFAULT">
      {/* Logo */}
      <div className="flex items-center justify-between h-14 px-5 border-b border-canvas-muted flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-sm bg-accent-DEFAULT flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">Coach Assistent</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-canvas-subtle hover:text-white transition-colors p-1"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded text-sm transition-all',
                isActive
                  ? 'bg-canvas-muted text-white'
                  : 'text-stone-400 hover:text-white hover:bg-canvas-muted/60',
                item.accent && !isActive && 'text-accent-muted hover:text-accent-muted'
              )}
            >
              <span className={cn('flex-shrink-0', isActive ? 'text-white' : '')}>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
              {item.accent && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-DEFAULT animate-pulse flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Secondary nav */}
      <div className="px-3 py-3 border-t border-canvas-muted space-y-0.5">
        {secondaryItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center px-3 py-2 rounded text-xs transition-all',
                isActive ? 'text-white' : 'text-stone-500 hover:text-stone-300'
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
