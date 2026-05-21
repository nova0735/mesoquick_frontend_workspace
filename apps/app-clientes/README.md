---

## Inicio rápido

### Requisitos

- Node.js 18+
- npm 9+

### Instalación

```bash
# Clonar el repo
git clone https://github.com/AngelOvalle29/mesoquick-app-clientes.git
cd mesoquick-app-clientes

# Instalar dependencias
npm install

# Levantar el servidor de desarrollo
npm run dev
```

La aplicación se abre en `http://localhost:5173`.

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta ESLint |

---

## Equipo y distribución de trabajo

El equipo está compuesto por 4 integrantes. Cada uno es responsable de una vertical completa para evitar conflictos en Git.

| Persona | Rama | Responsabilidades |
|---------|------|-------------------|
| **Heather (Líder técnica)** | `main` | `app/`, `shared/`, `features/support/`, layouts, sistema de diseño, revisión de PRs |
| **Persona 1** | `feature/catalogo` | `features/catalog/`, `CatalogPage`, `BusinessDetailPage` |
| **Persona 2** | `feature/cart-checkout` | `features/cart/`, `features/checkout/`, regla de un solo comercio |
| **Persona 3** | `feature/orders-auth` | `features/orders/`, `features/auth/`, tracking en tiempo real, registro |

---

## Flujo de Git

### Reglas generales

1. **Nadie hace push directo a `main`.** Todo cambio entra por Pull Request.
2. **Cada quien trabaja en su rama asignada** (no en `main`, no en la rama de otro).
3. **Antes de empezar cada día:** `git pull origin main` para traer lo último.
4. **PRs pequeños y frecuentes** son mejores que PRs gigantes.
5. **Los archivos compartidos** (`shared/`, `app/router/`, `app/layouts/`) los modifica solo la líder técnica.

### Cómo empezar a trabajar (compañeros)

```bash
# 1. Clonar el repo
git clone https://github.com/AngelOvalle29/mesoquick-app-clientes.git
cd mesoquick-app-clientes
npm install

# 2. Asegurarse de tener lo último de main
git checkout main
git pull origin main

# 3. Cambiarse a la rama asignada
git checkout feature/[tu-rama]

# 4. Sincronizar la rama con lo último de main
git merge main

# 5. Trabajar normal, hacer commits
git add .
git commit -m "feat(area): descripción clara"
git push origin feature/[tu-rama]

# 6. Abrir Pull Request en GitHub hacia main
```

### Convención de mensajes de commit

Usamos **Conventional Commits**:

- `feat(area): descripción` — Nueva funcionalidad
- `fix(area): descripción` — Corrección de bug
- `refactor(area): descripción` — Reorganización sin cambiar comportamiento
- `style(area): descripción` — Cambios visuales o de formato
- `docs(area): descripción` — Documentación
- `chore(area): descripción` — Configuración, dependencias

Ejemplos:
- `feat(catalog): agrega BusinessCard con rating y delivery time`
- `fix(cart): corrige cálculo de subtotal con cupones`
- `refactor(orders): extrae lógica de tracking a hook propio`

---

## Convenciones de código

### Imports

Usar siempre los **path aliases**, nunca rutas relativas largas:

```tsx
// ✅ Correcto
import { Button } from '@shared/ui';
import { useCartStore } from '@features/cart';
import { ROUTES } from '@app/router/routes';

// ❌ Incorrecto
import { Button } from '../../../shared/ui/Button';
```

Aliases disponibles:

- `@/*` → `src/*`
- `@app/*` → `src/app/*`
- `@features/*` → `src/features/*`
- `@pages/*` → `src/pages/*`
- `@shared/*` → `src/shared/*`
- `@assets/*` → `src/assets/*`

### Estilos

Solo **Tailwind CSS** con las variables del proyecto:

