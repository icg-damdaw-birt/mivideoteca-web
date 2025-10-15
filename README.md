# 🌐 MiVideoteca - Web App (SvelteKit)

Aplicación web progresiva para gestionar tu colección de películas. 

## 🏗️ Arquitectura

```
src/
├── lib/
│   ├── api.service.ts       # Comunicación con la API
│   ├── auth.store.ts        # Store de autenticación (JWT)
│   ├── movies.store.ts      # Store de películas (CRUD)
│   └── types.ts             # Tipos TypeScript
├── routes/
│   ├── (auth)/              # Rutas protegidas
│   │   ├── movies/          # CRUD de películas
│   │   └── +layout.svelte   # Layout con auth guard
│   ├── login/               # Pantalla de login
│   ├── register/            # Pantalla de registro
│   └── +layout.svelte       # Layout global
└── app.html                 # Template HTML

test/
└── lib/                     # Tests unitarios
    ├── api.service.test.ts  # Tests del servicio API (auth)
    ├── auth.store.test.ts   # Tests del store de auth
    └── movies.store.test.ts # ⏸️ Se creará en video UD4
```

## 🚀 Características

- ✅ **Autenticación**: Login y registro con JWT
- ✅ **CRUD de películas**: Crear, leer, actualizar y eliminar
- ✅ **Persistencia de sesión**: Token guardado en localStorage
- ✅ **Gestión de estado**: Svelte Stores (auth + movies)
- ✅ **Tests de Auth**: Implementados y funcionando
- ✅ **Routing**: Sistema de rutas de SvelteKit
- ✅ **SSR**: Server-Side Rendering opcional
- 🔜 **Tests de Movies**: Se crearán en UD4 (video)
- 🔜 **Favoritos**: Implementar + tests (UD4 - video)
- 🔜 **Rating**: Implementar + tests (UD4 - ejercicio)

---

## 🎓 Para el curso

### **UD4: Frontend Web (SvelteKit)**
**Público: DAW (obligatorio) + DAM (opcional)**

#### **Estado inicial:**
- ✅ App funcionando con CRUD completo
- ✅ `auth.store.ts` testeado
- ✅ `movies.store.ts` implementado **sin tests**
- ⏸️ Favoritos y Rating pendientes

#### **🎬 En el video harás:**
1. **Crear `movies.store.test.ts`**
   - Test: loadMovies()
   - Test: createMovie()
   - Test: updateMovie()
   - Test: deleteMovie()

2. **Implementar Favoritos**
   - Método `toggleFavorite(id)` en store
   - UI para marcar favoritos
   - Tests de favoritos

#### **📝 Tu ejercicio:**
Implementar **Rating** (1-5 estrellas) usando IA:
- Método `rateMovie(id, rating)` en store
- UI con selector de estrellas
- Tests completos (válido e inválido)

---

## 📋 Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- VS Code con extensiones de Svelte (recomendado)
- **Backend funcionando** (complétalo primero en UD3)

---

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd mivideoteca-web
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
# Crea el archivo .env en la raíz del proyecto
cp .env.example .env
```

Edita `.env` con la URL de tu backend:
```env
# UD4: Desarrollo local
PUBLIC_API_URL=http://localhost:3000

# UD5: Producción
# PUBLIC_API_URL=https://tu-api.onrender.com
```

---

## ▶️ Ejecutar la aplicación

### Desarrollo (conecta a backend local)
```bash
# Modo desarrollo con hot reload
npm run dev

# Con host específico (para acceder desde otros dispositivos)
npm run dev -- --host

# La app estará disponible en: http://localhost:5173
```

### Preview (simula producción)
```bash
# Build + preview
npm run build
npm run preview
```

---

## 🧪 Testing

### Ejecutar todos los tests
```bash
# Modo watch (re-ejecuta automáticamente)
npm test

# Ejecutar una vez
npm run test:run

# Con interfaz visual (recomendado para debugging)
npm run test:ui
```

### Ejecutar tests específicos
```bash
# Solo tests de api.service
npm test -- api.service

# Solo tests de auth.store
npm test -- auth.store

# Tests con verbose
npm test -- --reporter=verbose
```

### Estado actual de tests (UD4)
```bash
npm test

# ✅ auth.store.test.ts (3 tests) - Implementado
# ✅ api.service.test.ts (5 tests) - Solo autenticación
# ⏸️ movies.store.test.ts - Se creará en video UD4
```

### Interfaz visual de tests
```bash
# Abre una UI web interactiva
npm run test:ui

# Navega a: http://localhost:51204/__vitest__/
```

---

## 🏗️ Build para producción (UD5)

### Generar build estático
```bash
# Build optimizado para producción
npm run build

# Los archivos estarán en: build/
```

### Previsualizar build de producción
```bash
npm run preview
```

---

## 📚 Estructura del proyecto

### Stores (Gestión de Estado)
- **authToken** (`auth.store.ts`): Maneja el token JWT y su persistencia
- **moviesStore** (`movies.store.ts`): Gestión centralizada del estado de películas (CRUD)

### Services
- **api.service** (`api.service.ts`): Todas las llamadas HTTP al backend

### Arquitectura de datos
Similar a Flutter:
- **authToken**: Store para autenticación (equivalente a `AuthProvider`)
- **moviesStore**: Store para películas (equivalente a `MovieProvider`)

Ejemplo en un componente:
```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { moviesStore, movies, isLoadingMovies } from '$lib';
  
  onMount(() => {
    moviesStore.loadMovies();
  });
</script>

