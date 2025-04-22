<template>
    <div>
       <nav aria-label="Breadcrumb" class="mb-6">
        <ol role="list" class="flex items-center space-x-2 text-sm text-gray-500">
          <li><RouterLink :to="{ name: 'home' }" class="hover:text-gray-700">Home</RouterLink></li>
          <li><svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" /></svg></li>
          <li><span class="font-medium text-gray-700">Respond to Poll</span></li>
        </ol>
      </nav>
  
      <div v-if="loading" class="text-center p-10">
         <p>Loading poll...</p>
          <svg class="animate-spin mx-auto mt-4 h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">...</svg>
      </div>
  
      <div v-else-if="poll" class="max-w-2xl mx-auto">
          <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center sr-only">Respond to Poll: {{ poll.question }}</h1>
          <PollRespondForm
              :poll="poll"
              :submitted="submitted"
              @response-submitted="handleResponse" />
  
           <div class="mt-8 text-center">
               <RouterLink :to="{ name: 'poll-results', params: { id: poll.id } }">
                   <BaseButton variant="secondary">View Results</BaseButton>
               </RouterLink>
          </div>
      </div>
  
      <div v-else class="text-center p-10 bg-red-50 border border-red-200 rounded-lg">
          <h2 class="text-xl font-semibold text-red-700">Poll Not Found</h2>
          <p class="text-red-600 mt-2">The poll you are looking for (ID: {{ pollId }}) does not exist or could not be loaded.</p>
           <RouterLink :to="{ name: 'home' }" class="mt-4 inline-block">
               <BaseButton variant="primary">Go Back Home</BaseButton>
           </RouterLink>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRoute, useRouter, RouterLink } from 'vue-router';
  import { usePollStore } from '@/store/pollStore';
  import type { Poll } from '@/types';
  import PollRespondForm from '@/components/polls/PollRespondForm.vue';
  import BaseButton from '@/components/common/BaseButton.vue';
  
  const route = useRoute();
  // const router = useRouter(); // No se usa actualmente, pero podría ser útil
  const pollStore = usePollStore();
  
  const pollId = computed(() => route.params.id as string);
  const poll = ref<Poll | null>(null); // Usar ref local para manejar estado de carga
  const loading = ref(true);
  const submitted = ref(false); // Estado para saber si ya se votó en esta sesión
  
  // Función para cargar el poll
  const loadPoll = () => {
      loading.value = true;
      submitted.value = false; // Resetea estado de envío al cargar/recargar
      // Simulamos una pequeña carga, aunque Pinia es síncrono
      setTimeout(() => {
          const foundPoll = pollStore.getPollById(pollId.value);
          if (foundPoll) {
               // Clonar objeto para evitar mutaciones directas del store si fuera necesario
               // poll.value = JSON.parse(JSON.stringify(foundPoll));
               poll.value = foundPoll;
          } else {
               poll.value = null; // Asegura que poll sea null si no se encuentra
          }
          loading.value = false;
      }, 200); // Simula delay
  };
  
  // Maneja el evento emitido por PollRespondForm
  const handleResponse = (emittedPollId: string, selectedOptionId: string) => {
       console.log(`Response submitted event received in view: Poll ID ${emittedPollId}, Option ID ${selectedOptionId}`);
       pollStore.addPollResponse(emittedPollId, selectedOptionId);
       submitted.value = true; // Marca como enviado para mostrar mensaje en PollRespondForm
       // Opcional: Redirigir a resultados inmediatamente
       // router.push({ name: 'poll-results', params: { id: emittedPollId } });
  };
  
  // Cargar el poll al montar el componente
  onMounted(loadPoll);
  
  // Observar cambios en el ID de la ruta (si el usuario navega entre polls sin salir de la vista)
  watch(pollId, loadPoll);
  
  </script>