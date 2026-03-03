<script lang="ts">
  import type { Movie, MovieFormSubmit } from '$lib/types';

  // Props con Svelte 5: callbacks en lugar de eventos y bindable para two-way binding
  let {
    isSubmitting = $bindable(false),
    initialMovie = $bindable<Movie | null>(null),
    submitLabel = 'Añadir película',
    showCancel = false,
    onsubmit,
    oncancel
  }: {
    isSubmitting?: boolean;
    initialMovie?: Movie | null;
    submitLabel?: string;
    showCancel?: boolean;
    onsubmit?: (data: MovieFormSubmit) => void;
    oncancel?: () => void;
  } = $props();

  // Estado interno del formulario con $state
  let title = $state('');
  let director = $state('');
  let year = $state<string | number>('');
  let posterUrl = $state('');
  let error = $state<string | null>(null);
  let lastInitialId = $state<string | null>(null);

  function resetForm() {
    title = '';
    director = '';
    year = '';
    posterUrl = '';
    error = null;
  }

  // Efecto reactivo: sincroniza el formulario cuando cambia initialMovie
  $effect(() => {
    if (initialMovie && initialMovie.id !== lastInitialId) {
      title = initialMovie.title ?? '';
      director = initialMovie.director ?? '';
      year = initialMovie.year != null ? String(initialMovie.year) : '';
      posterUrl = initialMovie.posterUrl ?? '';
      error = null;
      lastInitialId = initialMovie.id;
    } else if (!initialMovie && lastInitialId !== null) {
      resetForm();
      lastInitialId = null;
    }
  });

  function validateForm(): boolean {
    error = null;

    if (!title.trim()) {
      error = 'El título es obligatorio';
      return false;
    }

    if (!director.trim()) {
      error = 'El director es obligatorio';
      return false;
    }

    const yearNum = parseInt(String(year), 10);
    if (!yearNum || yearNum < 1800 || yearNum > new Date().getFullYear() + 5) {
      error = 'Introduce un año válido';
      return false;
    }

    return true;
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    
    if (!validateForm()) return;

    const trimmedTitle = title.trim();
    const trimmedDirector = director.trim();
    const trimmedPoster = posterUrl.trim();
    const numericYear = Number(year);

    if (!trimmedTitle || !trimmedDirector || Number.isNaN(numericYear) || numericYear < 1888) {
      error = 'Completa el título, director y un año válido.';
      return;
    }

    const payload: MovieFormSubmit = {
      id: initialMovie?.id,
      title: trimmedTitle,
      director: trimmedDirector,
      year: numericYear,
      posterUrl: trimmedPoster || undefined,
    };

    onsubmit?.(payload);

    if (!initialMovie) {
      resetForm();
    }
  }

  function handleCancel() {
    oncancel?.();
  }
</script>

<form class="space-y-4" onsubmit={handleSubmit}>
  <div class="grid gap-4 md:grid-cols-2">
    <label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
      Título
      <input
        bind:value={title}
        class="rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        name="title"
        placeholder="La Odisea Espacial"
        required
        type="text"
      />
    </label>
    <label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
      Director
      <input
        bind:value={director}
        class="rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        name="director"
        placeholder="Stanley Kubrick"
        required
        type="text"
      />
    </label>
    <label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
      Año
      <input
        bind:value={year}
        class="rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        min="1888"
        name="year"
        placeholder="1968"
        required
        type="number"
      />
    </label>
    <label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
      Póster (URL)
      <input
        bind:value={posterUrl}
        class="rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        name="posterUrl"
        placeholder="https://..."
        type="url"
      />
    </label>
  </div>

  {#if error}
    <p class="text-sm text-red-600">{error}</p>
  {/if}

  <div class="flex flex-col gap-2 sm:flex-row">
    {#if showCancel}
      <button
        type="button"
        class="w-full rounded border border-slate-300 px-4 py-2 text-slate-700 transition hover:bg-slate-50"
        onclick={handleCancel}
      >
        Cancelar
      </button>
    {/if}
    <button
      class="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={isSubmitting}
      type="submit"
    >
      {#if isSubmitting}
        Guardando...
      {:else}
        {submitLabel}
      {/if}
    </button>
  </div>
</form>
