import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SelectDropdown, Button } from '@mesoquick/ui-kit';
import { useCancelStore } from '../model/useCancelStore';

const cancelSchema = z.object({
  reason: z.enum(['VEHICLE_ISSUE', 'ACCIDENT', 'CUSTOMER_UNAVAILABLE', 'HIGH_RISK_AREA'], {
    message: "Selecciona un motivo válido."
  }),
  details: z.string().min(10, "Debes proporcionar al menos 10 caracteres de detalle.")
});

type CancelFormValues = z.infer<typeof cancelSchema>;

const cancelOptions = [
  { value: 'VEHICLE_ISSUE', label: 'Avería del vehículo' },
  { value: 'ACCIDENT', label: 'Accidente de tránsito' },
  { value: 'CUSTOMER_UNAVAILABLE', label: 'El cliente no responde / No está' },
  { value: 'HIGH_RISK_AREA', label: 'Zona de alto riesgo / Inseguridad' }
];

export const CancelOrderForm: React.FC<{ orderId: string; onSuccess?: () => void }> = ({ orderId, onSuccess }) => {
  const isSubmitting = useCancelStore((state) => state.isSubmitting);
  const cancelOrderAction = useCancelStore((state: any) => state.cancelOrder || (() => Promise.resolve()));

  const { register, handleSubmit, formState: { errors } } = useForm<CancelFormValues>({
    resolver: zodResolver(cancelSchema)
  });

  const onSubmit = async (data: CancelFormValues) => {
    try {
      await cancelOrderAction(orderId, data.reason, data.details);
      if (onSuccess) onSuccess();
    } catch (err) {
      // Error handled by store
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full max-w-md bg-white p-6 rounded-lg shadow-md border border-red-100">
      <div className="border-b border-gray-100 pb-2">
        <h2 className="text-xl font-bold text-red-600">Cancelar Pedido</h2>
        <p className="text-xs font-semibold text-red-500 mt-1 uppercase tracking-wider">
          Atención: Cancelar un pedido injustificadamente puede generar penalizaciones en tu cuenta.
        </p>
      </div>

      <SelectDropdown
        label="Motivo de la cancelación"
        options={cancelOptions}
        {...register('reason')}
        error={errors.reason?.message}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Detalles adicionales</label>
        <textarea
          {...register('details')}
          placeholder="Describe brevemente lo sucedido para nuestra auditoría..."
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all min-h-[100px] text-sm ${
            errors.details ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.details && <span className="text-xs text-red-500 font-medium">{errors.details.message}</span>}
      </div>

      <Button 
        type="submit" 
        variant="danger" 
        isLoading={isSubmitting} 
        className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-200 transition-all active:scale-95"
      >
        Confirmar Cancelación
      </Button>
    </form>
  );
};
