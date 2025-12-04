<script lang="ts">
  import { goto } from '$app/navigation';
  import { authToken } from '$lib/auth.store.svelte';

  // Acción de logout: limpia el token y redirige
  function logout() {
    authToken.clear();   // Limpia localStorage + store
    goto('/login');      // Navegación programática
  }
</script>

<!-- Header responsivo: muestra diferentes opciones según el estado de autenticación -->
<header class="bg-white shadow">
  <nav class="container mx-auto flex items-center justify-between px-6 py-4">
    <a href="/" class="text-xl font-bold text-slate-800">MiVideoteca</a>
    <div class="flex items-center gap-3">
      {#if authToken.value}
        <button
          type="button"
          class="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          onclick={logout}
        >
          Cerrar sesión
        </button>
      {:else}
        <a href="/login" class="rounded px-4 py-2 text-slate-700 hover:bg-slate-100">Iniciar sesión</a>
        <a
          href="/register"
          class="rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          Crear cuenta
        </a>
      {/if}
    </div>
  </nav>
</header>