```tsx
// ✅ Correcto
<div className="bg-bg text-text-heading border border-border" />
<div className="text-accent bg-accent-bg" />

// ❌ Incorrecto (colores hardcodeados)
<div style={{ backgroundColor: '#aa3bff' }} />
<div className="bg-purple-500" />
```

Variables disponibles (definidas en `src/index.css`):

- **Texto:** `text`, `text-heading`
- **Fondos:** `bg`, `code-bg`, `social-bg`
- **Bordes:** `border`
- **Acento:** `accent`, `accent-bg`, `accent-border`

### Componentes

- Cada componente con su tipo de Props explícito.
- `export default` para el componente principal del archivo.
- Hooks personalizados con prefijo `use`.
- Stores Zustand con prefijo `use` y sufijo `Store` (ej: `useCartStore`).

### Páginas vs Componentes de feature

Las **páginas en `src/pages/`** son **ensambladores ligeros**. No deben contener lógica. Solo importan componentes de features y los acomodan.

```tsx
// ✅ Correcto — página que solo ensambla
import { CatalogGrid, CatalogFilters } from '@features/catalog';

export default function CatalogPage() {
  return (
    <div>
      <CatalogFilters />
      <CatalogGrid />
    </div>
  );
}

// ❌ Incorrecto — lógica directa en la página
export default function CatalogPage() {
  const [businesses, setBusinesses] = useState([]);
  useEffect(() => { /* fetch logic */ }, []);
  // ...
}
```

---

## Mocks y datos de prueba

Mientras backend no esté listo, toda la información proviene de mocks en `src/shared/mocks/`:

| Archivo | Contenido |
|---------|-----------|
| `businesses.mock.ts` | 11 comercios (restaurantes, farmacias, supermercados) |
| `products.mock.ts` | 18 productos repartidos entre comercios |
| `orders.mock.ts` | 4 pedidos en distintos estados |
| `user.mock.ts` | Usuario de ejemplo |
| `chatbotFlow.mock.ts` | Árbol de decisiones del chatbot |

### Cómo usar los mocks

Cada feature accede a sus mocks a través de su archivo `api/*.api.ts`. Cuando llegue el backend, **solo se modifica el contenido de esos archivos**, no la UI.

```ts
// features/catalog/api/catalog.api.ts
import { businessesMock } from '@shared/mocks';

// Hoy
export async function getBusinesses() {
  return businessesMock;
}

// Mañana (cuando llegue el broker)
import { apiClient } from '@shared/api/client';

export async function getBusinesses() {
  return apiClient.get('/businesses');
}
```

---

## Próximos pasos

### Antes de la primera presentación (2-6 marzo 2026)

- [x] Estructura base completa
- [x] Sistema de diseño
- [x] Soporte funcional (chatbot + agente)
- [ ] Catálogo con grilla y detalle de comercio (Persona 1)
- [ ] Carrito funcional con regla de un solo comercio (Persona 2)
- [ ] Historial de pedidos y tracking (Persona 3)
- [ ] Registro de cliente (Persona 3)

### Antes de la segunda presentación (6-10 abril 2026)

- [ ] Coordinación con equipo de broker para definir contrato de endpoints
- [ ] Refinamiento visual y UX
- [ ] Estados de carga y error en todas las features
- [ ] Tests básicos

### Antes de la entrega final (18-22 mayo 2026)

- [ ] Integración con broker real
- [ ] Reemplazo de mocks por llamadas al broker
- [ ] Documentación final del módulo
- [ ] Manual de usuario coordinado entre las 4 UIs

---

## Contacto

Para dudas sobre el proyecto, contactar a:

- **Heather** (líder técnica) — Coordinación general, sistema de diseño, soporte
- **Persona 1** — Catálogo y exploración
- **Persona 2** — Carrito y checkout
- **Persona 3** — Pedidos, tracking y registro

---

**Universidad Mesoamericana — Facultad de Ingeniería — Arquitectura de Sistemas II — 2026**