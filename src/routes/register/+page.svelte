<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { api, ApiError } from '$lib/api.service';
  import { authToken } from '$lib/auth.store.svelte';

  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let isSubmitting = $state(false);
  let errorMessage = $state<string | null>(null);

  // Evita mostrar la pantalla de registro si ya existe una sesión.
  $effect(() => {
    if (browser && authToken.value) {
      goto('/');
    }
  });

  // Valida los campos antes de crear la cuenta y reutiliza el login automático.
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedEmail || !trimmedPassword) {
      errorMessage = 'Introduce un email y contraseña validos.';
      return;
    }

    if (trimmedPassword.length < 6) {
      errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (trimmedPassword !== trimmedConfirm) {
      errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    isSubmitting = true;
    errorMessage = null;

    try {
      await api.register({ email: trimmedEmail, password: trimmedPassword });
      const result = await api.login({ email: trimmedEmail, password: trimmedPassword });
      authToken.set(result.token);
      goto('/');
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'No se pudo crear la cuenta. Inténtalo mas tarde.';
      errorMessage = message;
    } finally {
      isSubmitting = false;
    }
  }
</script>

<section class="flex items-center justify-center px-4 py-16">
  <div class="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-lg">
    <h1 class="mb-2 text-2xl font-bold text-slate-900">Crea tu cuenta</h1>
    <p class="mb-6 text-sm text-slate-600">
      Regístrate para empezar a gestionar tu videoteca desde el navegador.
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
          autocomplete="new-password"
          class="rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Minimo 6 caracteres"
          required
          type="password"
        />
      </label>

      <label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Confirma la contraseña
        <input
          bind:value={confirmPassword}
          autocomplete="new-password"
          class="rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Repite tu contraseña"
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
          Creando cuenta...
        {:else}
          Registrarme
        {/if}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-slate-600">
      Ya tienes cuenta?
      <a class="font-medium text-blue-600 hover:text-blue-700" href="/login">Inicia sesion</a>
    </p>
  </div>
</section>
