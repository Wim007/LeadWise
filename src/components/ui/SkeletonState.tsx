import { cn } from '@/lib/utils';

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div className={cn('h-3.5 bg-surface-overlay rounded animate-pulse', className)} />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border bg-surface-raised p-4 space-y-3">
      <SkeletonLine className="w-24" />
      <SkeletonLine className="w-full" />
      <SkeletonLine className="w-4/5" />
      <SkeletonLine className="w-3/5" />
    </div>
  );
}

export function SkeletonAdvice() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-lg border border-border bg-surface-raised p-4 space-y-2.5">
          <SkeletonLine className="w-20" />
          <SkeletonLine className="w-full" />
          <SkeletonLine className="w-4/5" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonLive() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="rounded-lg border border-border bg-surface-raised p-3 space-y-2">
          <SkeletonLine className="w-16" />
          <SkeletonLine className="w-full" />
        </div>
      ))}
    </div>
  );
}
