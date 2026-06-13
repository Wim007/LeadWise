interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-surface-overlay flex items-center justify-center mb-4">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8" stroke="#A8A29E" strokeWidth="1.5"/>
          <path d="M10 7v4" stroke="#A8A29E" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="10" cy="13.5" r="0.75" fill="#A8A29E"/>
        </svg>
      </div>
      <h3 className="text-sm font-medium text-ink-DEFAULT mb-1">{title}</h3>
      <p className="text-sm text-ink-muted max-w-xs leading-relaxed">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
