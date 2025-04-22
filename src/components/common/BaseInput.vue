<template>
    <div>
      <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">{{ label }} <span v-if="required" class="text-red-500">*</span></label>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50 disabled:bg-gray-100"
        :disabled="disabled"
      />
      <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  interface Props {
    modelValue: string | number | null;
    label?: string;
    id?: string;
    type?: 'text' | 'number' | 'email' | 'password'; // Add more as needed
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string; // For validation errors
  }
  
  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    required: false,
    disabled: false,
    id: () => `input-${Math.random().toString(36).substring(2)}`, // Generate default ID
  });
  
  defineEmits(['update:modelValue']);
  
  // Optional: Generate default ID if not provided
  // const defaultId = `input-${Math.random().toString(36).substring(2)}`;
  // const inputId = computed(() => props.id || defaultId);
  
  </script>