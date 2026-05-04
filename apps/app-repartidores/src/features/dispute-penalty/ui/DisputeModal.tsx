import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, InputText } from '@mesoquick/ui-kit';
import { useDisputeStore } from '../model/useDisputeStore';

const disputeSchema = z.object({
  ticketTitle: z.string().min(5, 'Title is too short.'),
  detail: z.string().min(20, 'Please provide more details (at least 20 chars).')
});

type DisputeFormValues = z.infer<typeof disputeSchema>;

export interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({ isOpen, onClose }) => {
  const isSubmitting = useDisputeStore((state) => state.isSubmitting);
  const ticketId = useDisputeStore((state) => state.ticketId);
  const submitDispute = useDisputeStore((state) => state.submitDispute);
  const resetState = useDisputeStore((state) => state.resetState);

  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DisputeFormValues>({
    resolver: zodResolver(disputeSchema)
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      resetState();
      setEvidenceFile(null);
    }
  }, [isOpen, reset, resetState]);

  if (!isOpen) return null;

  const onSubmit = async (data: DisputeFormValues) => {
    try {
      await submitDispute({ ticketTitle: data.ticketTitle, detail: data.detail }, evidenceFile || undefined);
    } catch (err) {}
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEvidenceFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        {ticketId ? (
          <div className="text-center flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-green-600">Dispute Filed</h2>
            <p className="text-primary font-medium">Your reference ticket is:</p>
            <span className="text-xl font-mono bg-gray-100 py-2 rounded-lg">{ticketId}</span>
            <p className="text-primary/70 text-sm">An agent will review the evidence and contact you shortly.</p>
            <Button variant="primary" onClick={onClose} className="mt-2">Done</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-primary">Dispute a Penalty</h2>
            
            <InputText label="Ticket Title" placeholder="e.g., Unfair cancellation penalty ORD-123" disabled={isSubmitting} {...register('ticketTitle')} error={errors.ticketTitle?.message}/>
            
            <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-semibold text-primary">Detailed Explanation</label>
              <textarea 
                className={`px-3 py-2 rounded-lg border outline-none transition-colors bg-base text-primary min-h-[100px] resize-none ${errors.detail ? 'border-red-500' : 'border-primary/50'}`}
                placeholder="Explain the context..."
                disabled={isSubmitting}
                {...register('detail')}
              />
              {errors.detail && <span className="mt-1 text-xs text-red-500">{errors.detail.message}</span>}
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-semibold text-primary">Photographic Evidence</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                disabled={isSubmitting}
                className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#eaf4eb] file:text-[#3c606b] hover:file:bg-[#d5ebd7]"
              />
              {evidenceFile && <span className="text-xs text-green-600 mt-1">File attached: {evidenceFile.name}</span>}
            </div>
            
            <div className="flex gap-3 mt-4">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting} className="w-full">Cancel</Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">Submit Dispute</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
