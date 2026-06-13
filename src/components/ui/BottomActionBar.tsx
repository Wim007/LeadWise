import { cn } from '@/lib/utils';

interface BottomActionBarProps {
  children: React.ReactNode;
  className?: string;
}

export function BottomActionBar({ children, className }: BottomActionBarProps) {
  return (
    <div
      className={cn(
        'sticky bottom-0 left-0 right-0 z-20',
        'bg-surface-raised/95 backdrop-blur-sm border-t border-border',
        'px-4 py-3 md:px-6',
        className
      )}
    >
      <div className="flex items-center gap-3 max-w-5xl mx-auto">
        {children}
      </div>
    </div>
  );
}
