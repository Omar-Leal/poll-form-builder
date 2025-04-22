<template>
    <div class="w-full">
      <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 mb-1">
        {{ label }}
        <span v-if="required" class="text-red-500 ml-1">*</span>
        <span v-if="optionalText && !required" class="text-gray-500 text-xs ml-1">({{ optionalText }})</span>
      </label>
      <div class="relative rounded-md shadow-sm">
         <input
          :id="inputId"
          :type="type"
          :value="modelValue"
          :placeholder="placeholder"
          :required="required"
          :disabled="disabled"
          :name="name || inputId"
          :min="min"
          :max="max"
          :step="step"
          @input="handleInput"
          @blur="$emit('blur', $event)"
          :class="[
              'block w-full sm:text-sm rounded-md',
              'focus:ring-indigo-500 focus:border-indigo-500',
               error ? 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300',
               disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
          ]"
          :aria-describedby="error ? `${inputId}-error` : undefined"
          :aria-invalid="!!error"
        />
         <div v-if="error" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
             <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
             </svg>
         </div>
      </div>
      <p v-if="error" :id="`${inputId}-error`" class="mt-1 text-sm text-red-600">
        {{ error }}
      </p>
       <p v-if="hint && !error" class="mt-1 text-sm text-gray-500">
         {{ hint }}
       </p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  // Define Input Types more broadly
  type InputType = 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'date' | 'time';
  
  interface Props {
    modelValue: string | number | null | undefined; // Allow undefined for initial state
    label?: string;
    id?: string;
    name?: string; // Added name attribute
    type?: InputType;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string | null; // Can be null to explicitly clear error
    hint?: string; // Helper text below input
    optionalText?: string; // Text to show if not required (e.g., 'Optional')
    // Props specific to type="number"
    min?: number | string;
    max?: number | string;
    step?: number | string;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    required: false,
    disabled: false,
    id: undefined,
    name: undefined,
    error: null,
    optionalText: 'Optional',
  });
  
  // Emit update event for v-model and potentially blur event
  const emit = defineEmits(['update:modelValue', 'blur']);
  
  // Generate a unique ID if none is provided, essential for label association
  const inputId = computed(() => props.id || `base-input-${Math.random().toString(36).substring(2, 9)}`);
  
  // Handle input event, casting to number if type is 'number'
  const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      let value: string | number | null = target.value;
  
      if (props.type === 'number') {
          // Allow empty string for clearing, otherwise parse as number
          value = value === '' ? null : parseFloat(value);
          // Handle potential NaN if parsing fails but input wasn't empty
          if (target.value !== '' && isNaN(value as number)) {
               value = props.modelValue; // Revert to previous value or handle differently
               console.warn("Invalid number input:", target.value);
          }
      }
      emit('update:modelValue', value);
  };
  
  </script>