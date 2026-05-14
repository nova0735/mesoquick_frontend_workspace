import { Button, Card, Input, Badge, Spinner, EmptyState } from '@shared/ui';
import { Search, ShoppingBag } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-semibold text-text-heading mb-2">
          Bienvenido a Mesoquick
        </h1>
        <p className="text-text">
          Showcase temporal de componentes — esto se reemplaza luego.
        </p>
      </section>

      {/* Botones */}
      <Card>
        <h2 className="text-xl font-semibold text-text-heading mb-4">Botones</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primario</Button>
          <Button variant="secondary">Secundario</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button isLoading>Cargando</Button>
          <Button leftIcon={<ShoppingBag className="w-4 h-4" />}>
            Con ícono
          </Button>
        </div>
      </Card>

      {/* Inputs */}
      <Card>
        <h2 className="text-xl font-semibold text-text-heading mb-4">Inputs</h2>
        <div className="space-y-4 max-w-md">
          <Input label="Email" placeholder="tu@email.com" />
          <Input
            label="Búsqueda"
            placeholder="Buscar..."
            leftIcon={<Search className="w-4 h-4" />}
          />
          <Input
            label="Con error"
            placeholder="Algo está mal"
            error="Este campo es obligatorio"
          />
        </div>
      </Card>

      {/* Badges */}
      <Card>
        <h2 className="text-xl font-semibold text-text-heading mb-4">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="success">Abierto</Badge>
          <Badge variant="warning">En preparación</Badge>
          <Badge variant="danger">Cerrado</Badge>
          <Badge variant="accent">En camino</Badge>
        </div>
      </Card>

      {/* Spinner y EmptyState */}
      <Card>
        <h2 className="text-xl font-semibold text-text-heading mb-4">
          Spinner y Empty State
        </h2>
        <div className="flex items-center gap-6">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
        <EmptyState
          icon={<ShoppingBag className="w-12 h-12" />}
          title="Tu carrito está vacío"
          description="Agrega productos desde el catálogo para comenzar."
          action={<Button>Explorar comercios</Button>}
        />
      </Card>
    </div>
  );
}