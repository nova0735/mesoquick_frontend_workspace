import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { InputText, Button } from '@mesoquick/ui-kit';
import { usePasswordStore } from '../model/usePasswordStore';
import { UpdatePasswordRequest } from '../api/password.api';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es obligatoria.'),
  newPassword: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres.')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula.')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número.'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden.",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export const UpdatePasswordForm: React.FC = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  
  const isUpdating = usePasswordStore((state) => state.isUpdating);
  const changePassword = usePasswordStore((state) => state.changePassword);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = async (data: PasswordFormValues) => {
    const payload: UpdatePasswordRequest = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    };
    
    try {
      await changePassword(payload);
      reset(); // Reset fields on HTTP 200
    } catch (err) {
      // Error state is handled by the store
    }
  };

  const toggleVisibility = (setter: React.Dispatch<React.SetStateAction<boolean>>, current: boolean) => {
    return (
      <button 
        type="button" 
        onClick={() => setter(!current)}
        className="absolute right-3 top-[34px] text-primary hover:text-primary/70 transition-colors"
      >
        {current ? <EyeOff size={20}/> : <Eye size={20}/>}
      </button>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-primary mb-4">Configuración de Seguridad</h2>
      
      <div className="relative">
        <InputText 
          label="Contraseña Actual" 
          type={showCurrent ? "text" : "password"} 
          {...register('currentPassword')} 
          error={errors.currentPassword?.message}
        />
        {toggleVisibility(setShowCurrent, showCurrent)}
      </div>

      <div className="relative">
        <InputText 
          label="Nueva Contraseña" 
          type={showNew ? "text" : "password"} 
          {...register('newPassword')} 
          error={errors.newPassword?.message}
        />
        {toggleVisibility(setShowNew, showNew)}
      </div>

      <div className="relative">
        <InputText 
          label="Confirmar Nueva Contraseña" 
          type={showNew ? "text" : "password"} 
          {...register('confirmPassword')} 
          error={errors.confirmPassword?.message}
        />
      </div>

      <Button type="submit" isLoading={isUpdating} className="mt-4">
        Actualizar Contraseña
      </Button>
    </form>
  );
};
