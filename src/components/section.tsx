import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function Section({ className, ...props }: ComponentProps<'section'>) {
  return (
    <section
      className={cn('w-full max-w-6xl px-4 py-20 md:py-32', className)}
      {...props}
    />
  );
}
