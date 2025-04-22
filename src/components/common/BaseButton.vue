<template>
    <button
      :type="type"
      :disabled="disabled || loading"
      :class="[
          'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150',
          disabled || loading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90',
          variantClasses
      ]"
    >
      <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <slot v-if="!loading"></slot> <span v-else>Processing...</span> </button>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  type ButtonType = 'button' | 'submit' | 'reset';
  type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
  
  interface Props {
    type?: ButtonType;
    disabled?: boolean;
    loading?: boolean; // New prop for loading state
    variant?: ButtonVariant;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    type: 'button',
    disabled: false,
    loading: false,
    variant: 'primary', // Default variant
  });
  
  // Define classes based on variant
  const variantClasses = computed(() => {
      switch (props.variant) {
          case 'primary':
              return 'text-white bg-indigo-600 hover:bg-indigo-700';
          case 'secondary':
               return 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 border-indigo-300';
           case 'danger':
              return 'text-white bg-red-600 hover:bg-red-700';
           case 'success':
               return 'text-white bg-green-600 hover:bg-green-700';
           case 'warning':
               return 'text-white bg-yellow-500 hover:bg-yellow-600';
          case 'ghost':
               return 'text-gray-700 bg-transparent hover:bg-gray-100';
          default:
              return 'text-white bg-indigo-600 hover:bg-indigo-700'; // Fallback to primary
      }
  });
  
  </script>