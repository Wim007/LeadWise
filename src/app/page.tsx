import Link from 'next/link';

const modules = [
  {
    href: '/voorbereider',
    titel: 'Gespreksvoorbereider',
    beschrijving: 'Bereid elk gesprek voor met een concreet plan, coachvragen en openingszin.',
    label: 'Nieuw gesprek',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 5h14M3 9h9M3 13h11M3 17h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/herschrijver',
    titel: 'Herschrijver',
    beschrijving: 'Herschrijf je boodschap in vier varianten — van empathisch tot begrenzend.',
    label: 'Tekst invoeren',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 15.5L7 13l-2.5-2.5 3-3 2.5 2.5 3.5-3.5 2.5 2.5-3.5 3.5 2.5 2.5-3 3-2.5-2.5L7 17l-3-1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/scenario',
    titel: 'Scenario cockpit',
    beschrijving: 'Kies een moeilijk scenario en krijg direct een complete aanpak.',
    label: 'Scenario kiezen',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 6.5v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/live',
    titel: 'Live coachmodus',
    beschrijving: 'Typ wat de medewerker zegt en krijg direct een reactie, coachvraag en valkuil.',
    label: 'Start live coach',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="3.5" fill="currentColor"/>
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2"/>
      </svg>
    ),
    accent: true,
  },
  {
    href: '/reflectie',
    titel: 'Reflectie na gesprek',
    beschrijving: 'Analyseer wat er is gebeurd en wat je de volgende keer anders kunt doen.',
    label: 'Reflecteer',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 3a7 7 0 100 14A7 7 0 0010 3z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 7v4l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/prompts',
    titel: 'Promptbibliotheek',
    beschrijving: 'Kant-en-klare vragen en openingszinnen voor veelvoorkomende situaties.',
    label: 'Bekijk prompts',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 7h8M6 10.5h5M6 14h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const quickActions = [
  { href: '/live', label: 'Gesprek loopt nu', sub: 'Open live coach', accent: true },
  { href: '/voorbereider', label: 'Gesprek inplannen', sub: 'Voorbereider openen' },
  { href: '/reflectie', label: 'Gesprek afgerond', sub: 'Reflectie starten' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-ink-DEFAULT tracking-tight">
          Goede dag.
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          Selecteer een module om mee aan de slag te gaan.
        </p>
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-3">
          Snel starten
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                action.accent
                  ? 'bg-accent-light border-accent-muted hover:bg-accent-DEFAULT hover:text-white group'
                  : 'bg-surface-raised border-border hover:border-accent-muted hover:shadow-card'
              }`}
            >
              {action.accent && (
                <span className="w-2 h-2 rounded-full bg-accent-DEFAULT group-hover:bg-white animate-pulse flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className={`text-sm font-medium truncate ${action.accent ? 'text-accent-DEFAULT group-hover:text-white' : 'text-ink-DEFAULT'}`}>
                  {action.label}
                </p>
                <p className={`text-xs truncate ${action.accent ? 'text-accent-DEFAULT/70 group-hover:text-white/70' : 'text-ink-muted'}`}>
                  {action.sub}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Modules */}
      <div>
        <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-3">
          Modules
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className={`group flex flex-col gap-3 p-4 rounded-lg border bg-surface-raised transition-all hover:shadow-card-hover ${
                mod.accent
                  ? 'border-accent-muted hover:border-accent-DEFAULT'
                  : 'border-border hover:border-accent-muted/60'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                mod.accent
                  ? 'bg-accent-light text-accent-DEFAULT'
                  : 'bg-surface-subtle text-ink-muted group-hover:bg-accent-light group-hover:text-accent-DEFAULT'
              }`}>
                {mod.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-ink-DEFAULT group-hover:text-accent-DEFAULT transition-colors">
                    {mod.titel}
                  </h3>
                  {mod.accent && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm bg-accent-DEFAULT text-white">
                      Live
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  {mod.beschrijving}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-ink-faint group-hover:text-accent-DEFAULT transition-colors">
                <span>{mod.label}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6h7M7 3.5l2.5 2.5L7 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Coaching principles reminder */}
      <div className="rounded-lg border border-border bg-surface-raised p-4">
        <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-3">
          Principes die de assistent toepast
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {[
            'Eerst begrijpen',
            'Laat de ander praten',
            'Stel vragen',
            'Begin vriendelijk',
            'Maak het concreet',
          ].map((p) => (
            <div
              key={p}
              className="flex items-center gap-2 text-xs text-ink-muted"
            >
              <span className="w-1 h-1 rounded-full bg-accent-muted flex-shrink-0" />
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
