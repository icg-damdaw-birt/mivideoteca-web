<script lang="ts">
  // CSS global: se aplica a toda la aplicación
  import '../app.css';
  import Header from '$lib/components/Header.svelte';

  const year = new Date().getFullYear();
</script>

<!-- Layout wrapper: Header + contenido dinámico + Footer -->
<!-- Este layout se aplica a todas las páginas de la aplicación -->
<div class="flex min-h-screen flex-col bg-slate-100">
  <Header />
  <main class="flex-1">
    <!-- <slot /> es donde se renderiza cada página específica -->
    <slot />
  </main>
  <footer class="bg-slate-900 py-4 text-center text-sm text-slate-200">
    MiVideoteca - {year}
  </footer>
</div>
