import React, { useEffect } from 'react';
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
  address: z.string().min(5, 'Address must be at least 5 characters long.'),
  phone: z.string().min(8, 'Phone must be at least 8 digits.'),
  vehicleType: z.enum(['MOTORCYCLE', 'BICYCLE', 'CAR']),
  licensePlate: z.string().min(4, 'License plate is required.')
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const vehicleOptions = [
  { value: 'MOTORCYCLE', label: 'Motorcycle' },
  { value: 'BICYCLE', label: 'Bicycle' },
  { value: 'CAR', label: 'Car' }
];

export const ProfileEditForm: React.FC = () => {
  const profileData = useProfileStore((state) => state.profileData);
  const isLoading = useProfileStore((state) => state.isLoading);
  const isUpdating = useProfileStore((state) => state.isUpdating);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const updateProfile = useProfileStore((state) => state.updateProfile);

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
    } catch (err) {
      // Error handled in store
    }
  };

  if (isLoading) {
    return <div className="p-4 text-primary">Loading profile...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-primary mb-4">Edit Profile</h2>
      
      <InputText label="First Name" {...register('firstName')} disabled className="opacity-50"/>
      <InputText label="Last Name" {...register('lastName')} disabled className="opacity-50"/>
      <InputText label="Email" type="email" {...register('email')} disabled className="opacity-50"/>

      <hr className="border-gray-200 my-2" />
      
      <InputText 
        label="Address" 
        {...register('address')} 
        error={errors.address?.message}
      />
      <InputText 
        label="Phone Number" 
        {...register('phone')} 
        error={errors.phone?.message}
      />
      <SelectDropdown 
        label="Vehicle Type" 
        options={vehicleOptions} 
        {...register('vehicleType')} 
        error={errors.vehicleType?.message}
      />
      <InputText 
        label="License Plate" 
        {...register('licensePlate')} 
        error={errors.licensePlate?.message}
      />

      <Button type="submit" isLoading={isUpdating} className="mt-4">
        Save Changes
      </Button>
    </form>
  );
};
