import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Input, Button } from '@shared/ui';
import type { AddressFormData } from '@features/checkout/model/checkout.types';

interface AddressStepProps {
  initialData: AddressFormData | null;
  onNext: (data: AddressFormData) => void;
}

export default function AddressStep({ initialData, onNext }: AddressStepProps) {
  const [address, setAddress] = useState(initialData?.address ?? '');
  const [references, setReferences] = useState(initialData?.references ?? '');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!address.trim()) {
      setError('La dirección de entrega es obligatoria.');
      return;
    }
    setError('');
    onNext({ address: address.trim(), references: references.trim() || undefined });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-text-heading">¿Dónde entregamos?</h2>
        <p className="text-sm text-text mt-0.5">Ingresa la dirección de entrega de tu pedido.</p>
      </div>

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
        hint="Ayuda al repartidor a encontrarte más fácil."
      />

      <Button fullWidth onClick={handleSubmit}>
        Continuar al pago
      </Button>
    </div>
  );
}
