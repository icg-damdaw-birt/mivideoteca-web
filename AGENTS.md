# 🎬 MiVideoteca - Guía del Proyecto

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| **SvelteKit** | 2.x | Framework fullstack |
| **Svelte** | 5.x | UI con Runes (`$state`, `$derived`, `$effect`) |
| **TypeScript** | 5.x | Tipado estático |
| **Vitest** | 2.x | Testing unitario |
| **Vite** | 6.x | Bundler y dev server |

---

## Estructura del Proyecto

```
src/
└── lib/
    ├── api.service.ts          # Servicio HTTP (fetch wrapper)
    ├── api.service.test.ts     # Tests del servicio HTTP
    ├── auth.store.svelte.ts    # Store de autenticación (token JWT)
    ├── auth.store.test.ts      # Tests del auth store
    ├── movies.store.svelte.ts  # Store de películas (CRUD)
    ├── movies.store.test.ts    # Tests del movies store
    ├── types.ts                # Interfaces y tipos
    └── index.ts                # Re-exportaciones
```

---

## Convenciones de Archivos

| Extensión | Significado |
|---|---|
| `.svelte.ts` | Archivo TypeScript que usa **runes** de Svelte 5 (`$state`, `$derived`, `$effect`) |
| `.ts` | TypeScript puro, sin reactividad de Svelte |
| `.test.ts` | Archivo de tests (Vitest). Nunca lleva `.svelte` porque no declara runes |

**Regla:** solo los archivos que declaran estado reactivo con runes llevan `.svelte.ts`.

---

## Conceptos Clave

### Svelte 5 Runes

```typescript
// $state → estado reactivo (reemplaza a writable stores)
let count = $state(0);

// $derived → valor calculado (reemplaza a derived stores)
let double = $derived(count * 2);

// $effect → efecto secundario (reemplaza a afterUpdate / reactive statements)
$effect(() => {
  console.log('count cambió:', count);
});
```

### Patrón del Store

Los stores siguen este patrón:

```typescript
// movies.store.svelte.ts
let movies = $state<Movie[]>([]);
let loading = $state(false);
let error = $state<string | null>(null);

export const moviesStore = {
  get movies() { return movies; },
  get loading() { return loading; },
  get error() { return error; },

  async loadMovies() { /* ... */ },
  async createMovie(payload: MoviePayload) { /* ... */ },
  async updateMovie(id: string, payload: MoviePayload) { /* ... */ },
  async deleteMovie(id: string) { /* ... */ },
  reset() { /* ... */ }
};
```

### API Service

Wrapper sobre `fetch` que maneja:
- Base URL automática
- Headers con token JWT
- Serialización/deserialización JSON
- Manejo de errores HTTP

```typescript
// Uso
const movies = await api.getMovies();
const movie = await api.createMovie({ title: 'Inception', director: 'Nolan', year: 2010 });
const updated = await api.updateMovie('1', { title: 'Updated', director: 'Nolan', year: 2010 });
await api.deleteMovie('1');
```

---

## Testing

### Ejecutar tests

```bash
# Todos los tests
npx vitest

# Tests en modo watch
npx vitest --watch

# Un archivo específico
npx vitest movies.store

# Con cobertura
npx vitest --coverage
```

### Patrón AAA (Arrange, Act, Assert)

Todos los tests siguen esta estructura:

```typescript
it('debería hacer algo', async () => {
  // ARRANGE - preparar datos y mocks
  vi.mocked(api.getMovies).mockResolvedValue(mockData);

  // ACT - ejecutar la acción
  await moviesStore.loadMovies();

  // ASSERT - verificar el resultado
  expect(moviesStore.movies).toEqual(mockData);
});
```

### Mocks importantes

```typescript
// Mock de módulos de Svelte (siempre ANTES de importar el store)
vi.mock('$app/environment', () => ({ browser: true }));

// Mock del API service
vi.mock('./api.service', () => ({
  api: {
    getMovies: vi.fn(),
    createMovie: vi.fn(),
    updateMovie: vi.fn(),
    deleteMovie: vi.fn(),
  }
}));

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
```

> ⚠️ **Orden de imports:** primero los `vi.mock()`, luego los `import` del código a testear.

---

## Reglas de Desarrollo

### Toda funcionalidad nueva requiere tests

Cada nueva funcionalidad implementada en un store o servicio **debe incluir tests unitarios** que:

- Sigan el **patrón AAA** (Arrange, Act, Assert)
- Cubran al menos: caso de éxito, validación de inputs y manejo de errores de API
- Verifiquen que se llama al endpoint correcto con los datos correctos
- Pasen al ejecutar `npx vitest`

> **Regla:** no se considera completa una funcionalidad sin su bloque `describe()` correspondiente en el archivo `.test.ts`.

---

## Recursos

- [Svelte 5 Runes](https://svelte.dev/docs/svelte/$state)
- [SvelteKit](https://svelte.dev/docs/kit)
- [Vitest](https://vitest.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)