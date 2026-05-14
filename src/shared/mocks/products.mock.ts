import type { Product } from '@shared/types';

export const productsMock: Product[] = [
  // ===== LA TORTILLA FELIZ (biz-001) =====
  {
    id: 'prod-001',
    businessId: 'biz-001',
    name: 'Pepián',
    description: 'Estofado tradicional con pollo, res y verduras en salsa de semillas.',
    price: 65,
    image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=600',
    category: 'Platos fuertes',
    available: true,
  },
  {
    id: 'prod-002',
    businessId: 'biz-001',
    name: 'Kak ik',
    description: 'Caldo rojo de pavo con especias mayas. Servido con tamalitos.',
    price: 75,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600',
    category: 'Platos fuertes',
    available: true,
  },
  {
    id: 'prod-003',
    businessId: 'biz-001',
    name: 'Chiles rellenos',
    description: 'Chiles pimientos rellenos de carne molida y verduras.',
    price: 45,
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600',
    category: 'Antojitos',
    available: true,
  },
  {
    id: 'prod-004',
    businessId: 'biz-001',
    name: 'Horchata',
    description: 'Bebida tradicional de arroz con canela.',
    price: 15,
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600',
    category: 'Bebidas',
    available: true,
  },

  // ===== SUSHI SAKURA (biz-002) =====
  {
    id: 'prod-005',
    businessId: 'biz-002',
    name: 'California Roll',
    description: '8 piezas con cangrejo, aguacate y pepino. Con semillas de ajonjolí.',
    price: 85,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600',
    category: 'Rolls',
    available: true,
  },
  {
    id: 'prod-006',
    businessId: 'biz-002',
    name: 'Tempura Roll',
    description: '8 piezas de camarón empanizado con salsa de anguila.',
    price: 110,
    image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600',
    category: 'Rolls',
    available: true,
  },
  {
    id: 'prod-007',
    businessId: 'biz-002',
    name: 'Combo Sakura',
    description: 'Selección de 24 piezas variadas. Perfecto para compartir.',
    price: 280,
    image: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?w=600',
    category: 'Combos',
    available: true,
  },

  // ===== BURGER REPUBLIC (biz-003) =====
  {
    id: 'prod-008',
    businessId: 'biz-003',
    name: 'Classic Burger',
    description:
      'Hamburguesa angus con queso cheddar, lechuga, tomate y salsa especial.',
    price: 75,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
    category: 'Hamburguesas',
    available: true,
  },
  {
    id: 'prod-009',
    businessId: 'biz-003',
    name: 'BBQ Bacon Burger',
    description: 'Doble carne, tocino crujiente, queso y salsa BBQ casera.',
    price: 95,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600',
    category: 'Hamburguesas',
    available: true,
  },
  {
    id: 'prod-010',
    businessId: 'biz-003',
    name: 'Papas a la francesa',
    description: 'Papas crujientes acompañadas de ketchup y mayonesa.',
    price: 25,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600',
    category: 'Acompañamientos',
    available: true,
  },

  // ===== PIZZA NAPOLITANA (biz-004) =====
  {
    id: 'prod-011',
    businessId: 'biz-004',
    name: 'Pizza Margherita',
    description: 'Salsa de tomate, mozzarella di bufala y albahaca fresca.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600',
    category: 'Pizzas',
    available: true,
  },
  {
    id: 'prod-012',
    businessId: 'biz-004',
    name: 'Pizza Pepperoni',
    description: 'Salsa de tomate, mozzarella y pepperoni italiano.',
    price: 135,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600',
    category: 'Pizzas',
    available: true,
  },

  // ===== FARMACIA GALENO (biz-006) =====
  {
    id: 'prod-013',
    businessId: 'biz-006',
    name: 'Acetaminofén 500mg',
    description: 'Caja con 20 tabletas. Para dolor y fiebre.',
    price: 18,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600',
    category: 'Medicamentos',
    available: true,
  },
  {
    id: 'prod-014',
    businessId: 'biz-006',
    name: 'Ibuprofeno 400mg',
    description: 'Caja con 10 tabletas. Antiinflamatorio.',
    price: 22,
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600',
    category: 'Medicamentos',
    available: true,
  },
  {
    id: 'prod-015',
    businessId: 'biz-006',
    name: 'Alcohol gel 250ml',
    description: 'Antibacterial al 70%. Frasco con dispensador.',
    price: 28,
    image: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=600',
    category: 'Cuidado personal',
    available: true,
  },

  // ===== SÚPER ECONÓMICO (biz-009) =====
  {
    id: 'prod-016',
    businessId: 'biz-009',
    name: 'Leche entera 1L',
    description: 'Leche pasteurizada. Marca Foremost.',
    price: 12,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600',
    category: 'Lácteos',
    available: true,
  },
  {
    id: 'prod-017',
    businessId: 'biz-009',
    name: 'Huevos blancos x12',
    description: 'Docena de huevos frescos.',
    price: 35,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600',
    category: 'Lácteos',
    available: true,
  },
  {
    id: 'prod-018',
    businessId: 'biz-009',
    name: 'Pan blanco grande',
    description: 'Pan de molde rebanado. 680g.',
    price: 22,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600',
    category: 'Panadería',
    available: true,
  },
];

/**
 * Helper: obtiene productos de un comercio específico.
 */
export function getProductsByBusinessId(businessId: string): Product[] {
  return productsMock.filter((p) => p.businessId === businessId);
}