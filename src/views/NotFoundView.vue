<template>
    <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 class="text-6xl font-bold text-indigo-600 mb-4">404</h1>
      <h2 class="text-3xl font-semibold text-gray-800 mb-3">Page Not Found</h2>
      <p class="text-gray-600 mb-8 max-w-md">
        Oops! The page you are looking for doesn't seem to exist. It might have been moved, deleted, or maybe you just mistyped the URL.
      </p>
      <RouterLink :to="{ name: 'home' }">
        <BaseButton variant="primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Go Back Home
        </BaseButton>
      </RouterLink>
    </div>
  </template>
  
  <script setup lang="ts">
  import BaseButton from '@/components/common/BaseButton.vue';
  import { RouterLink } from 'vue-router';
  </script>