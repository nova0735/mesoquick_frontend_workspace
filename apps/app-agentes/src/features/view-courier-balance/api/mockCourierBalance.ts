import type { CourierBalance } from '../../../entities/support-user';

/**
 * Saldos mock por repartidor.
 *
 * TODO(backend): reemplazar por GET /api/support/couriers/{id}/balance.
 * El contrato debe alinearse con el servicio de liquidaciones. Moneda fija
 * en HNL por ahora — si el servicio soporta multi-país, ampliar el tipo.
 */
export const MOCK_COURIER_BALANCES: readonly CourierBalance[] = [
  {
    courierId: 'courier-201',
    available: 1850.5,
    inTransit: 420.0,
    currency: 'HNL',
    recentMovements: [
      {
        id: 'mov-201-1',
        date: '2026-04-13T22:00:00.000Z',
        concept: 'Liquidación diaria',
        amount: 740.0,
      },
      {
        id: 'mov-201-2',
        date: '2026-04-12T22:00:00.000Z',
        concept: 'Liquidación diaria',
        amount: 615.25,
      },
      {
        id: 'mov-201-3',
        date: '2026-04-11T22:00:00.000Z',
        concept: 'Bono por desempeño',
        amount: 150.0,
      },
    ],
  },
  {
    courierId: 'courier-202',
    available: 980.75,
    inTransit: 165.0,
    currency: 'HNL',
    recentMovements: [
      {
        id: 'mov-202-1',
        date: '2026-04-13T22:00:00.000Z',
        concept: 'Liquidación diaria',
        amount: 480.5,
      },
      {
        id: 'mov-202-2',
        date: '2026-04-10T22:00:00.000Z',
        concept: 'Liquidación diaria',
        amount: 320.0,
      },
    ],
  },
  {
    courierId: 'courier-203',
    available: 120.0,
    inTransit: 0,
    currency: 'HNL',
    recentMovements: [
      {
        id: 'mov-203-1',
        date: '2026-04-08T22:00:00.000Z',
        concept: 'Liquidación diaria',
        amount: 260.0,
      },
      {
        id: 'mov-203-2',
        date: '2026-04-07T22:00:00.000Z',
        concept: 'Descuento por incidente',
        amount: -180.0,
      },
    ],
  },
];
