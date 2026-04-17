import { z } from 'zod';

/**
 * Validación de formulario de login con Zod.
 * El resolver de react-hook-form consume este schema directamente.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es obligatorio.')
    .email('Ingresa un correo válido.'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria.')
    .min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
