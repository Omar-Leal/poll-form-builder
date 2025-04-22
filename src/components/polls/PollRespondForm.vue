<template>
    <div v-if="poll" class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-xl font-semibold mb-4 text-gray-800">{{ poll.question }}</h3>
        <form @submit.prevent="submitResponse" v-if="!submitted">
            <BaseRadioGroup
                v-model="selectedOptionId"
                :options="pollOptions"
                :name="`poll-${poll.id}`"
                required
                :error="error"
                label="Select your choice:"
                class="mb-5"
            />
             <div class="flex justify-start">
                 <BaseButton type="submit" :disabled="!selectedOptionId || loading" :loading="loading">
                    {{ loading ? 'Voting...' : 'Submit Vote' }}
                 </BaseButton>
            </div>
        </form>
        <div v-else class="mt-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-md text-center">
             <p class="font-medium">Thank you for your vote!</p>
        </div>
    </div>
    <div v-else class="text-center text-gray-500 p-6">
        <p>Loading poll information...</p>
         </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType } from 'vue';
import type { Poll } from '@/types';
import BaseRadioGroup from '@/components/common/BaseRadioGroup.vue';
import BaseButton from '@/components/common/BaseButton.vue';

const props = defineProps({
    poll: {
        type: Object as PropType<Poll | null | undefined>, // Permitir null/undefined mientras carga
        required: false, // Cambiado a false para manejar estado de carga
        default: null,
    },
     submitted: { // Prop para indicar si ya se ha enviado (controlado por la vista padre)
         type: Boolean,
         default: false,
     }
});

const emit = defineEmits<{
  (e: 'responseSubmitted', pollId: string, selectedOptionId: string): void
}>();

const selectedOptionId = ref<string | null>(null); // Almacena el ID de la opción seleccionada
const loading = ref(false);
const error = ref<string | null>(null); // Error específico de este formulario

const pollOptions = computed(() => {
    if (!props.poll) return [];
    return props.poll.options.map(opt => ({
        label: opt.text,
        value: opt.id // Usa el ID de la opción como valor interno
    }));
});

const submitResponse = () => {
    error.value = null; // Limpia error anterior
    if (!selectedOptionId.value) {
         error.value = "Please select an option before submitting.";
        return;
    }
    if (!props.poll) {
        error.value = "Cannot submit response, poll data is missing.";
        return;
    }

    loading.value = true;

    // Simula envío
    setTimeout(() => {
        if (selectedOptionId.value && props.poll) { // Doble check por si acaso
             emit('responseSubmitted', props.poll.id, selectedOptionId.value);
             // El estado 'submitted' lo maneja el padre basado en la emisión de este evento.
        }
        loading.value = false;
        // No reseteamos selectedOptionId aquí, el padre puede desmontar/ocultar el form
    }, 500); // Simula network delay
};
</script>