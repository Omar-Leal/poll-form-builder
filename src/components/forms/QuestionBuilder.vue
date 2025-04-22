<template>
    <div class="border p-5 rounded-lg mb-6 bg-gray-50 shadow-sm space-y-4 relative group">
       <div class="absolute top-2 right-2">
           <BaseButton
               @click="$emit('removeQuestion')"
               variant="danger"
               class="!p-1 !text-xs opacity-50 group-hover:opacity-100 transition-opacity"
               title="Remove Question"
           >
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
               </svg>
           </BaseButton>
       </div>
   
       <h4 class="font-medium text-gray-700 border-b pb-2 mb-4">Question {{ index + 1 }}</h4>
   
       <BaseInput
           label="Question Text"
           :modelValue="question.text"
           @update:modelValue="updateField('text', $event)"
           required
           placeholder="e.g., What is your primary email?"
           :error="errors?.text"
       />
   
       <div>
           <label :for="`q-type-${stableId}`" class="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
           <select
               :id="`q-type-${stableId}`"
               :value="question.type"
                @change="handleTypeChange(($event.target as HTMLSelectElement).value as QuestionType)"
               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
           >
               <option value="short-answer">Short Answer (Text)</option>
               <option value="long-answer">Long Answer (Textarea)</option>
               <option value="number">Number</option>
               <option value="radio">Radio Buttons (Single Choice)</option>
               </select>
       </div>
   
       <div v-if="question.type === 'radio'" class="mt-4 pl-4 border-l-2 border-indigo-200 space-y-3">
           <label class="block text-sm font-medium text-gray-700 mb-1">Radio Options (at least one required)</label>
           <div v-for="(option, optIndex) in localOptions" :key="optIndex" class="flex items-center gap-2">
                <BaseInput
                   :label="`Option ${optIndex + 1}`"
                   :aria-label="`Radio Option ${optIndex + 1}`"
                   v-model="localOptions[optIndex]"
                   :required="optIndex === 0"
                   class="flex-grow !mb-0" 
                   :error="errors?.options?.[optIndex]"
                   placeholder="Enter option text"
               />
                <BaseButton
                   type="button"
                   @click="removeRadioOption(optIndex)"
                   v-if="localOptions.length > 1"
                    variant="danger"
                    class="!px-2 !py-1 text-xs"
                   title="Remove option"
                   :disabled="localOptions.length <= 1"
               > Remove </BaseButton>
           </div>
            <BaseButton type="button" @click="addRadioOption" variant="success" class="text-sm !mt-3">
               Add Radio Option
           </BaseButton>
            <p v-if="errors?.radioOptionsGeneral" class="text-red-600 text-sm">{{ errors.radioOptionsGeneral }}</p>
       </div>
   
       <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 mt-4">
            <BaseInput
               label="Placeholder Text"
               optionalText="Optional"
               :modelValue="question.placeholder"
               @update:modelValue="updateField('placeholder', $event)"
               :disabled="question.type === 'radio'" 
               :hint="question.type === 'radio' ? 'Not applicable for radio buttons' : ''"
            />
   
            <div class="flex items-center h-full pt-6"> 
               <input
                   :id="`q-required-${stableId}`"
                   type="checkbox"
                   :checked="question.required"
                   @change="updateField('required', ($event.target as HTMLInputElement).checked)"
                   class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
               />
               <label :for="`q-required-${stableId}`" class="ml-2 block text-sm text-gray-900 select-none">
                   Make this question required
               </label>
           </div>
       </div>
    </div>
   </template>
   
   <script setup lang="ts">
   import { ref, watch, computed, PropType, reactive } from 'vue';
   import type { FormQuestion, QuestionType } from '@/types';
   import BaseInput from '@/components/common/BaseInput.vue';
   import BaseButton from '@/components/common/BaseButton.vue';
   // Podríamos necesitar BaseTextarea si quisiéramos previsualizar aquí, pero no es necesario para construir
   
   const props = defineProps({
       question: {
           type: Object as PropType<FormQuestion>,
           required: true
       },
       index: {
           type: Number,
           required: true
       }
   });
   
   const emit = defineEmits<{
     (e: 'update:question', value: FormQuestion): void
     (e: 'removeQuestion'): void
   }>();
   
   // ID estable para asociar labels y inputs dentro del componente
   const stableId = computed(() => props.question.id || `temp-${props.index}`);
   
   // Estado local para las opciones de radio para poder usar v-model directamente
   // Se sincroniza con las props cuando cambian externamente
   const localOptions = ref<string[]>([]);
   
   // Errores locales para esta instancia de pregunta
   const errors = reactive({
       text: null as string | null,
       options: [] as (string | null)[],
       radioOptionsGeneral: null as string | null,
   });
   
   // Función genérica para actualizar un campo de la pregunta
   const updateField = <K extends keyof FormQuestion>(field: K, value: FormQuestion[K]) => {
       // Validar campo específico al actualizar
       validateField(field, value);
       emit('update:question', { ...props.question, [field]: value });
   };
   
   // Manejar cambio de tipo de pregunta
   const handleTypeChange = (newType: QuestionType) => {
       const updatedQuestion = { ...props.question, type: newType };
       // Si cambia a radio, inicializa opciones si no existen. Si cambia *desde* radio, elimina las opciones.
       if (newType === 'radio') {
           if (!updatedQuestion.options || updatedQuestion.options.length === 0) {
                updatedQuestion.options = ['']; // Empieza con una opción vacía
                localOptions.value = ['']; // Actualiza estado local
                errors.options = [null]; // Inicializa error para la opción
           }
            updatedQuestion.placeholder = undefined; // Placeholder no aplica a radio
       } else {
           updatedQuestion.options = undefined; // Elimina opciones si no es radio
           localOptions.value = []; // Limpia estado local
           errors.options = []; // Limpia errores de opciones
       }
        // Validar campos relevantes tras el cambio de tipo
       validateField('text', updatedQuestion.text);
       validateField('options', updatedQuestion.options);
       emit('update:question', updatedQuestion);
   };
   
   // --- Manejo de Opciones de Radio (usando estado local `localOptions`) ---
   const updateRadioOptionsInParent = () => {
       // Filtra opciones vacías locales antes de emitir al padre
       const validOptions = localOptions.value.map(o => o.trim()).filter(o => o);
       // Valida que haya al menos una opción válida
        validateRadioOptions();
       emit('update:question', { ...props.question, options: validOptions });
   };
   
   const addRadioOption = () => {
       localOptions.value.push('');
       errors.options.push(null); // Añade espacio para posible error
       // No emitimos aún, solo al perder foco o cambiar
   };
   
   const removeRadioOption = (index: number) => {
       if (localOptions.value.length > 1) {
           localOptions.value.splice(index, 1);
           errors.options.splice(index, 1);
           updateRadioOptionsInParent(); // Emitir cambio al padre
       }
   };
   
   // Sincronizar localOptions con props.question.options cuando cambian
   watch(() => props.question.options, (newOptions) => {
       if (props.question.type === 'radio') {
           localOptions.value = newOptions ? [...newOptions] : [''];
            // Asegura que haya al menos un espacio para error si hay opciones
           errors.options = localOptions.value.map(() => null);
       } else {
            localOptions.value = [];
            errors.options = [];
       }
   }, { immediate: true, deep: true });
   
   // Observar cambios en localOptions para validarlos y emitir al padre
   watch(localOptions, () => {
        // Validar cada opción localmente
        localOptions.value.forEach((option, index) => {
            errors.options[index] = !option.trim() ? 'Option text cannot be empty.' : null;
        });
        validateRadioOptions(); // Valida el conjunto de opciones
        updateRadioOptionsInParent();
   }, { deep: true });
   // --- Fin Manejo Opciones Radio ---
   
   
   // --- Validación Específica del Componente ---
   const validateField = <K extends keyof FormQuestion>(field: K, value: FormQuestion[K]) => {
       switch (field) {
           case 'text':
                errors.text = !(value as string)?.trim() ? 'Question text is required.' : null;
               break;
           case 'options':
                if (props.question.type === 'radio') {
                   validateRadioOptions();
               }
               break;
           // Añadir más casos si es necesario
       }
   };
   
   const validateRadioOptions = () => {
        const validOptionsCount = localOptions.value.filter(o => o.trim()).length;
        if (props.question.type === 'radio' && validOptionsCount === 0) {
            errors.radioOptionsGeneral = 'At least one non-empty radio option is required.';
            // Podríamos marcar la primera opción como errónea también si está vacía
            if (localOptions.value.length > 0 && !localOptions.value[0].trim()) {
                errors.options[0] = 'First option cannot be empty.';
            }
        } else {
            errors.radioOptionsGeneral = null;
            // Limpiar errores individuales si la validación general pasa
            errors.options = errors.options.map(err => err === 'First option cannot be empty.' ? null : err);
        }
        return !errors.radioOptionsGeneral;
    };
   
   // Validar al montar el componente por si viene con datos inválidos
   import { onMounted } from 'vue';
   onMounted(() => {
       validateField('text', props.question.text);
       if (props.question.type === 'radio') {
           validateRadioOptions();
       }
   });
   
   </script>