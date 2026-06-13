'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const mobileNavItems = [
  {
    href: '/',
    label: 'Home',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    href: '/voorbereider',
    label: 'Voorbereider',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 4h14M3 8h9M3 12h11M3 16h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/live',
    label: 'Live',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="3.5" fill="currentColor"/>
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2"/>
      </svg>
    ),
    accent: true,
  },
  {
    href: '/scenario',
    label: 'Scenarios',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 6.5v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/reflectie',
    label: 'Reflectie',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 3a7 7 0 100 14A7 7 0 0010 3z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 7v4l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface-raised border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around px-1 py-1">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-0 flex-1 transition-colors',
                isActive
                  ? item.accent
                    ? 'text-accent-DEFAULT'
                    : 'text-ink-DEFAULT'
                  : item.accent
                    ? 'text-accent-DEFAULT/60'
                    : 'text-ink-faint'
              )}
            >
              {item.icon}
              <span className={cn('text-[10px] font-medium truncate', isActive ? 'font-semibold' : '')}>
                {item.label}
              </span>
              {isActive && (
                <span className={cn('w-1 h-1 rounded-full -mt-0.5', item.accent ? 'bg-accent-DEFAULT' : 'bg-ink-DEFAULT')} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
