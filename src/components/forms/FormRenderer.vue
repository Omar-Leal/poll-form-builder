<template>
    <div v-if="form" class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-5 pb-4 border-b text-gray-800">{{ form.title }}</h2>
  
       <form @submit.prevent="handleFormSubmit" class="space-y-1">
          <QuestionRenderer
              v-for="(question, index) in form.questions"
              :key="question.id"
              :question="question"
              v-model="answers[question.id]"
              :error="errors[question.id]"
              @blur="validateField(question.id)" 
         />
  
          <p v-if="errors.general" class="text-red-600 text-sm mt-6 p-3 bg-red-50 border border-red-200 rounded">
              {{ errors.general }}
         </p>
  
          <div class="flex justify-end pt-6 border-t border-gray-200 mt-8">
             <BaseButton type="submit" :disabled="loading" :loading="loading" variant="primary">
                 {{ loading ? 'Submitting...' : 'Submit Response' }}
             </BaseButton>
         </div>
      </form>
    </div>
     <div v-else class="text-center text-gray-500 p-10">
          <p>Loading form...</p>
          <svg class="animate-spin mx-auto mt-4 h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
               <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
     </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, PropType, watch, nextTick } from 'vue';
  import type { Form, FormAnswers, FormQuestion } from '@/types';
  import QuestionRenderer from './QuestionRenderer.vue';
  import BaseButton from '@/components/common/BaseButton.vue';
  
  const props = defineProps({
      form: {
          type: Object as PropType<Form | null | undefined>, // Permitir null/undefined durante carga
          required: false,
          default: null,
      }
  });
  
   const emit = defineEmits<{
    // Emite el ID del form y las respuestas cuando se envía con éxito
    (e: 'formSubmitted', formId: string, answers: FormAnswers): void
  }>();
  
  // Objeto reactivo para almacenar las respuestas del usuario { questionId: answer }
  const answers = reactive<FormAnswers>({});
  // Objeto reactivo para almacenar errores de validación por questionId + general
  const errors = reactive<Record<string, string | null>>({});
  const loading = ref(false); // Estado de carga para el envío
  
  // --- Inicialización y Observación ---
  
  // Inicializa/resetea las respuestas y errores cuando el 'form' prop cambia
   watch(() => props.form, (newForm, oldForm) => {
      if (newForm && newForm.id !== oldForm?.id) {
          console.log("Form prop changed, resetting answers and errors for form:", newForm.id);
           // Limpia respuestas y errores anteriores
          Object.keys(answers).forEach(key => delete answers[key]);
          Object.keys(errors).forEach(key => delete errors[key]);
  
          // Inicializa las respuestas con null para cada pregunta del nuevo form
          newForm.questions.forEach(q => {
              answers[q.id] = null; // O valor por defecto si lo hubiera
              errors[q.id] = null; // Inicializa error a null
          });
           errors.general = null; // Resetea error general
      }
   }, { immediate: true }); // immediate: true para ejecutar al montar
  
  // --- Validación ---
  
  // Valida un campo específico (llamado en @blur de QuestionRenderer)
  const validateField = (questionId: string) => {
      const question = props.form?.questions.find(q => q.id === questionId);
      if (!question) return; // Si la pregunta no existe, no hacer nada
  
       const answer = answers[questionId];
       let error: string | null = null;
  
       // Validación de Requerido
       if (question.required) {
           const isEmpty = answer === null || answer === undefined || String(answer).trim() === '';
          if (isEmpty) {
              error = `This field is required.`;
          }
       }
  
       // Validación específica de tipo (Ejemplo: número)
       if (!error && question.type === 'number' && answer !== null && answer !== undefined && typeof answer !== 'number') {
           // Esto podría pasar si BaseInput falla al convertir, aunque no debería
           error = `Please enter a valid number.`;
       }
  
       // Añadir más validaciones aquí (ej: email format, number range)
  
       errors[questionId] = error; // Actualiza el error para este campo
       clearGeneralError(); // Limpia el error general al validar un campo individual
  };
  
  // Valida todo el formulario (llamado antes de enviar)
  const validateForm = (): boolean => {
      let isValid = true;
      errors.general = null; // Limpia error general previo
  
      if (!props.form) {
          errors.general = "Form data is missing.";
          return false;
      }
  
      // Itera sobre cada pregunta y valida
      props.form.questions.forEach(question => {
          validateField(question.id); // Llama a la validación individual
          if (errors[question.id]) { // Si la validación individual encontró un error
              isValid = false;
          }
      });
  
      if (!isValid) {
          errors.general = "Please correct the errors highlighted above.";
           // Opcional: Scroll al primer error (UX avanzada)
          nextTick(() => {
               const firstErrorElement = document.querySelector('[aria-invalid="true"]');
               firstErrorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
      }
  
      return isValid;
  };
  
  const clearGeneralError = () => {
       errors.general = null;
  }
  // --- Fin Validación ---
  
  
  // --- Envío ---
  const handleFormSubmit = () => {
      if (!props.form) {
          console.error("Form data not available for submission.");
          errors.general = "Cannot submit: Form data is missing.";
          return;
      }
  
      if (!validateForm()) {
          console.warn("Form validation failed.");
          return; // Detiene el envío si la validación falla
      }
  
      loading.value = true;
      errors.general = null;
  
      // Simula el envío de datos
      setTimeout(() => {
           console.log("Form submitted successfully with answers:", answers);
           // Emitir los datos al componente padre (la vista)
           // Es importante enviar una copia de 'answers' para evitar mutaciones inesperadas
           emit('formSubmitted', props.form!.id, { ...answers });
           loading.value = false;
  
           // Opcional: Resetear el formulario aquí, pero usualmente la vista padre
           // mostrará un mensaje de éxito o redirigirá.
           // if (props.form) {
           //    props.form.questions.forEach(q => answers[q.id] = null);
           // }
      }, 1000); // Simula delay de red
  };
  // --- Fin Envío ---
  
  </script>