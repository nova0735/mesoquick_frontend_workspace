import { Input } from '@shared/ui';
import type { RegisterFormData, RegisterFormErrors } from '../model/auth.types';

interface RegisterFormFieldsProps {
  formData: RegisterFormData;
  errors: RegisterFormErrors;
  touched: Partial<Record<keyof RegisterFormData, boolean>>;
  onChange: (field: keyof RegisterFormData, value: string) => void;
  onBlur: (field: keyof RegisterFormData) => void;
}

interface FieldConfig {
  key: keyof RegisterFormData;
  label: string;
  placeholder: string;
  type: string;
}

const FIELDS: FieldConfig[] = [
  {
    key: 'name',
    label: 'Nombre completo',
    placeholder: 'Juan Pérez',
    type: 'text',
  },
  {
    key: 'email',
    label: 'Correo electrónico',
    placeholder: 'juan@correo.com',
    type: 'email',
  },
  {
    key: 'phone',
    label: 'Teléfono',
    placeholder: '5555-1234',
    type: 'tel',
  },
  {
    key: 'defaultAddress',
    label: 'Dirección de entrega',
    placeholder: '6a Avenida 1-23, Zona 1',
    type: 'text',
  },
  {
    key: 'password',
    label: 'Contraseña',
    placeholder: 'Mínimo 8 caracteres',
    type: 'password',
  },
  {
    key: 'confirmPassword',
    label: 'Confirmar contraseña',
    placeholder: 'Repite tu contraseña',
    type: 'password',
  },
];

export function RegisterFormFields({
  formData,
  errors,
  touched,
  onChange,
  onBlur,
}: RegisterFormFieldsProps) {
  return (
    <div className="space-y-4">
      {FIELDS.map(({ key, label, placeholder, type }) => {
        const hasError = touched[key] && errors[key];

        return (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-heading">
              {label}
            </label>
            <Input
              type={type}
              placeholder={placeholder}
              value={formData[key]}
              onChange={(e) => onChange(key, e.target.value)}
              onBlur={() => onBlur(key)}
              className={hasError ? 'border-red-400 focus:ring-red-300' : ''}
            />
            {hasError && (
              <p className="text-xs text-red-500 mt-0.5">{errors[key]}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}