{#if $isLoadingMovies}
  <p>Cargando...</p>
{:else}
  {#each $movies as movie}
    <div>{movie.title}</div>
  {/each}
{/if}
```

### Routing
SvelteKit usa **file-based routing**:
- `/login` → `src/routes/login/+page.svelte`
- `/register` → `src/routes/register/+page.svelte`
- `/movies` → `src/routes/(auth)/movies/+page.svelte`

### Layouts
- **`+layout.svelte`**: Layout global con navbar
- **`(auth)/+layout.svelte`**: Layout que requiere autenticación

---

## 🔄 Flujo de datos

```
UI (Svelte Components)
    ↓ Lee/Modifica stores
Stores (authToken, moviesStore)
    ↓ Llama funciones
Services (api.service)
    ↓ fetch() HTTP Request
Backend API (Express)
    ↓ Respuesta
Service → Store → UI (reactividad automática)
```

---

## 🆚 Equivalencia entre proyectos

| Componente | SvelteKit | Flutter | Express |
|------------|-----------|---------|---------|
| **Auth** | `auth.store.ts` | `auth_provider.dart` | `authController.js` |
| **Auth Tests** | ✅ Implementado | ✅ Implementado | ✅ Implementado |
| **Movies** | `movies.store.ts` | `movie_provider.dart` | `movieController.js` |
| **Movies Tests** | ⏸️ UD4 (video) | ⏸️ UD4 (video) | ⏸️ UD3 (video) |
| **Favoritos** | ⏸️ UD4 (video) | ⏸️ UD4 (video) | ⏸️ UD3 (video) |
| **Rating** | ⏸️ UD4 (ejercicio) | ⏸️ UD4 (ejercicio) | ⏸️ UD3 (ejercicio) |

**Mismo patrón, diferentes tecnologías** ✅

---

## 🌐 Plataformas soportadas

- ✅ **Navegadores modernos** (Chrome, Firefox, Safari, Edge)
- ✅ **Mobile web** (responsive design con Tailwind CSS)
- ✅ **PWA** (instalable como app)
- ✅ **SSR/SSG** (Server-Side Rendering opcional)

---

## 🐛 Troubleshooting

### Error: "Failed to fetch"
```bash
# Verifica que el backend esté corriendo
curl http://localhost:3000/api/movies

# Verifica la variable de entorno
echo $PUBLIC_API_URL
# o en Windows:
echo %PUBLIC_API_URL%

# Asegúrate de que empiece con PUBLIC_ para que sea visible en el cliente
```

### Error: "Cannot read properties of undefined (reading 'get')"
```bash
# En tests, asegúrate de mockear fetch correctamente:
globalThis.fetch = vi.fn() as any;

# Y que la respuesta tenga headers:
{
  ok: true,
  headers: {
    get: (name: string) => name === 'content-type' ? 'application/json' : null
  },
  json: async () => ({ ... })
}
```

### Tests fallan con "browser is not defined"
```bash
# Verifica que el mock esté configurado:
vi.mock('$app/environment', () => ({ browser: true }));

# Y que localStorage esté mockeado antes de importar los stores
```

### Hot reload no funciona
```bash
# Reinicia el servidor de desarrollo
# Ctrl+C para detener
npm run dev
```

### CORS errors en desarrollo
```bash
# El backend debe permitir http://localhost:5173
# Ver configuración CORS en mivideoteca-api
```

---

## 📦 Dependencias principales

```json
{
  "dependencies": {
    "@sveltejs/kit": "^2.22.0",
    "svelte": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^7.0.4",
    "vitest": "^3.2.4",
    "@vitest/ui": "^3.2.4",
    "jsdom": "^27.0.0",
    "tailwindcss": "^3.4.13"
  }
}
```

### Librerías clave
- **SvelteKit**: Framework web full-stack
- **Vite**: Build tool ultra-rápido
- **Vitest**: Testing framework (compatible con Vite)
- **Tailwind CSS**: Estilos utility-first
- **TypeScript**: Tipado estático

---

## 🎨 Estilos

Este proyecto usa **Tailwind CSS** para los estilos:

```svelte
<!-- Ejemplo de componente con Tailwind -->
<button 
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
>
  Guardar
</button>
```

---

## 🔗 Enlaces útiles

- [Documentación de SvelteKit](https://kit.svelte.dev/)
- [Svelte Tutorial](https://learn.svelte.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Backend del proyecto](../mivideoteca-api/README.md)

---

## 👥 Autor

Proyecto educativo - Curso "De Cero a Deploy"

## 📄 Licencia

Este proyecto es material educativo.

---

## 🎯 Próximos pasos

1. ✅ Completa la **UD3** (Backend) primero
2. ✅ Instala las dependencias: `npm install`
3. ✅ Configura el `.env` con la URL de tu backend local
4. ✅ Ejecuta los tests: `npm test`
5. ✅ Corre la app: `npm run dev`
6. 🎬 Sigue el video de UD4 para tests de Movies + Favoritos
7. 📝 Implementa el ejercicio de Rating

**¡Listo para UD4!** 🚀

---

## 📝 Notas adicionales

### Diferencias con el proyecto Flutter

Este proyecto tiene **la misma funcionalidad** que `mivideoteca-app` pero implementado con **tecnologías web**:

- **Mismo backend**: Ambos consumen la misma API REST
- **Misma lógica**: Login, CRUD, favoritos, rating
- **Diferentes tecnologías**: Web vs Mobile nativo
- **Misma arquitectura**: Stores vs Providers (mismo concepto)
- **Mismos tests conceptuales**: Diferentes frameworks pero mismo objetivo

### ¿Por qué dos frontends?

Este curso enseña **desarrollo full-stack completo**:
- **Backend**: Express + SQLite (UD3) → PostgreSQL (UD5)
- **Web**: SvelteKit (UD4 - DAW obligatorio)
- **Mobile**: Flutter (UD4 - DAM obligatorio)

Aprenderás a construir aplicaciones que funcionan **en cualquier plataforma**. 🌍📱
