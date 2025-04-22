<template>
    <div>
       <nav aria-label="Breadcrumb" class="mb-6">
         <ol role="list" class="flex items-center space-x-2 text-sm text-gray-500">
           <li><RouterLink :to="{ name: 'home' }" class="hover:text-gray-700">Home</RouterLink></li>
           <li><svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" /></svg></li>
           <li><span class="font-medium text-gray-700">Form Responses</span></li>
         </ol>
       </nav>
  
      <div v-if="loading" class="text-center p-10">
         <p>Loading form responses...</p>
         <svg class="animate-spin mx-auto mt-4 h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">...</svg>
      </div>
  
      <div v-else-if="form">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Responses: {{ form.title }}</h1>
        <p class="text-sm text-gray-600 mb-6 border-b pb-3">
          Total Responses Received: <span class="font-semibold">{{ responses.length }}</span>
        </p>
  
        <div v-if="responses.length > 0" class="overflow-x-auto bg-white shadow rounded-lg border">
           <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                  <tr>
                      <th scope="col" class="sticky left-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider z-10">
                          Submitted At
                      </th>
                      <th
                          v-for="question in form.questions"
                          :key="question.id"
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider truncate"
                          :title="question.text" 
                      >
                          {{ truncateText(question.text, 50) }} <span v-if="question.required" class="text-red-500 ml-1" title="Required question">*</span>
                      </th>
                  </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="response in responses" :key="response.id" class="hover:bg-gray-50 transition-colors">
                       <td class="sticky left-0 bg-white px-6 py-4 whitespace-nowrap text-sm text-gray-500 z-0">
                          {{ formatDateTime(response.submittedAt) }}
                      </td>
                      <td
                          v-for="question in form.questions"
                          :key="question.id"
                          class="px-6 py-4 text-sm text-gray-800 max-w-xs" 
                       >
                           <span class="whitespace-pre-wrap break-words">{{ response.answers[question.id] ?? '-' }}</span>
                       </td>
                  </tr>
              </tbody>
          </table>
        </div>
  
        <div v-else class="text-center text-gray-500 py-10 border border-dashed rounded-md bg-gray-50 mt-6">
              <p>No responses have been submitted for this form yet.</p>
              <RouterLink :to="{ name: 'form-respond', params: { id: form.id } }" class="mt-2 inline-block text-indigo-600 hover:underline">
                  Be the first to respond!
              </RouterLink>
         </div>
  
          <div class="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
               <RouterLink :to="{ name: 'form-respond', params: { id: form.id } }">
                   <BaseButton variant="secondary">Respond to Form Again</BaseButton>
               </RouterLink>
               <RouterLink :to="{ name: 'home' }">
                  <BaseButton variant="ghost">&larr; Back to Dashboard</BaseButton>
              </RouterLink>
          </div>
  
      </div>
  
      <div v-else class="text-center p-10 bg-red-50 border border-red-200 rounded-lg">
          <h2 class="text-xl font-semibold text-red-700">Form Not Found</h2>
          <p class="text-red-600 mt-2">Could not load responses for form ID: {{ formId }}.</p>
           <RouterLink :to="{ name: 'home' }" class="mt-4 inline-block">
               <BaseButton variant="primary">Go Back Home</BaseButton>
           </RouterLink>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRoute, RouterLink } from 'vue-router';
  import { useFormStore } from '@/store/formStore';
  import type { Form, FormResponse } from '@/types';
  import BaseButton from '@/components/common/BaseButton.vue';
  
  const route = useRoute();
  const formStore = useFormStore();
  
  const formId = computed(() => route.params.id as string);
  const form = ref<Form | null>(null);
  // Usamos la propiedad computada directamente del store para las respuestas, ya que Pinia maneja la reactividad
  const responses = computed(() => formStore.getResponsesForForm(formId.value));
  const loading = ref(true);
  
  // Carga la información del formulario (necesitamos las preguntas para las cabeceras)
  const loadFormData = () => {
      loading.value = true;
      setTimeout(() => {
          const foundForm = formStore.getFormById(formId.value);
          form.value = foundForm ? foundForm : null;
          loading.value = false;
          console.log("Loaded form data for responses view:", form.value);
          console.log("Responses found:", responses.value.length);
      }, 200); // Simula carga
  };
  
  // Función para formatear fecha y hora
  const formatDateTime = (date: Date | string): string => {
      try {
          const d = typeof date === 'string' ? new Date(date) : date;
          // Verifica si la fecha es válida
          if (isNaN(d.getTime())) {
              return 'Invalid Date';
          }
          // Formato localizado simple (ej: 4/22/2025, 8:15:30 AM)
          return d.toLocaleString(undefined, {
              year: 'numeric', month: 'numeric', day: 'numeric',
              hour: 'numeric', minute: '2-digit', /* second: '2-digit' */ // Omitir segundos
          });
      } catch (e) {
          console.error("Error formatting date:", date, e);
          return 'Invalid Date';
      }
  };
  
  // Función para truncar texto si es muy largo (para cabeceras)
  const truncateText = (text: string | undefined, maxLength: number): string => {
      if (!text) return '';
      if (text.length <= maxLength) {
          return text;
      }
      return text.substring(0, maxLength) + '...';
  };
  
  // Cargar al montar y al cambiar ID
  onMounted(loadFormData);
  watch(formId, loadFormData);
  
  </script>
  
  <style scoped>
  /* Estilos para hacer la primera columna (fecha) fija al hacer scroll horizontal */
  /* Tailwind no tiene clases directas para sticky table headers/columns complejas */
  /* por lo que añadimos CSS específico aquí */
  /* Requiere que el contenedor de la tabla tenga overflow-x-auto */
  
  /* Asegura que el header de la tabla se quede fijo si se necesita */
  /* thead {
    position: sticky;
    top: 0;
    z-index: 20;
  } */
  
  /* Hace la primera columna th y td fijas */
  th:first-child,
  td:first-child {
    position: sticky;
    left: 0;
    z-index: 10; /* Debe ser menor que el z-index del thead si el thead también es sticky */
  }
  
  /* Añade una sombra sutil a la columna fija para indicar que hay contenido debajo */
  th:first-child::after,
  td:first-child::after {
     content: '';
     position: absolute;
     top: 0;
     right: -1px; /* Ajusta según el borde */
     bottom: 0;
     width: 1px; /* Ancho de la sombra/línea */
     background: linear-gradient(to right, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0));
     pointer-events: none; /* Para no interferir con clics */
  }
  
  /* Ajuste de fondo para que no se vea transparente sobre otras celdas al hacer scroll */
  th:first-child {
     background-color: #f9fafb; /* bg-gray-50 */
  }
  td:first-child {
     background-color: #ffffff; /* bg-white */
  }
  
  
  /* Estilo para celdas con respuestas largas */
  td .whitespace-pre-wrap {
      white-space: pre-wrap; /* respeta saltos de línea y espacios */
      word-wrap: break-word; /* rompe palabras largas */
  }
  
  .max-w-xs {
      max-width: 20rem; /* Limita ancho máximo de celdas de respuesta */
  }
  </style>