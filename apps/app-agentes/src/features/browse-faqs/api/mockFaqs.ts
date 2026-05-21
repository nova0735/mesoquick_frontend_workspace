import type { FaqItem } from '../../../entities/faq';

/**
 * Set local de FAQs mock para el panel de agentes.
 *
 * TODO(backend): cuando exista el endpoint real (probablemente
 * GET /api/agents/faqs), reemplazar este archivo por una llamada vía
 * @mesoquick/core-network. Mantengamos la misma forma de retorno para que el
 * feature `browse-faqs` no tenga que cambiar.
 *
 * Decisión: el mock vive dentro del feature (no en una carpeta /mocks
 * centralizada) para que cada feature pueda migrar a API real de forma
 * independiente, sin acoplarse a otros features.
 */
export const MOCK_FAQS: readonly FaqItem[] = [
  {
    id: 'faq-001',
    category: 'PEDIDOS',
    question: '¿Cómo cancelo un pedido a nombre de un cliente?',
    answer:
      'Desde el detalle del pedido, usa la opción "Cancelar pedido". Solo se permite cancelar mientras el repartidor no haya marcado el pedido como recogido. Después de eso, debes escalar al supervisor para una compensación manual.',
  },
  {
    id: 'faq-002',
    category: 'PEDIDOS',
    question: '¿Qué hago si un cliente reporta un pedido no entregado?',
    answer:
      'Primero verifica el estado del pedido y la última ubicación reportada por el repartidor. Si el repartidor marcó como entregado pero el cliente no lo recibió, abre un caso de investigación y notifica al supervisor del turno.',
  },
  {
    id: 'faq-003',
    category: 'PAGOS',
    question: '¿En cuánto tiempo se reembolsa una compensación?',
    answer:
      'Las compensaciones registradas desde el panel de agentes se aplican al saldo del cliente en menos de 24 horas. Reembolsos a tarjeta toman entre 5 y 10 días hábiles dependiendo del banco emisor.',
  },
  {
    id: 'faq-004',
    category: 'PAGOS',
    question: '¿Puedo modificar el método de pago de un pedido en curso?',
    answer:
      'No. Una vez confirmado el pedido, el método de pago queda bloqueado. Si el cliente necesita cambiarlo, debes cancelar el pedido (si aún es posible) y guiarlo para que lo recree.',
  },
  {
    id: 'faq-005',
    category: 'CUENTA',
    question: '¿Cómo reseteo la contraseña de un cliente desde el panel?',
    answer:
      'Entra al perfil del usuario, sección Seguridad, y selecciona "Enviar enlace de restablecimiento". El cliente recibirá un correo con el link válido por 30 minutos. Nunca pidas la contraseña por chat.',
  },
  {
    id: 'faq-006',
    category: 'CUENTA',
    question: '¿Qué pasa cuando bloqueo a un usuario?',
    answer:
      'El usuario bloqueado no puede iniciar sesión ni crear pedidos nuevos. Sus pedidos en curso se completan con normalidad. El bloqueo queda registrado en su historial con tu ID de agente y motivo.',
  },
  {
    id: 'faq-007',
    category: 'REPARTIDORES',
    question: '¿Cómo consulto el saldo y los pedidos asignados a un repartidor?',
    answer:
      'Desde la consulta de usuario selecciona el rol "Repartidor" e ingresa su ID o nombre. El detalle muestra saldo actual, pedidos en curso y pedidos completados de las últimas 24 horas.',
  },
  {
    id: 'faq-008',
    category: 'REPARTIDORES',
    question: '¿Qué hago si un repartidor reporta una tarifa incorrecta?',
    answer:
      'Pídele evidencia (captura del pedido y la ruta). Verifica la distancia calculada en el detalle del pedido. Si la diferencia supera el 10%, registra una decisión de tarifa con el ajuste correspondiente.',
  },
  {
    id: 'faq-009',
    category: 'RESTAURANTES',
    question: '¿Cómo reporto un restaurante con menú desactualizado?',
    answer:
      'Usa la herramienta administrativa "Reportar restaurante" e indica el motivo "Menú desactualizado". El equipo de operaciones contacta al restaurante en un máximo de 48 horas.',
  },
  {
    id: 'faq-010',
    category: 'SOPORTE',
    question: '¿Cuándo debo escalar un caso al supervisor?',
    answer:
      'Escala cuando: (1) el monto de compensación excede tu límite asignado, (2) hay sospecha de fraude, (3) el cliente solicita explícitamente hablar con un supervisor, o (4) el caso involucra a más de un usuario afectado.',
  },
  {
    id: 'faq-011',
    category: 'SOPORTE',
    question: '¿Dónde encuentro el directorio interno de contactos?',
    answer:
      'En la sección "Directorio" del panel lateral. Allí están los teléfonos y correos de soporte interno: operaciones, supervisores, finanzas y el equipo legal de turno.',
  },
];
