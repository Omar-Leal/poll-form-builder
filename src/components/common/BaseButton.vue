<template>
    <button
      :type="type"
      :disabled="disabled"
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <slot></slot>
    </button>
  </template>
  
  <script setup lang="ts">
  interface Props {
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
  }
  
  withDefaults(defineProps<Props>(), {
    type: 'button',
    disabled: false,
  });
  </script>