import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form';
import type { ZodType } from 'zod';

/**
 * Adaptador local mínimo entre Zod y react-hook-form.
 *
 * Se escribió a mano en lugar de usar @hookform/resolvers para evitar un
 * conflicto de versiones transitivo: eslint-plugin-react-hooks trae zod 4 al
 * node_modules hoisted del monorepo, mientras que este proyecto usa zod 3.
 * El paquete oficial resuelve zod desde su ruta hoisted y termina tipando
 * contra zod 4, lo que revienta el typecheck.
 *
 * Hacerlo nosotros mismos desde `app-agentes/node_modules/zod` (3.x) hace que
 * compile y corra correctamente sin tocar el package.json raíz del monorepo.
 */
export function zodFormResolver<TValues extends FieldValues>(
  schema: ZodType<TValues>,
): Resolver<TValues> {
  return async (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join('.');
      if (path && !errors[path]) {
        errors[path] = { type: issue.code, message: issue.message };
      }
    }

    return {
      values: {},
      errors: errors as FieldErrors<TValues>,
    };
  };
}
