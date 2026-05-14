import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@shared/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export default function Card({
  children,
  hoverable = false,
  padding = 'md',
  className,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-bg',
        paddingStyles[padding],
        hoverable &&
          'transition-all cursor-pointer hover:shadow-soft hover:border-accent-border',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}