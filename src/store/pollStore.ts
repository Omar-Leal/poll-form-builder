// src/store/pollStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Poll, PollOption } from '@/types';

// Helper for simple ID generation (replace with UUID in real app)
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export const usePollStore = defineStore('poll', () => {
    const polls = ref<Poll[]>([]);

    const getPollById = computed(() => {
        return (pollId: string) => polls.value.find(p => p.id === pollId);
    });

    function addPoll(question: string, optionsText: string[]) {
        if (!question || optionsText.length < 2) {
            console.error("Poll needs a question and at least two options.");
            return null; // Or throw error
        }

        const newPoll: Poll = {
            id: generateId(),
            question: question.trim(),
            options: optionsText
                .filter(text => text.trim() !== '')
                .map(text => ({ id: generateId(), text: text.trim() })),
            responses: {} // Initialize responses as empty object
        };

        // Initialize response counts to 0 for each option
        newPoll.options.forEach(option => {
            newPoll.responses[option.id] = 0;
        });


        polls.value.push(newPoll);
        console.log("Poll added:", newPoll);
        return newPoll.id; // Return the new poll's ID
    }

    function addPollResponse(pollId: string, selectedOptionId: string) {
        const poll = polls.value.find(p => p.id === pollId);
        if (poll && poll.options.some(opt => opt.id === selectedOptionId)) {
             // Ensure the response object exists (it should from addPoll)
            if (!poll.responses) {
                poll.responses = {};
            }
             // Ensure the specific option ID exists as a key
            if (poll.responses[selectedOptionId] === undefined) {
               console.warn(`Option ID ${selectedOptionId} not initialized in responses for poll ${pollId}. Initializing.`);
               poll.responses[selectedOptionId] = 0; // Initialize if somehow missed
            }
            poll.responses[selectedOptionId]++;
            console.log("Poll response added:", pollId, selectedOptionId, poll.responses);
        } else {
            console.error("Poll or Option not found for response:", pollId, selectedOptionId);
        }
    }


    addPoll("What's your favorite framework?", ["Vue", "React", "Angular", "Svelte"]);
    addPoll("Best programming language for web?", ["JavaScript", "Python", "Ruby", "PHP"]);

    return {
        polls,
        getPollById,
        addPoll,
        addPollResponse,
    };
});