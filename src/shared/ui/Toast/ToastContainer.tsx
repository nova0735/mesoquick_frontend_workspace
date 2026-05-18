import Toast from './Toast';
import { useToasts } from './useToast';

/**
 * Contenedor que renderiza todos los toasts activos.
 * Se monta una sola vez a nivel global (ver MainLayout o App).
 */
export default function ToastContainer() {
  const { toasts, dismiss } = useToasts();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-auto"
    >
      {toasts.map((t) => (
        <Toast
          key={t.id}
          id={t.id}
          message={t.message}
          variant={t.variant}
          duration={t.duration}
          onClose={dismiss}
        />
      ))}
    </div>
  );
}