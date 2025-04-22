<template>
    <form @submit.prevent="handleFormSubmit" class="space-y-8 bg-white p-6 rounded-lg shadow">
         <BaseInput
            label="Form Title"
            v-model="formTitle"
            required
            placeholder="e.g., Customer Satisfaction Survey"
            :error="errors.title"
            @blur="validateTitle"
            class="text-lg font-semibold"
        />

        <div v-if="questions.length > 0" class="space-y-4 border-t border-b border-gray-200 py-6">
             <h3 class="text-lg font-medium text-gray-800 mb-4">Form Questions</h3>
             <QuestionBuilder
                v-for="(question, index) in questions"
                :key="question.id" 
                :question="question"
                :index="index"
                @update:question="updateQuestion(index, $event)"
                @removeQuestion="removeQuestion(index)"
             />
        </div>
        <div v-else class="text-center text-gray-500 py-8 border border-dashed rounded-md">
            <p>Your form currently has no questions.</p>
            <p class="mt-2">Click "Add Question" to get started.</p>
        </div>

        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
             <BaseButton type="button" @click="addQuestion" variant="success">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                     <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Question
            </BaseButton>
            <div>
                <p v-if="errors.general" class="text-red-600 text-sm mb-2 text-right">{{ errors.general }}</p>
                 <BaseButton type="submit" :disabled="!canSubmit" :loading="loading" variant="primary">
                    {{ loading ? 'Creating...' : 'Create Form' }}
                </BaseButton>
            </div>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import type { FormQuestion } from '@/types';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import QuestionBuilder from './QuestionBuilder.vue';

// Helper para generar IDs únicos (NO USAR EN PROD)
const generateQuestionId = () => `q-${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`;

const emit = defineEmits<{
  (e: 'formCreated', formData: { title: string, questions: FormQuestion[] }): void
}>();

const formTitle = ref('');
// Usamos ref<FormQuestion[]> para el array de preguntas
const questions = ref<FormQuestion[]>([]);
const loading = ref(false);

// Errores generales del formulario
const errors = reactive({
    title: null as string | null,
    general: null as string | null,
});

// --- Validación ---
const validateTitle = () => {
    errors.title = !formTitle.value.trim() ? 'Form title is required.' : null;
    clearGeneralError();
};

const clearGeneralError = () => { errors.general = null; };

// Validación general del formulario antes de enviar
const isFormValid = computed(() => {
    const isTitleValid = !!formTitle.value.trim();
    const hasQuestions = questions.value.length > 0;
    // Verifica que cada pregunta individual sea válida (simplificado: que tenga texto y opciones si es radio)
    const allQuestionsValid = questions.value.every(q => {
        const hasText = !!q.text?.trim();
        const hasValidOptions = q.type !== 'radio' || (q.options && q.options.length >= 1 && q.options.every(opt => !!opt?.trim()));
        return hasText && hasValidOptions;
    });

    return isTitleValid && hasQuestions && allQuestionsValid;
});

// Computada para habilitar/deshabilitar el botón de submit
const canSubmit = computed(() => isFormValid.value && !loading.value);
// --- Fin Validación ---


const addQuestion = () => {
    questions.value.push({
        id: generateQuestionId(),
        text: '',
        type: 'short-answer', // Tipo por defecto
        required: false,
         // Otros campos opcionales inicializados a undefined o valor por defecto
         options: undefined,
         placeholder: undefined,
    });
    clearGeneralError(); // Limpia error general al añadir pregunta
};

const removeQuestion = (index: number) => {
    questions.value.splice(index, 1);
    clearGeneralError();
};

// Actualiza una pregunta específica en el array
const updateQuestion = (index: number, updatedQuestion: FormQuestion) => {
    if (index >= 0 && index < questions.value.length) {
        questions.value[index] = updatedQuestion;
         // Forzar re-evaluación de `isFormValid` si es necesario
         // (Vue 3 debería hacerlo automáticamente con `ref`)
    }
    clearGeneralError();
};

const handleFormSubmit = () => {
    clearGeneralError();
    validateTitle();
    // Aquí podríamos añadir una validación más profunda de cada QuestionBuilder si fuera necesario
    // pero la computada `isFormValid` ya hace una verificación básica.

    if (!isFormValid.value) {
        errors.general = "Please ensure the form has a title and all questions are complete.";
        // Scroll to the first error? (Advanced UX)
        console.warn("Form submission failed validation.", errors, questions.value);
        return;
    }

    loading.value = true;
    errors.general = null;

    // Simula envío
    setTimeout(() => {
        console.log("Emitting formCreated with:", { title: formTitle.value.trim(), questions: questions.value });
        emit('formCreated', {
            title: formTitle.value.trim(),
            // Podríamos clonar `questions.value` para evitar mutaciones inesperadas si fuera necesario
             // questions: JSON.parse(JSON.stringify(questions.value))
             questions: questions.value
        });
        loading.value = false;
         // Opcional: resetear aquí si la vista padre no redirige
         // formTitle.value = '';
         // questions.value = [];
         // errors.title = null;
    }, 500); // Simula delay
};

// Observar título para validación en tiempo real
watch(formTitle, validateTitle);

// Añadir una pregunta inicial si el formulario está vacío al montar (opcional)
import { onMounted } from 'vue';
onMounted(() => {
    if (questions.value.length === 0) {
        addQuestion();
    }
});

</script>