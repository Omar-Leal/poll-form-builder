<template>
    <div class="space-y-12">
      <h1 class="text-3xl font-bold text-gray-800 border-b pb-4">Dashboard</h1>
  
      <section aria-labelledby="polls-heading">
        <div class="flex justify-between items-center mb-5">
          <h2 id="polls-heading" class="text-2xl font-semibold text-gray-700">Available Polls</h2>
          <RouterLink :to="{ name: 'poll-create' }">
            <BaseButton variant="primary">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
               </svg>
              Create New Poll
            </BaseButton>
          </RouterLink>
        </div>
        <div v-if="pollStore.polls.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="poll in pollStore.polls" :key="poll.id" class="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between">
             <div>
               <p class="font-semibold text-lg text-gray-800 mb-2">{{ poll.question }}</p>
               <p class="text-sm text-gray-500 mb-4">{{ poll.options.length }} options available</p>
               <p class="text-sm text-gray-600">Total Votes: {{ getTotalVotes(poll) }}</p>
             </div>
             <div class="mt-5 pt-4 border-t border-gray-100 flex justify-end space-x-3">
               <RouterLink :to="{ name: 'poll-respond', params: { id: poll.id } }">
                 <BaseButton size="sm" variant="secondary" title="Respond to this poll">Respond</BaseButton>
               </RouterLink>
               <RouterLink :to="{ name: 'poll-results', params: { id: poll.id } }">
                 <BaseButton size="sm" variant="success" title="View poll results">Results</BaseButton>
               </RouterLink>
             </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-10 border border-dashed rounded-md bg-gray-50">
          <p>No polls have been created yet.</p>
          <RouterLink :to="{ name: 'poll-create' }" class="mt-2 inline-block text-indigo-600 hover:underline">
              Create the first poll!
          </RouterLink>
        </div>
      </section>
  
      <section aria-labelledby="forms-heading">
        <div class="flex justify-between items-center mb-5">
          <h2 id="forms-heading" class="text-2xl font-semibold text-gray-700">Available Forms</h2>
           <RouterLink :to="{ name: 'form-create' }">
             <BaseButton variant="primary">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                       <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                   </svg>
              Create New Form
             </BaseButton>
           </RouterLink>
        </div>
         <div v-if="formStore.forms.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <div v-for="form in formStore.forms" :key="form.id" class="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between">
             <div>
               <p class="font-semibold text-lg text-gray-800 mb-2">{{ form.title }}</p>
               <p class="text-sm text-gray-500 mb-4">{{ form.questions.length }} {{ form.questions.length === 1 ? 'question' : 'questions' }}</p>
                <p class="text-sm text-gray-600">Total Responses: {{ getTotalResponses(form.id) }}</p>
             </div>
             <div class="mt-5 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                <RouterLink :to="{ name: 'form-respond', params: { id: form.id } }">
                 <BaseButton size="sm" variant="secondary" title="Respond to this form">Respond</BaseButton>
               </RouterLink>
               <RouterLink :to="{ name: 'form-responses', params: { id: form.id } }">
                 <BaseButton size="sm" variant="success" title="View form responses">Responses</BaseButton>
               </RouterLink>
             </div>
          </div>
        </div>
         <div v-else class="text-center text-gray-500 py-10 border border-dashed rounded-md bg-gray-50">
          <p>No forms have been created yet.</p>
           <RouterLink :to="{ name: 'form-create' }" class="mt-2 inline-block text-indigo-600 hover:underline">
              Create the first form!
          </RouterLink>
        </div>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import { usePollStore } from '@/store/pollStore';
  import { useFormStore } from '@/store/formStore';
  import BaseButton from '@/components/common/BaseButton.vue';
  import { RouterLink } from 'vue-router';
  import type { Poll } from '@/types';
  
  const pollStore = usePollStore();
  const formStore = useFormStore();
  
  // Helper para calcular votos totales de un poll (para mostrar en card)
  const getTotalVotes = (poll: Poll): number => {
      if (!poll.responses) return 0;
      return Object.values(poll.responses).reduce((sum, count) => sum + (count || 0), 0);
  };
  
  // Helper para obtener el número de respuestas de un form (para mostrar en card)
  const getTotalResponses = (formId: string): number => {
      // Accedemos directamente al getter computado del store
      return formStore.getResponsesForForm(formId).length;
  };
  </script>
  
  <style scoped>
  /* Estilos adicionales específicos si son necesarios */
  </style>