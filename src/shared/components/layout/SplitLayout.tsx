import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface SplitLayoutProps {
  left: ReactNode;
  right: ReactNode;
  leftClassName?: string;
  rightClassName?: string;
}

export function SplitLayout({
  left,
  right,
  leftClassName,
  rightClassName,
}: SplitLayoutProps) {
  return (
    <div className="h-full flex">
      <aside
        className={cn(
          'w-95 shrink-0 border-r border-neutral-200 bg-white overflow-y-auto',
          leftClassName,
        )}
      >
        {left}
      </aside>
      <section className={cn('flex-1 overflow-y-auto bg-neutral-50', rightClassName)}>
        {right}
      </section>
    </div>
  );
}