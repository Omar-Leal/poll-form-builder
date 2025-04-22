<template>
  <div id="app"   class="min-h-screen font-sans bg-gradient-to-br from-blue-100 to-purple-200">
     <nav class="bg-indigo-700 text-white p-4 shadow-lg sticky top-0 z-10">
        <div class="container mx-auto flex justify-between items-center">
            <RouterLink :to="{ name: 'home' }" class="text-2xl font-bold hover:text-indigo-200 transition-colors">
                Vue Polls & Forms
            </RouterLink>
             <div class="space-x-4">
                 <RouterLink :to="{ name: 'home' }" class="hover:text-indigo-200 transition-colors">Home</RouterLink>
                 <RouterLink :to="{ name: 'poll-create' }" class="hover:text-indigo-200 transition-colors">Create Poll</RouterLink>
                 <RouterLink :to="{ name: 'form-create' }" class="hover:text-indigo-200 transition-colors">Create Form</RouterLink>
             </div>
        </div>
     </nav>

    <main class="container mx-auto p-6">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <footer class="text-center text-gray-500 text-sm py-6 mt-10 border-t border-gray-200">
        Frontend Challenge - Poll & Form Builder (No Backend) - {{ new Date().getFullYear() }}
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<style>
/* Estilos para transiciones de página (opcional) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Ajustes generales si son necesarios */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex-grow: 1;
}
</style>