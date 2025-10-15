import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

const TOKEN_STORAGE_KEY = 'mivideoteca-token';

// Persistencia: guarda el token en localStorage (solo en el navegador)
// SSR safety: no accede a localStorage durante server-side rendering
function persist(value: string | null) {
  if (!browser) {
    return;
  }

  if (value) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, value);
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

// Recupera el token persistido para restaurar sesiones tras recargar
function readPersistedToken(): string | null {
  if (!browser) {
    return null;
  }
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

// Factory Pattern: crea un store personalizado con métodos específicos
// Combina reactividad de Svelte + persistencia en localStorage
function createAuthTokenStore() {
  // Store base de Svelte con valor inicial desde localStorage
  const store: Writable<string | null> = writable(readPersistedToken());

  // Wrapper: actualiza store + persistencia simultáneamente
  const setToken = (value: string | null) => {
    store.set(value);
    persist(value);
  };

  // API pública: subscribe nativo + métodos personalizados
  return {
    subscribe: store.subscribe, // Reactividad automática de Svelte
    set: setToken,
    clear: () => setToken(null),
    refreshFromStorage: () => {
      store.set(readPersistedToken());
    },
  };
}

export const authToken = createAuthTokenStore();
