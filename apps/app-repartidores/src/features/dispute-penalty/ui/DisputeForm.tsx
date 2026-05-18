import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SelectDropdown, InputText, Button } from '@mesoquick/ui-kit';
import { useDisputeStore } from '../model/useDisputeStore';

const disputeSchema = z.object({
  reason: z.enum(['MERCHANT_DELAY', 'CLIENT_NO_SHOW', 'SYSTEM_ERROR'], {
    errorMap: () => ({ message: "Selecciona un motivo" })
  }),
  details: z.string().min(10, "Explica con más detalle (mín. 10 caracteres)")
});

type DisputeFormValues = z.infer<typeof disputeSchema>;

const reasonOptions = [
  { value: 'MERCHANT_DELAY', label: 'Retraso del Comercio' },
  { value: 'CLIENT_NO_SHOW', label: 'Cliente no apareció' },
  { value: 'SYSTEM_ERROR', label: 'Error de la Aplicación' }
];

export const DisputeForm: React.FC = () => {
  const { isSubmitting, submitDispute, error } = useDisputeStore();
  const [file, setFile] = React.useState<File | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<DisputeFormValues>({
    resolver: zodResolver(disputeSchema)
  });

  const onSubmit = async (data: DisputeFormValues) => {
    try {
      // Nota: El store espera un CreateDisputeRequest y opcionalmente un File
      await submitDispute({
        reason: data.reason,
        description: data.details,
      }, file || undefined);
      reset();
      setFile(null);
    } catch (err) {
      // Error manejado por el store
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <h2 className="text-xl font-bold text-primary">Disputar Penalización</h2>
      
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      <SelectDropdown
        label="Motivo de la disputa"
        options={reasonOptions}
        {...register('reason')}
        error={errors.reason?.message}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Detalles adicionales</label>
        <textarea
          {...register('details')}
          placeholder="Describe lo ocurrido..."
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all min-h-[100px] text-sm ${
            errors.details ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.details && <span className="text-xs text-red-500 font-medium">{errors.details.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Evidencia Fotográfica (Opcional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
        />
      </div>

      <Button type="submit" variant="primary" isLoading={isSubmitting} className="mt-2">
        Enviar Disputa
      </Button>
    </form>
  );
};
