/**
 * MOVIES STORE - Gestión centralizada de películas
 * 
 * Equivalente a MovieProvider en Flutter.
 * Mantiene el estado de las películas y expone métodos para CRUD.
 */

import { writable, derived } from 'svelte/store';
import { api } from './api.service';
import type { Movie, MoviePayload } from './types';

interface MoviesState {
  movies: Movie[];
  loading: boolean;      // Para fetchMovies()
  mutating: boolean;     // Para create/update/delete
  error: string | null;
}

function createMoviesStore() {
  const { subscribe, set, update } = writable<MoviesState>({
    movies: [],
    loading: false,
    mutating: false,
    error: null
  });

  return {
    subscribe,

    // Cargar todas las películas
    async loadMovies() {
      update(state => ({ ...state, loading: true, error: null }));
      try {
        const movies = await api.getMovies();
        update(state => ({ ...state, movies, loading: false }));
      } catch (error) {
        update(state => ({ 
          ...state, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Error al cargar películas' 
        }));
      }
    },

    // Crear película
    async createMovie(payload: MoviePayload) {
      update(state => ({ ...state, loading: true, error: null }));
      try {
        const newMovie = await api.createMovie(payload);
        update(state => ({ 
          ...state, 
          movies: [...state.movies, newMovie], 
          loading: false 
        }));
        return true;
      } catch (error) {
        update(state => ({ 
          ...state, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Error al crear película' 
        }));
        return false;
      }
    },

    // Actualizar película
    async updateMovie(id: string, payload: MoviePayload) {
      update(state => ({ ...state, loading: true, error: null }));
      try {
        const updatedMovie = await api.updateMovie(id, payload);
        update(state => ({ 
          ...state, 
          movies: state.movies.map(m => m.id === id ? updatedMovie : m),
          loading: false 
        }));
        return true;
      } catch (error) {
        update(state => ({ 
          ...state, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Error al actualizar película' 
        }));
        return false;
      }
    },

    // Eliminar película
    async deleteMovie(id: string) {
      update(state => ({ ...state, loading: true, error: null }));
      try {
        await api.deleteMovie(id);
        update(state => ({ 
          ...state, 
          movies: state.movies.filter(m => m.id !== id),
          loading: false 
        }));
        return true;
      } catch (error) {
        update(state => ({ 
          ...state, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Error al eliminar película' 
        }));
        return false;
      }
    },

    // Limpiar errores
    clearError() {
      update(state => ({ ...state, error: null }));
    }
  };
}

export const moviesStore = createMoviesStore();

// Derived stores útiles
export const movies = derived(moviesStore, $store => $store.movies);
export const isLoadingMovies = derived(moviesStore, $store => $store.loading);
export const moviesError = derived(moviesStore, $store => $store.error);
export const isMutatingMovies = derived(moviesStore, $store => $store.mutating);