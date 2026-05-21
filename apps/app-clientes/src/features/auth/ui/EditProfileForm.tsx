import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { Button, Input, Card, toast } from '@shared/ui';
import { ROUTES } from '@app/router/routes';
import { useAuthStore } from '@features/auth/model/useAuthStore';
import { validatePhone, validateRequired } from '@shared/lib/validators';

interface FormErrors {
  phone?: string;
  defaultAddress?: string;
}

/**
 * Formulario de edición de perfil.
 * Permite cambiar teléfono y dirección principal del usuario.
 *
 * Email y nombre quedan fuera de scope porque suelen requerir
 * flujos de verificación adicionales (re-confirmar email, etc).
 */
export function EditProfileForm() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [phone, setPhone] = useState(user?.phone ?? '');
  const [defaultAddress, setDefaultAddress] = useState(
    user?.defaultAddress ?? ''
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const next: FormErrors = {};

    const phoneError = validatePhone(phone);
    if (phoneError) next.phone = phoneError;

    const addressError = validateRequired(defaultAddress, 'La dirección');
    if (addressError) next.defaultAddress = addressError;

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      updateProfile({ phone, defaultAddress });
      toast.success('Perfil actualizado correctamente.');
      navigate(ROUTES.PROFILE);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.PROFILE);
  };

  if (!user) {
    return (
      <Card className="p-6 text-center">
        <p className="text-text/60">No hay sesión activa.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-text-heading">Editar perfil</h1>
        <p className="text-sm text-text/60 mt-1">
          Actualiza tu teléfono o dirección de entrega.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Teléfono"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
          hint="8 dígitos, sin guiones ni espacios"
          placeholder="55123456"
        />

        <Input
          label="Dirección principal"
          value={defaultAddress}
          onChange={(e) => setDefaultAddress(e.target.value)}
          error={errors.defaultAddress}
          placeholder="Zona 10, 5ta avenida 12-34"
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            leftIcon={<X className="w-4 h-4" />}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
            className="flex-1"
          >
            Guardar cambios
          </Button>
        </div>
      </form>
    </Card>
  );
}