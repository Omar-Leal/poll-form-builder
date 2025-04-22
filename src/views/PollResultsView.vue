<template>
    <div>
       <nav aria-label="Breadcrumb" class="mb-6">
        <ol role="list" class="flex items-center space-x-2 text-sm text-gray-500">
          <li><RouterLink :to="{ name: 'home' }" class="hover:text-gray-700">Home</RouterLink></li>
          <li><svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" /></svg></li>
          <li><span class="font-medium text-gray-700">Poll Results</span></li>
        </ol>
      </nav>
  
       <div v-if="loading" class="text-center p-10">
         <p>Loading results...</p>
          <svg class="animate-spin mx-auto mt-4 h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">...</svg>
      </div>
  
       <div v-else-if="poll" class="max-w-3xl mx-auto">
          <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center sr-only">Results for Poll: {{ poll.question }}</h1>
          <PollResults :poll="poll" />
  
           <div class="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
               <RouterLink :to="{ name: 'poll-respond', params: { id: poll.id } }">
                   <BaseButton variant="secondary">Respond to Poll</BaseButton>
               </RouterLink>
               <RouterLink :to="{ name: 'home' }">
                  <BaseButton variant="ghost">&larr; Back to Dashboard</BaseButton>
              </RouterLink>
          </div>
       </div>
  
      <div v-else class="text-center p-10 bg-red-50 border border-red-200 rounded-lg">
          <h2 class="text-xl font-semibold text-red-700">Poll Not Found</h2>
          <p class="text-red-600 mt-2">Could not load results for poll ID: {{ pollId }}.</p>
           <RouterLink :to="{ name: 'home' }" class="mt-4 inline-block">
               <BaseButton variant="primary">Go Back Home</BaseButton>
           </RouterLink>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRoute, RouterLink } from 'vue-router';
  import { usePollStore } from '@/store/pollStore';
  import type { Poll } from '@/types';
  import PollResults from '@/components/polls/PollResults.vue';
  import BaseButton from '@/components/common/BaseButton.vue';
  
  const route = useRoute();
  const pollStore = usePollStore();
  
  const pollId = computed(() => route.params.id as string);
  const poll = ref<Poll | null>(null);
  const loading = ref(true);
  
  // Función para cargar los datos del poll (que incluyen los resultados)
  const loadPollData = () => {
      loading.value = true;
      // Simular carga
      setTimeout(() => {
          // El store ya tiene los resultados dentro del objeto Poll
          const foundPoll = pollStore.getPollById(pollId.value);
          poll.value = foundPoll ? foundPoll : null;
          loading.value = false;
           console.log("Loaded poll data for results view:", poll.value);
      }, 200);
  };
  
  // Cargar al montar
  onMounted(loadPollData);
  
  // Recargar si cambia el ID en la ruta
  watch(pollId, loadPollData);
  
  </script>