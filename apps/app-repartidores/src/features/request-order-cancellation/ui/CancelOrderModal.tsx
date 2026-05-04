import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@mesoquick/ui-kit';
import { useCancelStore } from '../model/useCancelStore';

const cancelSchema = z.object({
  reason: z.string().min(20, 'Reason must be at least 20 characters long to justify the cancellation.')
});

type CancelFormValues = z.infer<typeof cancelSchema>;

export interface CancelOrderModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ orderId, isOpen, onClose }) => {
  const isSubmitting = useCancelStore((state) => state.isSubmitting);
  const isSuccess = useCancelStore((state) => state.isSuccess);
  const submitCancellation = useCancelStore((state) => state.submitCancellation);
  const resetState = useCancelStore((state) => state.resetState);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CancelFormValues>({
    resolver: zodResolver(cancelSchema)
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      resetState();
    }
  }, [isOpen, reset, resetState]);

  if (!isOpen) return null;

  const onSubmit = async (data: CancelFormValues) => {
    try {
      await submitCancellation({ orderId, reason: data.reason });
    } catch (err) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        {isSuccess ? (
          <div className="text-center flex flex-col gap-4">
            <h2 className="text-xl font-bold text-green-600">Request Received</h2>
            <p className="text-primary text-sm">An agent is reviewing your cancellation request to determine if penalties apply.</p>
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-red-500">Request Order Cancellation</h2>
            <p className="text-xs text-primary/70 mb-2">Warning: Unauthorized cancellations may result in account penalties.</p>
            
            <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-semibold text-primary">Justification</label>
              <textarea 
                className={`px-3 py-2 rounded-lg border outline-none transition-colors bg-base text-primary min-h-[100px] resize-none ${errors.reason ? 'border-red-500' : 'border-primary/50'}`}
                placeholder="Explain in detail why you need to cancel this order..."
                disabled={isSubmitting}
                {...register('reason')}
              />
              {errors.reason && <span className="mt-1 text-xs text-red-500">{errors.reason.message}</span>}
            </div>
            
            <div className="flex gap-3 mt-2">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting} className="w-full">Abort</Button>
              <Button type="submit" variant="danger" isLoading={isSubmitting} className="w-full">Submit Request</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
