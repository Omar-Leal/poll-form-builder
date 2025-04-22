// src/store/pollStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Poll } from '@/types';

// Helper para ID simple (NO USAR EN PRODUCCIÓN)
const generateId = () => `poll-${Date.now().toString(36)}${Math.random().toString(36).substring(2, 5)}`;
const generateOptionId = () => `opt-${Date.now().toString(36)}${Math.random().toString(36).substring(2, 5)}`;

export const usePollStore = defineStore('poll', () => {
    // Estado: Usamos ref para reactividad
    const polls = ref<Poll[]>([]);

    // Getters: Propiedades computadas para acceder/derivar estado
    const getPollById = computed(() => {
        return (pollId: string): Poll | undefined => polls.value.find(p => p.id === pollId);
    });

    // Actions: Funciones para modificar el estado
    function addPoll(question: string, optionsText: string[]) {
        if (!question || !question.trim()) {
            console.error("Poll question cannot be empty.");
            alert("Poll question cannot be empty."); // Feedback simple
            return null;
        }
        const validOptionsText = optionsText.map(opt => opt.trim()).filter(opt => opt !== '');
        if (validOptionsText.length < 2) {
            console.error("Poll needs at least two non-empty options.");
            alert("Poll needs at least two non-empty options."); // Feedback simple
            return null;
        }

        const newPoll: Poll = {
            id: generateId(),
            question: question.trim(),
            options: validOptionsText.map(text => ({
                id: generateOptionId(),
                text: text
            })),
            responses: {} // Inicializa objeto de respuestas vacío
        };

        // Inicializa contador a 0 para cada opción
        newPoll.options.forEach(option => {
            newPoll.responses[option.id] = 0;
        });

        polls.value.push(newPoll); // Añade el nuevo poll al array reactivo
        console.log("Poll added:", newPoll);
        return newPoll.id; // Devuelve el ID para posible redirección
    }

    function addPollResponse(pollId: string, selectedOptionId: string) {
        const pollIndex = polls.value.findIndex(p => p.id === pollId);
        if (pollIndex === -1) {
            console.error("Poll not found for response:", pollId);
            alert("Error: Poll not found.");
            return;
        }

        const poll = polls.value[pollIndex];

        // Verifica que la opción exista en el poll
        if (!poll.options.some(opt => opt.id === selectedOptionId)) {
             console.error("Invalid option selected:", selectedOptionId, "for poll:", pollId);
             alert("Error: Invalid option selected.");
             return;
        }

        // Asegura que el ID de la opción exista en las respuestas (debería por addPoll)
        if (typeof poll.responses[selectedOptionId] !== 'number') {
            console.warn(`Response count for option ${selectedOptionId} was not initialized correctly. Setting to 0.`);
            poll.responses[selectedOptionId] = 0; // Inicializa por si acaso
        }

        poll.responses[selectedOptionId]++; // Incrementa el contador
        console.log("Poll response added:", pollId, selectedOptionId, "New counts:", poll.responses);
        // No es necesario polls.value[pollIndex] = poll porque los objetos anidados son reactivos
    }

    // --- Datos de Ejemplo Iniciales (Opcional) ---
    const initializeExamplePolls = () => {
        if (polls.value.length === 0) { // Solo si está vacío
             console.log("Initializing example polls...");
            addPoll("What's your favorite Vue 3 feature?", ["Composition API", "Teleport", "<script setup>", "Suspense"]);
            addPoll("Preferred state management for Vue?", ["Pinia", "Vuex 4", "Jotai/Zustand-like", "None"]);
        }
    };
    // Llama a la inicialización al crear el store
    initializeExamplePolls();
    // --- Fin Datos de Ejemplo ---


    // Devuelve estado, getters y actions
    return {
        polls,
        getPollById,
        addPoll,
        addPollResponse,
    };
},
// { persist: true } // Descomenta esto si instalas `pinia-plugin-persistedstate` para guardar en localStorage
);