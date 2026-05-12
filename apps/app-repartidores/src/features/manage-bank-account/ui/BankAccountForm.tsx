import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { InputText, SelectDropdown, Button } from '@mesoquick/ui-kit';
import { useBankStore } from '../model/useBankStore';
import { BankAccountType, UpdateBankAccountRequest } from '../../../entities/banking/model/types';

const bankAccountSchema = z.object({
  bankId: z.string().min(1, 'Please select a bank.'),
  accountType: z.enum(['MONETARY', 'SAVINGS'], {
    error: 'Please select an account type.'
  }),
  accountNumber: z.string().min(10, 'Account number must be at least 10 digits.')
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
    return <div className="p-4 text-primary">Loading banking details...</div>;
  }

  const bankOptions = institutions?.banks.map(bank => ({
    value: bank.id,
    label: bank.name
  })) || [];

  const typeOptions = institutions?.accountTypes.map(type => ({
    value: type,
    label: type.charAt(0) + type.slice(1).toLowerCase()
  })) || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-primary mb-4">Settlement Bank Account</h2>
      
      <SelectDropdown 
        label="Bank Institution" 
        options={bankOptions} 
        {...register('bankId')} 
        error={errors.bankId?.message}
      />

      <SelectDropdown 
        label="Account Type" 
        options={typeOptions} 
        {...register('accountType')} 
        error={errors.accountType?.message}
      />

      <InputText 
        label="Account Number" 
        type="text" 
        {...register('accountNumber')} 
        error={errors.accountNumber?.message} 
        placeholder="e.g., 3049581029"
      />

      <Button type="submit" isLoading={isUpdating} className="mt-4">
        Update Bank Details
      </Button>
    </form>
  );
};
