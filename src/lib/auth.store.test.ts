/**
 * TESTS DEL AUTH STORE (Svelte 5 Runes)
 * 
 * Tests más simples porque el store solo maneja el token.
 * La lógica de autenticación está en api.service.test.ts
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock del módulo $app/environment ANTES de importar el store
vi.mock('$app/environment', () => ({ browser: true }));

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

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Importar DESPUÉS de configurar los mocks
import { authToken } from './auth.store.svelte';

describe('Auth Store (Svelte 5 Runes)', () => {
  beforeEach(() => {
    localStorageMock.clear();
    authToken.clear();
  });

  describe('Guardar token', () => {
    it('debería guardar token en el store y localStorage', () => {
      // ARRANGE
      const newToken = 'new-jwt-token';

      // ACT
      authToken.set(newToken);

      // ASSERT - Svelte 5: usar authToken.value en lugar de get()
      expect(authToken.value).toBe(newToken);
      expect(localStorageMock.getItem('mivideoteca-token')).toBe(newToken);
    });
  });

  describe('Limpiar token (Logout)', () => {
    it('debería cerrar sesión y limpiar token', () => {
      // ARRANGE - Primero guardamos un token
      authToken.set('some-token');
      expect(authToken.value).toBe('some-token');

      // ACT
      authToken.clear();

      // ASSERT
      expect(authToken.value).toBeNull();
      expect(localStorageMock.getItem('mivideoteca-token')).toBeNull();
    });
  });

  describe('Restauración de sesión', () => {
    it('debería restaurar token desde localStorage', () => {
      // ARRANGE
      const savedToken = 'saved-token-from-storage';
      localStorageMock.setItem('mivideoteca-token', savedToken);

      // ACT
      authToken.refreshFromStorage();

      // ASSERT
      expect(authToken.value).toBe(savedToken);
    });
  });
});

/**
 * NOTAS PARA ESTUDIANTES (Svelte 5):
 * 
 * 1. Orden de imports importante
 *    - Primero mockeamos $app/environment y localStorage
 *    - LUEGO importamos el store
 *    - Esto asegura que el store use nuestros mocks
 * 
 * 2. vi.mock() debe estar al inicio
 *    - Vitest necesita que los mocks estén antes de los imports
 *    - Por eso vi.mock() está arriba del todo
 * 
 * 3. authToken.value (Svelte 5 Runes)
 *    - Acceso directo al valor del estado
 *    - Reemplaza get() de svelte/store
 * 
 * 4. authToken.clear() vs authToken.set(null)
 *    - clear() elimina también de localStorage
 *    - Es el equivalente a logout
 */