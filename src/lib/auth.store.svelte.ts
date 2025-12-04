/**
 * AUTH STORE - Gestión de autenticación (Svelte 5 Runes)
 * 
 * Mantiene el token JWT y lo persiste en localStorage.
 * Usa runes para reactividad moderna.
 */

import { browser } from '$app/environment';

const TOKEN_STORAGE_KEY = 'mivideoteca-token';

// Persistencia: guarda el token en localStorage (solo en el navegador)
// SSR safety: no accede a localStorage durante server-side rendering
function persist(value: string | null) {
  if (!browser) return;

  if (value) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, value);
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

// Recupera el token persistido para restaurar sesiones tras recargar
function readPersistedToken(): string | null {
  if (!browser) return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

// Estado reactivo global con Svelte 5 runes
let token = $state<string | null>(readPersistedToken());

// API pública del store
export const authToken = {
  // Getter reactivo - usar como: authToken.value
  get value() {
    return token;
  },

  // Setter con persistencia
  set(value: string | null) {
    token = value;
    persist(value);
  },

  // Limpia el token (logout)
  clear() {
    token = null;
    persist(null);
  },

  // Refresca desde localStorage (útil para sincronización entre pestañas)
  refreshFromStorage() {
    token = readPersistedToken();
  }
};
