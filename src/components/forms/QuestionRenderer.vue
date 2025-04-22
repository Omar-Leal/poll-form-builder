<template>
    <div class="mb-6 p-5 border border-gray-200 rounded-lg bg-white shadow-sm">
       <BaseInput
           v-if="question.type === 'short-answer'"
           :label="question.text"
           :id="question.id"
           :name="question.id"
           :required="question.required"
           :placeholder="question.placeholder"
           :modelValue="modelValue as string | null"
           @update:modelValue="$emit('update:modelValue', $event)"
           :error="error"
           type="text"
       />
       <BaseTextarea
           v-else-if="question.type === 'long-answer'"
           :label="question.text"
           :id="question.id"
           :name="question.id"
           :required="question.required"
           :placeholder="question.placeholder"
           :modelValue="modelValue as string | null"
           @update:modelValue="$emit('update:modelValue', $event)"
           :error="error"
           rows="4"
       />
        <BaseInput
           v-else-if="question.type === 'number'"
           :label="question.text"
           :id="question.id"
           :name="question.id"
           :required="question.required"
           :placeholder="question.placeholder"
           :modelValue="modelValue as number | null"
           @update:modelValue="$emit('update:modelValue', $event)" // BaseInput ya maneja la conversión a number/null
           :error="error"
           type="number"
           step="any" // Permitir decimales por defecto, se puede configurar si es necesario
       />
       <BaseRadioGroup
           v-else-if="question.type === 'radio' && question.options"
           :label="question.text"
           :name="question.id" 
           :required="question.required"
           :options="radioOptions"
           :modelValue="modelValue as string | number | null" // El valor podría ser string o number si las opciones lo son
           @update:modelValue="$emit('update:modelValue', $event)"
           :error="error"
       />
       <div v-else class="text-red-600 bg-red-50 p-3 rounded border border-red-200">
            <p><strong>Error:</strong> Unrecognized question type or missing options for question:</p>
            <p class="mt-1 text-sm">{{ question.text }} (Type: {{ question.type }})</p>
       </div>
    </div>
   </template>
   
   <script setup lang="ts">
   import { computed, PropType } from 'vue';
   import type { FormQuestion } from '@/types';
   import BaseInput from '@/components/common/BaseInput.vue';
   import BaseTextarea from '@/components/common/BaseTextarea.vue';
   import BaseRadioGroup from '@/components/common/BaseRadioGroup.vue';
   
   const props = defineProps({
       question: {
           type: Object as PropType<FormQuestion>,
           required: true
       },
       modelValue: { // La respuesta actual para esta pregunta (viene de v-model en el padre)
            type: [String, Number, null] as PropType<string | number | null>,
            default: null // Valor inicial si no se proporciona
       },
       error: { // Prop para pasar errores de validación desde el padre
           type: String as PropType<string | null>,
           default: null,
       }
   });
   
   // Emite el evento estándar para que v-model funcione
   defineEmits(['update:modelValue']);
   
   // Formatea las opciones de string[] a { label: string, value: string | number }[] para BaseRadioGroup
   const radioOptions = computed(() => {
       if (props.question.type !== 'radio' || !props.question.options) {
           return []; // Devuelve array vacío si no es radio o no hay opciones
       }
       // Mapea cada string de opción a un objeto { label, value }
       return props.question.options.map(opt => ({
           label: opt, // Usa el texto de la opción como etiqueta visible
           value: opt  // Usa el texto de la opción también como valor interno (podría ser diferente si se necesitara ID)
       }));
   });
   
   </script>