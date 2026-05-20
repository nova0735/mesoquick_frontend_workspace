import { z } from 'zod';

/**
 * Validación del campo de texto del composer. Coherente con la convención del
 * resto del módulo (loginSchema, etc.): mínimo no vacío, máximo razonable.
 */
export const messageSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'El mensaje no puede estar vacío.')
    .max(2000, 'Máximo 2000 caracteres por mensaje.'),
});

export type MessageFormValues = z.infer<typeof messageSchema>;
