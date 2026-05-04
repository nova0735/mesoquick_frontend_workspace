import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, InputText, SelectDropdown } from '@mesoquick/ui-kit';
import { useFareStore } from '../model/useFareStore';
import { TariffIncreaseReason, ProposeTariffRequest } from '../../../entities/support/model/types';

const fareSchema = z.object({
  reason: z.string().min(1, 'Please select a valid reason.'),
  proposedIncrease: z.number().min(1, 'Increase must be greater than 0.')
});

type FareFormValues = z.infer<typeof fareSchema>;

export interface FareIncreaseModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const FareIncreaseModal: React.FC<FareIncreaseModalProps> = ({ orderId, isOpen, onClose }) => {
  const isSubmitting = useFareStore((state) => state.isSubmitting);
  const isSuccess = useFareStore((state) => state.isSuccess);
  const submitProposal = useFareStore((state) => state.submitProposal);
  const resetState = useFareStore((state) => state.resetState);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FareFormValues>({
    resolver: zodResolver(fareSchema)
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      resetState();
    }
  }, [isOpen, reset, resetState]);

  if (!isOpen) return null;

  const onSubmit = async (data: FareFormValues) => {
    const payload: ProposeTariffRequest = {
      orderId,
      reason: data.reason as TariffIncreaseReason,
      proposedIncrease: data.proposedIncrease
    };
    try {
      await submitProposal(payload);
    } catch (err) {}
  };

  const reasonOptions = [
    { value: 'CLIMATE', label: 'Adverse Climate' },
    { value: 'TRAFFIC', label: 'Heavy Traffic' },
    { value: 'SCHEDULE', label: 'Night/Holiday Schedule' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        {isSuccess ? (
          <div className="text-center flex flex-col gap-4">
            <h2 className="text-xl font-bold text-green-600">Proposal Submitted</h2>
            <p className="text-primary text-sm">Your request is in "Pending Approval" state. Please wait for an agent's resolution.</p>
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-primary">Propose Fare Increase</h2>
            <p className="text-xs text-primary/70">Request an adjustment to the base fare due to operational difficulties.</p>
            
            <SelectDropdown label="Select Reason" options={reasonOptions} {...register('reason')} error={errors.reason?.message} disabled={isSubmitting}/>
            <InputText label="Proposed Extra Amount (GTQ)" type="number" step="0.01" {...register('proposedIncrease', { valueAsNumber: true })} error={errors.proposedIncrease?.message} disabled={isSubmitting}/>
            
            <div className="flex gap-3 mt-2">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting} className="w-full">Cancel</Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">Submit</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
