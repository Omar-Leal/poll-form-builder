<template>
    <div>
       <nav aria-label="Breadcrumb" class="mb-6">
         <ol role="list" class="flex items-center space-x-2 text-sm text-gray-500">
           <li><RouterLink :to="{ name: 'home' }" class="hover:text-gray-700">Home</RouterLink></li>
           <li><svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" /></svg></li>
           <li><span class="font-medium text-gray-700">Respond to Form</span></li>
         </ol>
       </nav>
  
       <div v-if="loading" class="text-center p-10">
         <p>Loading form...</p>
         <svg class="animate-spin mx-auto mt-4 h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">...</svg>
      </div>
  
      <div v-else-if="form && !submitted" class="max-w-3xl mx-auto">
           <FormRenderer :form="form" @form-submitted="handleFormSubmit" />
      </div>
  
      <div v-else-if="form && submitted" class="mt-6 p-6 bg-green-50 border border-green-300 text-green-800 rounded-lg text-center shadow-sm max-w-2xl mx-auto">
              <h2 class="text-xl font-semibold mb-3">Thank You!</h2>
              <p class="mb-4">Your response for "{{ form.title }}" has been submitted successfully.</p>
              <div class="flex justify-center space-x-4">
                   <RouterLink :to="{ name: 'form-responses', params: { id: formId } }">
                       <BaseButton variant="success">View All Responses</BaseButton>
                   </RouterLink>
                  <RouterLink :to="{ name: 'home' }">
                      <BaseButton variant="secondary">Back to Dashboard</BaseButton>
                  </RouterLink>
              </div>
       </div>
  
      <div v-else class="text-center p-10 bg-red-50 border border-red-200 rounded-lg">
          <h2 class="text-xl font-semibold text-red-700">Form Not Found</h2>
          <p class="text-red-600 mt-2">The form you are looking for (ID: {{ formId }}) does not exist.</p>
           <RouterLink :to="{ name: 'home' }" class="mt-4 inline-block">
               <BaseButton variant="primary">Go Back Home</BaseButton>
           </RouterLink>
      </div>
  
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRoute, RouterLink, useRouter } from 'vue-router';
  import { useFormStore } from '@/store/formStore';
  import type { Form, FormAnswers } from '@/types';
  import FormRenderer from '@/components/forms/FormRenderer.vue';
  import BaseButton from '@/components/common/BaseButton.vue';
  
  const route = useRoute();
  const router = useRouter(); // Para posible navegación post-submit
  const formStore = useFormStore();
  
  const formId = computed(() => route.params.id as string);
  const form = ref<Form | null>(null);
  const loading = ref(true);
  const submitted = ref(false); // Estado local para controlar visibilidad post-envío
  
  // Carga el formulario
  const loadForm = () => {
      loading.value = true;
      submitted.value = false; // Resetea estado de envío
      setTimeout(() => {
          const foundForm = formStore.getFormById(formId.value);
          form.value = foundForm ? foundForm : null;
          loading.value = false;
           console.log("Loaded form data for respond view:", form.value);
      }, 200); // Simula carga
  };
  
  // Maneja el evento de envío exitoso desde FormRenderer
  const handleFormSubmit = (emittedFormId: string, answers: FormAnswers) => {
      console.log(`Form submitted event received in view: Form ID ${emittedFormId}`, answers);
      // Llama a la acción del store para guardar la respuesta
      formStore.addFormResponse(emittedFormId, answers);
      submitted.value = true; // Cambia el estado para mostrar el mensaje de éxito
  
      // Opcional: Redirigir a otra página (ej: página de gracias o lista de respuestas)
      // router.push({ name: 'form-responses', params: { id: emittedFormId } });
      // O simplemente scroll hacia arriba para ver el mensaje de éxito
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Cargar al montar y al cambiar el ID de la ruta
  onMounted(loadForm);
  watch(formId, loadForm);
  
  </script>