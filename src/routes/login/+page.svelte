<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { api, ApiError } from '$lib/api.service';
  import { authToken } from '$lib/auth.store';

  let email = $state('');
  let password = $state('');
  let isSubmitting = $state(false);
  let errorMessage = $state<string | null>(null);

  // Evita mostrar la pantalla de login cuando ya existe token.
  $effect(() => {
    if (browser && $authToken) {
      goto('/');
    }
  });

  // Valida y envía las credenciales al backend mostrando feedback.
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      errorMessage = 'Introduce un email y contraseña validos.';
      return;
    }

    isSubmitting = true;
    errorMessage = null;

    try {
      const result = await api.login({ email: email.trim(), password: password.trim() });
      authToken.set(result.token);
      goto('/');
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'No se pudo iniciar sesión. Inténtalo mas tarde.';
      errorMessage = message;
    } finally {
      isSubmitting = false;
    }
  }
</script>

<section class="flex items-center justify-center px-4 py-16">
  <div class="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-lg">
    <h1 class="mb-2 text-2xl font-bold text-slate-900">Bienvenido de nuevo</h1>
    <p class="mb-6 text-sm text-slate-600">
      Accede a tu videoteca con el mismo email y contraseña usados en la app.
    </p>

    {#if errorMessage}
      <div class="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
        {errorMessage}
      </div>
    {/if}

    <form class="space-y-4" onsubmit={handleSubmit}>
      <label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Email
        <input
          bind:value={email}
          autocomplete="email"
          class="rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          inputmode="email"
          placeholder="tu@email.com"
          required
          type="email"
        />
      </label>

      <label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Contraseña
        <input
          bind:value={password}
          autocomplete="current-password"
          class="rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Tu contraseña"
          required
          type="password"
        />
      </label>

      <button
        class="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSubmitting}
        type="submit"
      >
        {#if isSubmitting}
          Iniciando...
        {:else}
          Iniciar sesión
        {/if}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-slate-600">
      No tienes cuenta?
      <a class="font-medium text-blue-600 hover:text-blue-700" href="/register">Regístrate</a>
    </p>
  </div>
</section>
