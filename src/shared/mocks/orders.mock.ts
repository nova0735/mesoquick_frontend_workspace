import type { Order } from '@shared/types';

export const ordersMock: Order[] = [
  {
    id: 'order-001',
    userId: 'user-001',
    businessId: 'biz-001',
    businessName: 'La Tortilla Feliz',
    status: 'on_the_way',
    paymentMethod: 'credit_card',
    deliveryAddress: 'Zona 10, 5ta avenida 12-34',
    items: [
      {
        productId: 'prod-001',
        productName: 'Pepián',
        quantity: 2,
        price: 65,
        subtotal: 130,
      },
      {
        productId: 'prod-004',
        productName: 'Horchata',
        quantity: 2,
        price: 15,
        subtotal: 30,
      },
    ],
    subtotal: 160,
    deliveryFee: 15,
    discount: 0,
    total: 175,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // hace 25 min
    estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // en 15 min
  },
  {
    id: 'order-002',
    userId: 'user-001',
    businessId: 'biz-003',
    businessName: 'Burger Republic',
    status: 'preparing',
    paymentMethod: 'cash',
    deliveryAddress: 'Zona 10, 5ta avenida 12-34',
    items: [
      {
        productId: 'prod-008',
        productName: 'Classic Burger',
        quantity: 1,
        price: 75,
        subtotal: 75,
      },
      {
        productId: 'prod-010',
        productName: 'Papas a la francesa',
        quantity: 1,
        price: 25,
        subtotal: 25,
      },
    ],
    subtotal: 100,
    deliveryFee: 12,
    discount: 10,
    total: 102,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
    couponCode: 'BIENVENIDO10',
  },
  {
    id: 'order-003',
    userId: 'user-001',
    businessId: 'biz-006',
    businessName: 'Farmacia Galeno',
    status: 'delivered',
    paymentMethod: 'debit_card',
    deliveryAddress: 'Zona 10, 5ta avenida 12-34',
    items: [
      {
        productId: 'prod-013',
        productName: 'Acetaminofén 500mg',
        quantity: 1,
        price: 18,
        subtotal: 18,
      },
      {
        productId: 'prod-015',
        productName: 'Alcohol gel 250ml',
        quantity: 2,
        price: 28,
        subtotal: 56,
      },
    ],
    subtotal: 74,
    deliveryFee: 10,
    discount: 0,
    total: 84,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // hace 2 días
    estimatedDelivery: new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000
    ).toISOString(),
  },
  {
    id: 'order-004',
    userId: 'user-001',
    businessId: 'biz-009',
    businessName: 'Súper Económico',
    status: 'cancelled',
    paymentMethod: 'cash',
    deliveryAddress: 'Zona 10, 5ta avenida 12-34',
    items: [
      {
        productId: 'prod-016',
        productName: 'Leche entera 1L',
        quantity: 3,
        price: 12,
        subtotal: 36,
      },
      {
        productId: 'prod-017',
        productName: 'Huevos blancos x12',
        quantity: 1,
        price: 35,
        subtotal: 35,
      },
    ],
    subtotal: 71,
    deliveryFee: 20,
    discount: 0,
    total: 91,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000
    ).toISOString(),
  },
];