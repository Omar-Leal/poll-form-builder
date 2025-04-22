<template>
    <fieldset :aria-labelledby="groupId" :disabled="disabled">
      <legend v-if="label" :id="groupId" class="text-sm font-medium text-gray-900 mb-1">
        {{ label }}
        <span v-if="required" class="text-red-500 ml-1">*</span>
        <span v-if="optionalText && !required" class="text-gray-500 text-xs ml-1">({{ optionalText }})</span>
      </legend>
      <div class="mt-2 space-y-2">
        <div v-for="(option, index) in options" :key="option.value" class="flex items-center">
          <input
            :id="`${name}-${option.value}`"
            :name="name"
            type="radio"
            :value="option.value"
            :checked="modelValue === option.value"
            :required="required && index === 0"  
            :disabled="disabled"
            @change="$emit('update:modelValue', option.value)"
            :class="[
              'h-4 w-4 border-gray-300 focus:ring-indigo-500',
               error ? 'text-red-600 border-red-300 focus:ring-red-500' : 'text-indigo-600',
               disabled ? 'opacity-70 cursor-not-allowed' : ''
            ]"
            :aria-describedby="error ? `${groupId}-error` : undefined"
          />
          <label
             :for="`${name}-${option.value}`"
             :class="[
               'ml-3 block text-sm font-medium',
                error ? 'text-red-800' : 'text-gray-700',
                disabled ? 'text-gray-500' : ''
             ]"
             >
            {{ option.label }}
          </label>
        </div>
      </div>
       <p v-if="error" :id="`${groupId}-error`" class="mt-1 text-sm text-red-600">
        {{ error }}
      </p>
       <p v-if="hint && !error" class="mt-1 text-sm text-gray-500">
         {{ hint }}
       </p>
    </fieldset>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  interface RadioOption {
    label: string;
    value: string | number; // Permitir valores string o number
  }
  
  interface Props {
    modelValue: string | number | null | undefined; // Valor seleccionado
    options: RadioOption[];
    name: string; // Esencial para agrupar, debe ser único por grupo en el form
    label?: string; // Leyenda para el grupo
    required?: boolean;
    disabled?: boolean;
    error?: string | null;
    hint?: string;
    optionalText?: string;
  }
  
  const props = withDefaults(defineProps<Props>(), {
      required: false,
      disabled: false,
      error: null,
      optionalText: 'Optional',
  });
  
  defineEmits(['update:modelValue']);
  
  // Genera un ID único para la leyenda/fieldset para aria-labelledby
  const groupId = computed(() => `radio-group-${props.name}-${Math.random().toString(36).substring(2, 9)}`);
  
  </script>