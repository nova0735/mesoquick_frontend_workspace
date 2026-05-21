import type { ReactNode } from 'react';
import { cn } from '@shared/lib/cn';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-4',
        className
      )}
    >
      {icon && <div className="mb-4 text-text/40">{icon}</div>}
      <h3 className="text-lg font-semibold text-text-heading mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-text max-w-sm mb-4">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}