<template>
    <fieldset>
      <legend v-if="label" class="text-sm font-medium text-gray-900 mb-1">
        {{ label }} <span v-if="required" class="text-red-500">*</span>
      </legend>
      <div class="mt-2 space-y-2">
        <div v-for="option in options" :key="option.value" class="flex items-center">
          <input
            :id="`<span class="math-inline">\{name\}\-</span>{option.value}`"
            :name="name"
            type="radio"
            :value="option.value"
            :checked="modelValue === option.value"
            :required="required && index === 0"
            @change="$emit('update:modelValue', option.value)"
            class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label :for="`<span class="math-inline">\{name\}\-</span>{option.value}`" class="ml-3 block text-sm font-medium text-gray-700">
            {{ option.label }}
          </label>
        </div>
      </div>
       <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    </fieldset>
  </template>
  
  <script setup lang="ts">
  interface RadioOption {
    label: string;
    value: string | number; // Allow string or number values
  }
  
  interface Props {
    modelValue: string | number | null; // Value of the selected radio
    options: RadioOption[];
    name: string; // Essential for grouping radio buttons
    label?: string;
    required?: boolean;
    error?: string;
  }
  defineProps<Props>();
  defineEmits(['update:modelValue']);
  
  </script>