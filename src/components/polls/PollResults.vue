<template>
    <div v-if="poll" class="bg-white p-6 rounded-lg shadow">
      <h3 class="text-xl font-semibold mb-2 text-gray-800">{{ poll.question }}</h3>
      <p class="text-sm text-gray-600 mb-5 border-b pb-3">
          Total Votes: <span class="font-bold">{{ totalVotes }}</span>
      </p>
      <ul v-if="totalVotes > 0" class="space-y-4">
        <li v-for="option in poll.options" :key="option.id">
          <div class="flex justify-between items-center mb-1 text-sm">
            <span class="text-gray-800 font-medium">{{ option.text }}</span>
            <span class="font-medium text-gray-600">
              {{ getVotes(option.id) }} vote(s)
               <span class="text-xs text-gray-500">({{ getPercentage(option.id) }}%)</span>
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
            <div
              class="bg-gradient-to-r from-indigo-500 to-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
              :style="{ width: getPercentage(option.id) + '%' }"
              role="progressbar"
              :aria-valuenow="getVotes(option.id)"
              :aria-valuemin="0"
              :aria-valuemax="totalVotes"
              :aria-label="`${option.text}: ${getPercentage(option.id)}%`"
            ></div>
          </div>
        </li>
      </ul>
      <div v-else class="text-center text-gray-500 py-6">
          <p>No votes have been cast yet for this poll.</p>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 p-6">
         <p>Loading poll results...</p>
         </div>
  </template>
  
  <script setup lang="ts">
  import { computed, PropType } from 'vue';
  import type { Poll } from '@/types';
  
  const props = defineProps({
      poll: {
          type: Object as PropType<Poll | null | undefined>, // Permitir null/undefined
          required: false,
          default: null,
      }
  });
  
  const totalVotes = computed(() => {
    // Suma los valores del objeto 'responses'
    if (!props.poll?.responses) return 0;
    return Object.values(props.poll.responses).reduce((sum, count) => sum + (count || 0), 0);
  });
  
  const getVotes = (optionId: string): number => {
      // Devuelve el conteo para un ID de opción, o 0 si no existe
      return props.poll?.responses?.[optionId] ?? 0;
  };
  
  const getPercentage = (optionId: string): string => {
    const votes = getVotes(optionId);
    const total = totalVotes.value;
    if (total === 0) {
      return '0.0'; // Evita división por cero
    }
    // Calcula porcentaje y formatea a un decimal
    return ((votes / total) * 100).toFixed(1);
  };
  </script>
  
  <style scoped>
  /* Pequeños ajustes si Tailwind no es suficiente */
  .transition-all {
      transition-property: all;
  }
  .duration-500 {
      transition-duration: 500ms;
  }
  .ease-out {
      transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  </style>