# 🌐 MiVideoteca - Web App (SvelteKit + Svelte 5)

Aplicación web progresiva para gestionar tu colección de películas. 

## 🏗️ Arquitectura

```
src/
├── lib/
│   ├── api.service.ts           # Comunicación con la API
│   ├── auth.store.svelte.ts     # Store de autenticación (Svelte 5 Runes)
│   ├── movies.store.svelte.ts   # Store de películas (Svelte 5 Runes)
│   └── types.ts                 # Tipos TypeScript
├── routes/
│   ├── login/                   # Pantalla de login
│   ├── register/                # Pantalla de registro
│   ├── +page.svelte             # Página principal (CRUD películas)
│   └── +layout.svelte           # Layout global
└── app.html                     # Template HTML

src/lib/
└── components/                  # Componentes reutilizables
    ├── Header.svelte
    ├── MovieCard.svelte
    └── MovieForm.svelte
```

## 🚀 Características

- ✅ **Svelte 5 Runes**: `$state`, `$effect`, `$props`, `$bindable`
- ✅ **Autenticación**: Login y registro con JWT
- ✅ **CRUD de películas**: Crear, leer, actualizar y eliminar
- ✅ **Persistencia de sesión**: Token guardado en localStorage
- ✅ **Gestión de estado**: Stores modernos con runes (`.svelte.ts`)
- ✅ **Tests de Auth**: Implementados y funcionando
- ✅ **TypeScript estricto**: Type-safe en todo el proyecto
- ✅ **Tailwind CSS**: UI responsive y moderna
- 🔜 **Tests de Movies**: Se crearán en UD4 (video)
- 🔜 **Favoritos**: Implementar + tests (UD4 - video)
- 🔜 **Rating**: Implementar + tests (UD4 - ejercicio)

---

## 🎓 Para el curso

### **UD4: Frontend Web (SvelteKit)**
**Público: DAW (obligatorio) + DAM (opcional)**

#### **Estado inicial:**
- ✅ App funcionando con CRUD completo
- ✅ **100% Svelte 5** (sin sintaxis legacy)
- ✅ `auth.store.svelte.ts` testeado
- ✅ `movies.store.svelte.ts` implementado **sin tests**
- ⏸️ Favoritos y Rating pendientes

#### **🎬 En el video harás:**
1. **Crear tests para `movies.store.svelte.ts`**
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

### 3. Configurar variables de entorno (opcional)
```bash
# Crea el archivo .env en la raíz del proyecto
cp .env.example .env
```

Edita `.env` con la URL de tu backend:
```env
# Por defecto usa http://localhost:3000 si no existe .env
PUBLIC_API_URL=http://localhost:3000
```

> **Nota:** Si no creas `.env`, la app usará `http://localhost:3000` automáticamente.

---

## ▶️ Ejecutar la aplicación

### Desarrollo
```bash
# Modo desarrollo con hot reload
npm run dev

# La app estará disponible en: http://localhost:5173
```

### Preview (simula producción)
```bash
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

# Con interfaz visual
npm run test:ui
```

### Estado actual de tests (UD4)
```bash
npm run test:run

# ✅ auth.store.test.ts - Implementado
# ✅ api.service.test.ts - Solo autenticación
# ⏸️ movies.store.test.ts - Se creará en video UD4
```

---

## 🆕 Svelte 5 Runes

Este proyecto usa **100% sintaxis moderna de Svelte 5**:

### Stores con Runes (`.svelte.ts`)

```typescript
// auth.store.svelte.ts
let token = $state<string | null>(null);

export const authToken = {
  get value() { return token; },
  set(value: string | null) { token = value; },
  clear() { token = null; }
};
```

### Uso en componentes

```svelte
<script lang="ts">
  import { authToken } from '$lib/auth.store.svelte';
  import { moviesStore } from '$lib/movies.store.svelte';

  // Estado local con $state
  let isLoading = $state(true);

  // Efectos reactivos con $effect
  $effect(() => {
    if (authToken.value) {
      moviesStore.loadMovies();
    }
  });
</script>

<!-- Acceso a stores -->
{#if authToken.value}
  <p>Usuario autenticado</p>
{/if}

{#each moviesStore.movies as movie}
  <div>{movie.title}</div>
{/each}
```

### Props con $props()

```svelte
<script lang="ts">
  let { 
    movie,
    ondelete,
    onedit
  }: {
    movie: Movie;
    ondelete?: (id: string) => void;
    onedit?: (movie: Movie) => void;
  } = $props();
</script>
```

