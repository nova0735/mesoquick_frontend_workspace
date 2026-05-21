import { cn } from '@shared/lib/cn';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-[3px]',
};

/**
 * Spinner de carga simple con animación de Tailwind.
 * Usa border-current para heredar el color del contenedor.
 */
export default function Spinner({
  size = 'md',
  className,
  label = 'Cargando',
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block rounded-full animate-spin',
        'border-current border-t-transparent text-accent',
        sizeStyles[size],
        className
      )}
    />
  );
}