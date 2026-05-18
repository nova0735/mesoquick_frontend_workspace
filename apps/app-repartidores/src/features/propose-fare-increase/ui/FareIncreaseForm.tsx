import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SelectDropdown, InputText, Button } from '@mesoquick/ui-kit';

// Asumimos un store para el aumento de tarifa similar a los otros features de soporte
// Por brevedad, si no existe el store, se define una acción local o se deja para integración futura
// Pero cumpliremos con el contrato de UI solicitado.

const fareSchema = z.object({
  reason: z.enum(['HEAVY_TRAFFIC', 'BAD_WEATHER', 'WRONG_ADDRESS'], {
    errorMap: () => ({ message: "Selecciona una justificación" })
  }),
  requestedAmount: z.preprocess(
    (val) => Number(val),
    z.number({ invalid_type_error: "Debes ingresar un número" })
     .min(5, "El monto extra debe ser al menos Q5.00")
  )
});

type FareFormValues = z.infer<typeof fareSchema>;

const fareOptions = [
  { value: 'HEAVY_TRAFFIC', label: 'Tráfico Pesado / Bloqueos' },
  { value: 'BAD_WEATHER', label: 'Mal Clima / Lluvia Fuerte' },
  { value: 'WRONG_ADDRESS', label: 'Dirección Incorrecta / Desvío' }
];

export const FareIncreaseForm: React.FC<{ orderId?: string }> = ({ orderId }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FareFormValues>({
    resolver: zodResolver(fareSchema),
    defaultValues: {
      requestedAmount: 5
    }
  });

  const onSubmit = async (data: FareFormValues) => {
    setIsSubmitting(true);
    try {
      console.log(`Solicitando aumento de Q${data.requestedAmount} para orden ${orderId} por ${data.reason}`);
      // Simulación de llamada API
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Solicitud de aumento enviada exitosamente.");
      reset();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <h2 className="text-xl font-bold text-primary">Solicitar Aumento de Tarifa</h2>
      <p className="text-sm text-gray-500 mb-2">Justifica el incremento basado en condiciones externas en ruta.</p>

      <SelectDropdown
        label="Justificación"
        options={fareOptions}
        {...register('reason')}
        error={errors.reason?.message}
      />

      <InputText
        label="Monto Extra (GTQ)"
        type="number"
        {...register('requestedAmount')}
        error={errors.requestedAmount?.message}
        placeholder="ej. 10.00"
      />

      <Button type="submit" variant="primary" isLoading={isSubmitting} className="mt-2 bg-green-600 hover:bg-green-700">
        Solicitar Aumento
      </Button>
    </form>
  );
};
