import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@shared/lib/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'accent';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-border/50 text-text-heading',
  success: 'bg-green-500/15 text-green-600 dark:text-green-400',
  warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  danger: 'bg-red-500/15 text-red-600 dark:text-red-400',
  accent: 'bg-accent-bg text-accent',
};

export default function Badge({
  children,
  variant = 'default',
  className,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        variantStyles[variant],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}