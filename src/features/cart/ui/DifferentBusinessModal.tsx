import { AlertTriangle } from 'lucide-react';
import { Modal, Button } from '@shared/ui';

interface DifferentBusinessModalProps {
  isOpen: boolean;
  currentBusinessName: string;
  incomingBusinessName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal que aparece cuando el usuario intenta agregar un producto
 * de un comercio distinto al que ya tiene en el carrito.
 *
 * Regla crítica del enunciado: un solo comercio por pedido.
 */
export default function DifferentBusinessModal({
  isOpen,
  currentBusinessName,
  incomingBusinessName,
  onConfirm,
  onCancel,
}: DifferentBusinessModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="¿Iniciar un nuevo pedido?"
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onCancel}>
            Mantener carrito actual
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Sí, descartar y agregar
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center gap-3 py-2">
        <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
        </div>
        <p className="text-text text-sm leading-relaxed">
          Ya tienes productos de{' '}
          <span className="font-semibold text-text-heading">{currentBusinessName}</span>{' '}
          en tu carrito. Si agregas de{' '}
          <span className="font-semibold text-text-heading">{incomingBusinessName}</span>,
          se descartará el pedido actual.
        </p>
        <p className="text-xs text-text/60">
          Solo se puede tener un comercio activo por pedido.
        </p>
      </div>
    </Modal>
  );
}
