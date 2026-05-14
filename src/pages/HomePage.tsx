import { Link } from 'react-router-dom';
import { Card, Badge, Button } from '@shared/ui';
import { businessesMock } from '@shared/mocks';
import { formatPrice } from '@shared/lib/formatters';
import { ROUTES, buildRoute } from '@app/router/routes';
import {
  Star,
  Clock,
  Search,
  UtensilsCrossed,
  Pill,
  ShoppingCart,
  Truck,
  HeadphonesIcon,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import type { BusinessCategory } from '@shared/types';

// ===== Datos derivados de los mocks =====

const featuredBusinesses = businessesMock.slice(0, 6);

const categories: {
  id: BusinessCategory;
  label: string;
  icon: typeof UtensilsCrossed;
  description: string;
}[] = [
  {
    id: 'restaurant',
    label: 'Restaurantes',
    icon: UtensilsCrossed,
    description: 'Pide tus platillos favoritos',
  },
  {
    id: 'pharmacy',
    label: 'Farmacias',
    icon: Pill,
    description: 'Medicamentos a tu puerta',
  },
  {
    id: 'supermarket',
    label: 'Supermercados',
    icon: ShoppingCart,
    description: 'Tu despensa en minutos',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/90 to-accent p-8 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium mb-4">
            <Sparkles className="w-3 h-3" />
            <span>Pedidos rápidos. Entrega segura.</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-semibold text-white mb-3 leading-tight">
            Todo lo que necesitas,
            <br />
            a un clic de distancia
          </h1>
          <p className="text-white/90 text-base md:text-lg mb-6">
            
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to={ROUTES.CATALOG}>
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<Search className="w-5 h-5" />}
                className="bg-white text-accent hover:bg-white/90"
              >
                Explorar comercios
              </Button>
            </Link>
            <Link to={ROUTES.ORDERS}>
              <Button
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10 hover:border-white"
              >
                Mis pedidos
              </Button>
            </Link>
          </div>
        </div>

        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2" />
      </section>

      {/* ===== CATEGORÍAS ===== */}
      <section>
        <h2 className="text-2xl font-semibold text-text-heading mb-4">
          ¿Qué estás buscando?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} to={ROUTES.CATALOG}>
                <Card hoverable className="h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent-bg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-heading mb-1">
                        {category.label}
                      </h3>
                      <p className="text-sm text-text">
                        {category.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text/40 mt-3" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== COMERCIOS DESTACADOS ===== */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-text-heading">
              Comercios destacados
            </h2>
            <p className="text-sm text-text mt-1">
              Los favoritos de nuestros usuarios esta semana
            </p>
          </div>
          <Link
            to={ROUTES.CATALOG}
            className="text-sm text-accent hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredBusinesses.map((business) => (
            <Link
              key={business.id}
              to={buildRoute.businessDetail(business.id)}
              className="block"
            >
              <Card
                hoverable
                padding="none"
                className="overflow-hidden h-full flex flex-col"
              >
                {/* Imagen */}
                <div className="aspect-video bg-border/30 overflow-hidden relative">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {business.status !== 'open' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge
                        variant={
                          business.status === 'busy' ? 'warning' : 'danger'
                        }
                        className="text-sm px-3 py-1"
                      >
                        {business.status === 'busy' ? 'Ocupado' : 'Cerrado'}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-text-heading line-clamp-1">
                      {business.name}
                    </h3>
                    {business.status === 'open' && (
                      <Badge variant="success">Abierto</Badge>
                    )}
                  </div>

                  <p className="text-sm text-text mb-3 line-clamp-2 flex-1">
                    {business.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {business.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded bg-border/30 text-text"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs border-t border-border pt-3">
                    <span className="flex items-center gap-1 text-text-heading font-medium">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {business.rating}
                    </span>
                    <span className="flex items-center gap-1 text-text">
                      <Clock className="w-3.5 h-3.5" />
                      {business.deliveryTime}
                    </span>
                    <span className="text-text ml-auto">
                      Envío {formatPrice(business.deliveryFee)}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== CÓMO FUNCIONA ===== */}
      <section className="bg-accent-bg/30 rounded-2xl p-6 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-text-heading mb-2">
            ¿Cómo funciona Mesoquick?
          </h2>
          <p className="text-text">Pedir es así de fácil</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center mx-auto mb-3 text-lg font-semibold">
              1
            </div>
            <h3 className="font-semibold text-text-heading mb-1">
              Elige tu comercio
            </h3>
            <p className="text-sm text-text">
              Explora restaurantes, farmacias y supermercados cerca de ti.
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center mx-auto mb-3 text-lg font-semibold">
              2
            </div>
            <h3 className="font-semibold text-text-heading mb-1">
              Arma tu pedido
            </h3>
            <p className="text-sm text-text">
              Agrega productos al carrito y aplica cupones si los tienes.
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center mx-auto mb-3 text-lg font-semibold">
              3
            </div>
            <h3 className="font-semibold text-text-heading mb-1">
              Recibe en minutos
            </h3>
            <p className="text-sm text-text">
              Rastrea tu pedido en tiempo real hasta que llegue a tu puerta.
            </p>
          </div>
        </div>
      </section>

      {/* ===== BENEFICIOS ===== */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="w-12 h-12 rounded-full bg-accent-bg flex items-center justify-center mx-auto mb-3">
            <Truck className="w-6 h-6 text-accent" />
          </div>
          <h3 className="font-semibold text-text-heading mb-1">
            Entrega rápida
          </h3>
          <p className="text-sm text-text">
            Tus pedidos llegan en 20-45 minutos.
          </p>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 rounded-full bg-accent-bg flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <h3 className="font-semibold text-text-heading mb-1">
            Cupones y promos
          </h3>
          <p className="text-sm text-text">
            Descuentos especiales para tus pedidos favoritos.
          </p>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 rounded-full bg-accent-bg flex items-center justify-center mx-auto mb-3">
            <HeadphonesIcon className="w-6 h-6 text-accent" />
          </div>
          <h3 className="font-semibold text-text-heading mb-1">
            Soporte 24/7
          </h3>
          <p className="text-sm text-text">
            Asistente virtual o agente humano, como prefieras.
          </p>
        </Card>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="text-center py-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-text-heading mb-3">
          ¿Listo para tu primer pedido?
        </h2>
        <p className="text-text mb-6 max-w-md mx-auto">
          Explora cientos de comercios y encuentra exactamente lo que buscas.
        </p>
        <Link to={ROUTES.CATALOG}>
          <Button
            size="lg"
            leftIcon={<Search className="w-5 h-5" />}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Explorar ahora
          </Button>
        </Link>
      </section>
    </div>
  );
}