import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { InputText, SelectDropdown, Button } from '@mesoquick/ui-kit';
import { useProfileStore } from '../model/useProfileStore';
import { UpdateProfileRequest } from '../../../entities/courier/model/types';

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres.'),
  phone: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos.'),
  vehicleType: z.enum(['MOTORCYCLE', 'BICYCLE', 'CAR']),
  licensePlate: z.string().min(4, 'La placa es obligatoria.')
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const vehicleOptions = [
  { value: 'MOTORCYCLE', label: 'Motocicleta' },
  { value: 'BICYCLE', label: 'Bicicleta' },
  { value: 'CAR', label: 'Automóvil' }
];

export const ProfileEditForm: React.FC = () => {
  const profileData = useProfileStore((state) => state.profileData);
  const isLoading = useProfileStore((state) => state.isLoading);
  const isUpdating = useProfileStore((state) => state.isUpdating);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  
  const [successMsg, setSuccessMsg] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema)
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profileData) {
      reset({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        address: profileData.address,
        phone: profileData.phone,
        vehicleType: profileData.vehicleType,
        licensePlate: profileData.licensePlate
      });
    }
  }, [profileData, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    const payload: UpdateProfileRequest = {
      address: data.address,
      phone: data.phone,
      vehicleType: data.vehicleType,
      licensePlate: data.licensePlate
    };
    
    try {
      await updateProfile(payload);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err) {
      // Error handled in store
    }
  };

  if (isLoading) {
    return <div className="p-4 text-primary">Cargando perfil...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-primary mb-4">Editar Perfil</h2>
      
      {successMsg && (
        <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 font-medium border border-green-200">
          ✅ Perfil actualizado correctamente.
        </div>
      )}

      <InputText label="Nombre" {...register('firstName')} disabled className="opacity-50"/>
      <InputText label="Apellido" {...register('lastName')} disabled className="opacity-50"/>
      <InputText label="Correo Electrónico" type="email" {...register('email')} disabled className="opacity-50"/>

      <hr className="border-gray-200 my-2" />
      
      <InputText 
        label="Dirección" 
        {...register('address')} 
        error={errors.address?.message}
      />
      <InputText 
        label="Número de Teléfono" 
        {...register('phone')} 
        error={errors.phone?.message}
      />
      <SelectDropdown 
        label="Tipo de Vehículo" 
        options={vehicleOptions} 
        {...register('vehicleType')} 
        error={errors.vehicleType?.message}
      />
      <InputText 
        label="Placa" 
        {...register('licensePlate')} 
        error={errors.licensePlate?.message}
      />

      <Button type="submit" isLoading={isUpdating} className="mt-4">
        Guardar Cambios
      </Button>
    </form>
  );
};
