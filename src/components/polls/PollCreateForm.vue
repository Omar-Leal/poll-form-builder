<template>
    <form @submit.prevent="handleSubmit" class="space-y-6 bg-white p-6 rounded-lg shadow">
      <BaseInput
        label="Poll Question"
        v-model="question"
        required
        placeholder="e.g., What is your favorite color?"
        :error="errors.question"
        @blur="validateQuestion"
      />
  
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Options (at least 2 required)</label>
        <div v-for="(option, index) in options" :key="index" class="flex items-start gap-2 mb-3">
          <BaseInput
            :label="`Option ${index + 1}`"
            :aria-label="`Option ${index + 1}`"
            v-model="options[index].text"
            :required="index < 2"
            class="flex-grow"
            placeholder="Enter option text"
            :error="errors.options[index]"
            @blur="validateOption(index)"
          />
          <BaseButton
            type="button"
            @click="removeOption(index)"
            v-if="options.length > 2"
            variant="danger"
            class="!px-2 !py-1 text-xs mt-7" 
            title="Remove option"
            :disabled="options.length <= 2"
          >
            Remove
          </BaseButton>
        </div>
        <div class="mt-2">
          <BaseButton type="button" @click="addOption" variant="success" class="text-sm">
            Add Option
          </BaseButton>
        </div>
         <p v-if="errors.general" class="text-red-600 text-sm mt-2">{{ errors.general }}</p>
      </div>
  
      <div class="flex justify-end pt-4 border-t border-gray-200">
          <BaseButton type="submit" :disabled="!isFormValid || loading" :loading="loading">
               {{ loading ? 'Creating...' : 'Create Poll' }}
          </BaseButton>
      </div>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, computed, watch } from 'vue';
  import BaseInput from '@/components/common/BaseInput.vue';
  import BaseButton from '@/components/common/BaseButton.vue';
  
  interface Option {
      text: string;
  }
  
  const emit = defineEmits<{
    // Emite un objeto con la pregunta y un array de strings (solo el texto de las opciones válidas)
    (e: 'pollCreated', pollData: { question: string, options: string[] }): void
  }>();
  
  const question = ref('');
  // Usar un array de objetos para manejar mejor la validación por índice si es necesario
  const options = ref<Option[]>([{ text: '' }, { text: '' }]); // Empezar con dos
  const loading = ref(false); // Para estado de carga
  
  // Objeto reactivo para errores
  const errors = reactive({
      question: null as string | null,
      options: [] as (string | null)[],
      general: null as string | null,
  });
  
  // --- Validación ---
  const validateQuestion = () => {
      errors.question = !question.value.trim() ? 'Question cannot be empty.' : null;
      clearGeneralError();
  };
  
  const validateOption = (index: number) => {
      errors.options[index] = !options.value[index].text.trim() && index < 2 ? 'First two options are required.' : null;
      // Si es una opción más allá de las 2 requeridas y está vacía, no es un error, pero se filtrará al enviar
      if (index >= 2 && !options.value[index].text.trim()) {
          errors.options[index] = null; // No marcar como error si está vacía pero no es requerida
      }
      clearGeneralError();
  };
  
  const validateAllOptions = () => {
      options.value.forEach((_, index) => validateOption(index));
  };
  
  const clearGeneralError = () => {
      errors.general = null;
  };
  
  const isFormValid = computed(() => {
      const hasValidQuestion = !!question.value.trim();
      const validOptions = options.value.filter(opt => opt.text.trim() !== '');
      const hasEnoughOptions = validOptions.length >= 2;
      // Verifica que no haya errores individuales activos
      const noIndividualErrors = !errors.question && errors.options.every(err => err === null);
  
      return hasValidQuestion && hasEnoughOptions && noIndividualErrors;
  });
  // --- Fin Validación ---
  
  const addOption = () => {
    options.value.push({ text: '' });
    // Inicializa el error para la nueva opción si es necesario
    errors.options.push(null);
  };
  
  const removeOption = (index: number) => {
    if (options.value.length > 2) {
      options.value.splice(index, 1);
      errors.options.splice(index, 1); // Remueve también el error asociado
    }
  };
  
  const handleSubmit = () => {
      clearGeneralError();
      validateQuestion();
      validateAllOptions();
  
      if (!isFormValid.value) {
          errors.general = "Please fix the errors before submitting.";
          console.warn("Form validation failed", errors);
          return;
      }
  
      loading.value = true;
      errors.general = null;
  
      // Filtra opciones vacías antes de emitir
      const validOptionsTexts = options.value
          .map(opt => opt.text.trim())
          .filter(text => text !== '');
  
      console.log("Emitting pollCreated with:", { question: question.value.trim(), options: validOptionsTexts });
      emit('pollCreated', { question: question.value.trim(), options: validOptionsTexts });
  
      // Simula un pequeño delay (opcional, podrías quitarlo si la redirección es inmediata)
      setTimeout(() => {
          loading.value = false;
           // Opcional: Resetear formulario aquí si no hay redirección inmediata desde la vista padre
           // question.value = '';
           // options.value = [{ text: '' }, { text: '' }];
           // errors.question = null;
           // errors.options = [null, null];
      }, 300);
  };
  
  // Observa cambios para revalidar dinámicamente (opcional, pero mejora UX)
  watch(question, validateQuestion);
  watch(options, validateAllOptions, { deep: true }); // deep watch para cambios en `text`
  
  </script>