### Event handlers modernos

```svelte
<!-- Svelte 5 -->
<button onclick={handleClick}>Click</button>
<form onsubmit={handleSubmit}>

<!-- En lugar de (Svelte 4 - deprecated) -->
<button on:click={handleClick}>Click</button>
<form on:submit|preventDefault={handleSubmit}>
```

---

## 📚 Estructura de Stores

### authToken (`auth.store.svelte.ts`)
```typescript
authToken.value      // Getter: obtiene el token actual
authToken.set(token) // Setter: guarda token + localStorage
authToken.clear()    // Logout: elimina token
```

### moviesStore (`movies.store.svelte.ts`)
```typescript
moviesStore.movies   // Getter: lista de películas
moviesStore.loading  // Getter: estado de carga
moviesStore.error    // Getter: mensaje de error

moviesStore.loadMovies()              // Cargar todas
moviesStore.createMovie(payload)      // Crear nueva
moviesStore.updateMovie(id, payload)  // Actualizar
moviesStore.deleteMovie(id)           // Eliminar
```

---

## 🔄 Flujo de datos

```
UI (Svelte Components)
    ↓ Lee stores (authToken.value, moviesStore.movies)
Stores (.svelte.ts con $state)
    ↓ Llama funciones async
Services (api.service.ts)
    ↓ fetch() HTTP Request
Backend API (Express)
    ↓ Respuesta
Service → Store ($state) → UI (reactividad automática)
```

---

## 🆚 Equivalencia entre proyectos

| Componente | SvelteKit | Flutter | Express |
|------------|-----------|---------|---------|
| **Auth** | `auth.store.svelte.ts` | `auth_provider.dart` | `authController.js` |
| **Auth Tests** | ✅ Implementado | ✅ Implementado | ✅ Implementado |
| **Movies** | `movies.store.svelte.ts` | `movie_provider.dart` | `movieController.js` |
| **Movies Tests** | ⏸️ UD4 (video) | ⏸️ UD4 (video) | ⏸️ UD3 (video) |
| **Favoritos** | ⏸️ UD4 (video) | ⏸️ UD4 (video) | ⏸️ UD3 (video) |
| **Rating** | ⏸️ UD4 (ejercicio) | ⏸️ UD4 (ejercicio) | ⏸️ UD3 (ejercicio) |

**Mismo patrón, diferentes tecnologías** ✅

---

## 🐛 Troubleshooting

### Error: "Failed to fetch"
```bash
# Verifica que el backend esté corriendo
curl http://localhost:3000/api/movies

# Por defecto usa http://localhost:3000
# Si necesitas otro puerto, crea .env:
echo "PUBLIC_API_URL=http://localhost:8080" > .env
```

### Error en imports de stores
```typescript
// ✅ Correcto - incluir .svelte en la extensión
import { authToken } from '$lib/auth.store.svelte';

// ❌ Incorrecto
import { authToken } from '$lib/auth.store';
```

### Error: "$state is not defined"
```bash
# Verifica que el archivo tenga extensión .svelte.ts
# Los runes solo funcionan en:
# - Archivos .svelte (componentes)
# - Archivos .svelte.ts (módulos)
```

---

## 📦 Stack tecnológico

- **Framework**: SvelteKit 2.x + Svelte 5
- **Lenguaje**: TypeScript 5.x (estricto)
- **Estilos**: Tailwind CSS 3.x
- **Testing**: Vitest + jsdom
- **Build**: Vite 7.x

---

## 🔗 Enlaces útiles

- [Documentación de SvelteKit](https://kit.svelte.dev/)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/$state)
- [Vitest Documentation](https://vitest.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 👥 Autor

Proyecto educativo - Curso "De Cero a Deploy"

## 📄 Licencia

MIT - Este proyecto es material educativo.

---

## 🎯 Próximos pasos

1. ✅ Completa la **UD3** (Backend) primero
2. ✅ Instala las dependencias: `npm install`
3. ✅ (Opcional) Configura `.env` si tu backend usa otro puerto
4. ✅ Ejecuta los tests: `npm run test:run`
5. ✅ Corre la app: `npm run dev`
6. 🎬 Sigue el video de UD4 para tests de Movies + Favoritos
7. 📝 Implementa el ejercicio de Rating

**¡Listo para UD4!** 🚀
