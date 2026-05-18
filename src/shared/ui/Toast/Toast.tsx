import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@shared/lib/cn';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: (id: string) => void;
}

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: 'border-l-4 border-l-green-500',
  error: 'border-l-4 border-l-red-500',
  info: 'border-l-4 border-l-accent',
};

const VARIANT_ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
  info: <Info className="w-5 h-5 text-accent shrink-0" />,
};

export default function Toast({
  id,
  message,
  variant = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div
      role="status"
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg',
        'bg-bg border border-border min-w-[280px] max-w-md',
        'animate-in slide-in-from-right-5 fade-in duration-200',
        VARIANT_STYLES[variant]
      )}
    >
      {VARIANT_ICONS[variant]}
      <p className="text-sm text-text-heading flex-1 pt-0.5">{message}</p>
      <button
        type="button"
        onClick={() => onClose(id)}
        aria-label="Cerrar notificación"
        className="text-text/60 hover:text-text-heading transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}