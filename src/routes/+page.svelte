<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  import { api, ApiError } from '$lib/api.service';
  import { authToken } from '$lib/auth.store';
  import MovieCard from '$lib/components/MovieCard.svelte';
  import MovieForm from '$lib/components/MovieForm.svelte';
  import type { Movie, MovieFormSubmit, MoviePayload } from '$lib/types';

  // Estado reactivo de la página: Svelte 5 runes
  let movies = $state<Movie[]>([]);
  let editingMovie = $state<Movie | null>(null);
  let isLoading = $state(true);
  let isSubmitting = $state(false);
  let feedbackMessage = $state<{ type: 'error' | 'info'; text: string } | null>(null);

  // Carga las películas del backend y mantiene sincronizado el estado de edición
  async function loadMovies() {
    isLoading = true;
    feedbackMessage = null;
    try {
      movies = await api.getMovies();
      // Si estamos editando, actualiza los datos desde el servidor
      if (editingMovie) {
        const refreshed = movies.find((movie) => movie.id === editingMovie?.id);
        editingMovie = refreshed ?? editingMovie;
      }
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'No se pudieron cargar las películas.';
      feedbackMessage = { type: 'error', text: message };
    } finally {
      isLoading = false;
    }
  }

  // Lifecycle: carga inicial solo en el navegador
  onMount(() => {
    if (!browser) {
      return;
    }

    // Guard de autenticación: redirige si no hay token
    if (!$authToken) {
      goto('/login');
      isLoading = false;
      return;
    }

    // Carga las películas del usuario
    loadMovies();
  });

  // Reactive statement → $effect: redirige automáticamente si se cierra sesión
  $effect(() => {
    if (browser && !$authToken && !isLoading) {
      goto('/login');
    }
  });

  // Maneja el envío del formulario: decide si crear o actualizar película
  async function handleFormSubmit(data: MovieFormSubmit) {
    isSubmitting = true;
    feedbackMessage = null;

    const { id, title, director, year, posterUrl } = data;
    const payload: MoviePayload = {
      title,
      director,
      year,
      posterUrl,
    };

    try {
      if (id) {
        // Modo edición: actualiza película existente
        const updated = await api.updateMovie(id, payload);
        movies = movies.map((movie) => (movie.id === updated.id ? updated : movie));
        feedbackMessage = { type: 'info', text: 'Película actualizada correctamente.' };
        editingMovie = null;
      } else {
        // Modo creación: añade nueva película
        const movie = await api.createMovie(payload);
        movies = [movie, ...movies];  // Prepend: más recientes primero
        feedbackMessage = { type: 'info', text: 'Película guardada correctamente.' };
      }
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'No se pudo guardar la película.';
      feedbackMessage = { type: 'error', text: message };
    } finally {
      isSubmitting = false;
    }
  }

  // Elimina película con optimistic updates: actualiza UI inmediatamente
  async function handleDelete(id: string) {
    const prev = movies;
    movies = movies.filter((movie) => movie.id !== id);

    try {
      await api.deleteMovie(id);
      feedbackMessage = { type: 'info', text: 'Película eliminada.' };
    } catch (error) {
      movies = prev;
      const message =
        error instanceof ApiError
          ? error.message
          : 'No se pudo eliminar la película.';
      feedbackMessage = { type: 'error', text: message };
    }
  }

  // Abre el modo edición con los datos de la tarjeta seleccionada.
  function handleEdit(movie: Movie) {
    editingMovie = movie;
  }

  // Limpia el formulario lateral y vuelve al modo de creación.
  function handleCancelEdit() {
    editingMovie = null;
  }
</script>

<section class="container mx-auto px-4 py-8">
  <div class="mb-8 max-w-3xl">
    <h1 class="text-3xl font-bold text-slate-900">Mi Videoteca</h1>
    <p class="text-slate-600">
      Gestiona tu colección personal de películas favoritas de forma rápida y sin fricción.
    </p>
  </div>

  {#if feedbackMessage}
    <div
      class={`mb-6 rounded border px-4 py-3 text-sm ${
        feedbackMessage.type === 'error'
          ? 'border-red-300 bg-red-50 text-red-700'
          : 'border-green-300 bg-green-50 text-green-700'
      }`}
    >
      {feedbackMessage.text}
    </div>
  {/if}

  <div class="grid gap-8 lg:grid-cols-[2fr_1fr]">
    <div>
      {#if isLoading}
        <div class="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
          Cargando películas...
        </div>
      {:else if movies.length === 0}
        <div class="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 shadow-sm">
          Tu videoteca está vacía. Añade la primera película usando el formulario.
        </div>
      {:else}
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {#each movies as movie (movie.id)}
            <MovieCard {movie} ondelete={handleDelete} onedit={handleEdit} />
          {/each}
        </div>
      {/if}
    </div>

    <aside class="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="mb-2 text-xl font-semibold text-slate-900">
        {editingMovie ? 'Editar película' : 'Nueva película'}
      </h2>
      <p class="mb-4 text-sm text-slate-500">
        {editingMovie
          ? 'Actualiza los datos y guarda los cambios cuando estés listo.'
          : 'Completa los datos y guárdalos para verlos en la lista.'}
      </p>
      <MovieForm
        bind:isSubmitting
        bind:initialMovie={editingMovie}
        submitLabel={editingMovie ? 'Guardar cambios' : 'Añadir película'}
        showCancel={Boolean(editingMovie)}
        onsubmit={handleFormSubmit}
        oncancel={handleCancelEdit}
      />
    </aside>
  </div>
</section>
