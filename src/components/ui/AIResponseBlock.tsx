import { cn } from '@/lib/utils';

interface AIResponseBlockProps {
  label: string;
  children: React.ReactNode;
  variant?: 'default' | 'highlight' | 'warning' | 'success';
  className?: string;
}

export function AIResponseBlock({ label, children, variant = 'default', className }: AIResponseBlockProps) {
  const variantStyles = {
    default: 'border-border bg-surface-raised',
    highlight: 'border-accent-muted bg-accent-light',
    warning: 'border-warning-DEFAULT/30 bg-warning-light',
    success: 'border-success-DEFAULT/30 bg-success-light',
  };

  const labelStyles = {
    default: 'text-ink-faint',
    highlight: 'text-accent-DEFAULT',
    warning: 'text-warning-DEFAULT',
    success: 'text-success-DEFAULT',
  };

  return (
    <div className={cn('rounded-lg border p-4', variantStyles[variant], className)}>
      <p className={cn('text-[11px] font-semibold uppercase tracking-wider mb-2', labelStyles[variant])}>
        {label}
      </p>
      <div className="text-sm text-ink-DEFAULT leading-relaxed">{children}</div>
    </div>
  );
}

interface ListBlockProps {
  items: string[];
  variant?: 'default' | 'warning' | 'success';
}

export function ListBlock({ items, variant = 'default' }: ListBlockProps) {
  const dotColor = {
    default: 'bg-ink-faint',
    warning: 'bg-warning-DEFAULT',
    success: 'bg-success-DEFAULT',
  };

  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-sm text-ink-DEFAULT leading-relaxed">
          <span className={cn('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0', dotColor[variant])} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
