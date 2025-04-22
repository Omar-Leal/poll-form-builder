<template>
    <div>
      <nav aria-label="Breadcrumb" class="mb-6">
        <ol role="list" class="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <RouterLink :to="{ name: 'home' }" class="hover:text-gray-700">Home</RouterLink>
          </li>
          <li>
            <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
            </svg>
          </li>
          <li>
            <span class="font-medium text-gray-700">Create Poll</span>
          </li>
        </ol>
      </nav>
  
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Create a New Poll</h1>
  
      <PollCreateForm @poll-created="handleCreatePoll" />
  
       <div v-if="creationStatus.message" :class="['mt-4 p-3 rounded text-center', creationStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
           {{ creationStatus.message }}
       </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { reactive } from 'vue';
  import PollCreateForm from '@/components/polls/PollCreateForm.vue';
  import { usePollStore } from '@/store/pollStore';
  import { useRouter, RouterLink } from 'vue-router';
  
  const pollStore = usePollStore();
  const router = useRouter();
  
  // Estado para feedback simple
  const creationStatus = reactive({
      success: false,
      message: ''
  });
  
  // Define la estructura esperada de pollData del evento
  interface PollData {
      question: string;
      options: string[];
  }
  
  const handleCreatePoll = (pollData: PollData) => {
      console.log("Received pollCreated event in view with data:", pollData);
      creationStatus.message = ''; // Limpia mensaje anterior
  
      // Llama a la acción del store para añadir el poll
      const newPollId = pollStore.addPoll(pollData.question, pollData.options);
  
      if (newPollId) {
          creationStatus.success = true;
          creationStatus.message = 'Poll created successfully! Redirecting...';
          console.log(`Poll created with ID: ${newPollId}. Redirecting...`);
          // Redirige a la página de respuesta o resultados del nuevo poll
          setTimeout(() => {
              router.push({ name: 'poll-respond', params: { id: newPollId } });
              // O a resultados: router.push({ name: 'poll-results', params: { id: newPollId } });
          }, 1000); // Pequeño delay para que el usuario vea el mensaje
      } else {
          creationStatus.success = false;
          creationStatus.message = 'Failed to create poll. Please check the form for errors or try again.';
          // El store ya debería haber logueado el error específico o mostrado una alerta
          console.error("Poll creation failed in view.");
      }
  };
  </script>