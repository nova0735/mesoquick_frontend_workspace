import { useState } from 'react';
import { MapPin, Home } from 'lucide-react';
import { Input, Button } from '@shared/ui';
import type { AddressFormData } from '@features/checkout/model/checkout.types';
import { useAuthStore } from '@features/auth/model/useAuthStore';

interface AddressStepProps {
  initialData: AddressFormData | null;
  onNext: (data: AddressFormData) => void;
}

export default function AddressStep({ initialData, onNext }: AddressStepProps) {
  const user = useAuthStore((s) => s.user);
  const userDefaultAddress = user?.defaultAddress ?? '';

  /**
   * Estrategia de pre-llenado:
   * 1. Si hay initialData (usuario ya editó en este checkout) → eso
   * 2. Sino, si hay defaultAddress del usuario logueado → eso
   * 3. Sino, vacío
   */
  const [address, setAddress] = useState(
    initialData?.address ?? userDefaultAddress
  );
  const [references, setReferences] = useState(initialData?.references ?? '');
  const [error, setError] = useState('');

  const isUsingDefaultAddress =
    !initialData?.address && address === userDefaultAddress && userDefaultAddress !== '';

  const handleSubmit = () => {
    if (!address.trim()) {
      setError('La dirección de entrega es obligatoria.');
      return;
    }
    setError('');
    onNext({
      address: address.trim(),
      references: references.trim() || undefined,
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-text-heading">
          ¿Dónde entregamos?
        </h2>
        <p className="text-sm text-text mt-0.5">
          Ingresá la dirección de entrega de tu pedido.
        </p>
      </div>

      {/* Indicador de dirección predeterminada activa */}
      {isUsingDefaultAddress && (
        <div className="flex items-start gap-2 bg-accent-bg rounded-lg p-2.5">
          <Home className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text">
            Estamos usando tu{' '}
            <span className="font-medium text-text-heading">
              dirección predeterminada
            </span>
            . Podés editarla abajo si querés enviarlo a otro lado.
          </p>
        </div>
      )}

      <Input
        label="Dirección de entrega *"
        placeholder="Ej: Zona 10, 5ta Avenida 12-34"
        value={address}
        onChange={(e) => {
          setAddress(e.target.value);
          if (error) setError('');
        }}
        error={error}
        leftIcon={<MapPin className="w-4 h-4" />}
      />

      <Input
        label="Referencias (opcional)"
        placeholder="Ej: Edificio azul, portón negro, 2do nivel"
        value={references}
        onChange={(e) => setReferences(e.target.value)}
        hint="Ayudá al repartidor a encontrarte más fácil."
      />

      <Button fullWidth onClick={handleSubmit}>
        Continuar al pago
      </Button>
    </div>
  );
}