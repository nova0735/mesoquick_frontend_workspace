import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { InputText, SelectDropdown, Button } from '@mesoquick/ui-kit';
import { useBankStore } from '../model/useBankStore';
import { BankAccountType, UpdateBankAccountRequest } from '../../../entities/banking/model/types';

const bankAccountSchema = z.object({
  bankId: z.string().min(1, 'Por favor selecciona un banco.'),
  accountType: z.enum(['MONETARY', 'SAVINGS'], {
    error: 'Por favor selecciona un tipo de cuenta.'
  }),
  accountNumber: z.string().min(10, 'El número de cuenta debe tener al menos 10 dígitos.')
});

type BankAccountFormValues = z.infer<typeof bankAccountSchema>;

export const BankAccountForm: React.FC = () => {
  const institutions = useBankStore((state) => state.institutions);
  const currentAccount = useBankStore((state) => state.currentAccount);
  const isLoading = useBankStore((state) => state.isLoading);
  const isUpdating = useBankStore((state) => state.isUpdating);
  const initializeData = useBankStore((state) => state.initializeData);
  const updateAccount = useBankStore((state) => state.updateAccount);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BankAccountFormValues>({
    resolver: zodResolver(bankAccountSchema)
  });

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    if (currentAccount) {
      reset({
        bankId: currentAccount.bankId,
        accountType: currentAccount.accountType,
        accountNumber: currentAccount.accountNumber
      });
    }
  }, [currentAccount, reset]);

  const onSubmit = async (data: BankAccountFormValues) => {
    const payload: UpdateBankAccountRequest = {
      bankId: data.bankId,
      accountType: data.accountType as BankAccountType,
      accountNumber: data.accountNumber
    };
    
    try {
      await updateAccount(payload);
    } catch (err) {
      // Error handled by store
    }
  };

  if (isLoading) {
    return <div className="p-4 text-primary">Cargando detalles bancarios...</div>;
  }

  const bankOptions = institutions?.banks.map(bank => ({
    value: bank.id,
    label: bank.name
  })) || [];

  const typeOptions = [
    { value: 'MONETARY', label: 'Monetaria' },
    { value: 'SAVINGS', label: 'Ahorro' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-primary mb-4">Cuenta Bancaria de Liquidación</h2>
      
      <SelectDropdown 
        label="Institución Bancaria" 
        options={bankOptions} 
        {...register('bankId')} 
        error={errors.bankId?.message}
      />

      <SelectDropdown 
        label="Tipo de Cuenta" 
        options={typeOptions} 
        {...register('accountType')} 
        error={errors.accountType?.message}
      />

      <InputText 
        label="Número de Cuenta" 
        type="text" 
        {...register('accountNumber')} 
        error={errors.accountNumber?.message} 
        placeholder="ej. 3049581029"
      />

      <Button type="submit" isLoading={isUpdating} className="mt-4">
        Actualizar Detalles Bancarios
      </Button>
    </form>
  );
};
