<template>
    <div class="w-full">
      <label v-if="label" :for="textareaId" class="block text-sm font-medium text-gray-700 mb-1">
        {{ label }}
        <span v-if="required" class="text-red-500 ml-1">*</span>
        <span v-if="optionalText && !required" class="text-gray-500 text-xs ml-1">({{ optionalText }})</span>
      </label>
      <div class="mt-1 relative rounded-md shadow-sm">
        <textarea
          :id="textareaId"
          :value="modelValue"
          :placeholder="placeholder"
          :required="required"
          :disabled="disabled"
          :rows="rows"
          :name="name || textareaId"
          @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
          @blur="$emit('blur', $event)"
          :class="[
              'block w-full sm:text-sm rounded-md',
               'focus:ring-indigo-500 focus:border-indigo-500',
               error ? 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300',
               disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
          ]"
          :aria-describedby="error ? `${textareaId}-error` : undefined"
          :aria-invalid="!!error"
        ></textarea>
         <div v-if="error" class="absolute top-3 right-0 pr-3 flex items-center pointer-events-none">
             <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
             </svg>
         </div>
      </div>
       <p v-if="error" :id="`${textareaId}-error`" class="mt-1 text-sm text-red-600">
        {{ error }}
      </p>
       <p v-if="hint && !error" class="mt-1 text-sm text-gray-500">
         {{ hint }}
       </p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  interface Props {
    modelValue: string | null | undefined;
    label?: string;
    id?: string;
    name?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    rows?: number;
    error?: string | null;
    hint?: string;
    optionalText?: string;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    rows: 3, // Default number of rows
    required: false,
    disabled: false,
    id: undefined,
    name: undefined,
    error: null,
    optionalText: 'Optional',
  });
  
  // Emit update event for v-model and blur
  defineEmits(['update:modelValue', 'blur']);
  
  // Generate unique ID if none provided
  const textareaId = computed(() => props.id || `base-textarea-${Math.random().toString(36).substring(2, 9)}`);
  </script>