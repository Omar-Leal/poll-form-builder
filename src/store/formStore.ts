// src/store/formStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Form, FormQuestion, FormResponse, FormAnswers } from '@/types';

// Helpers ID (NO USAR EN PRODUCCIÓN)
const generateFormId = () => `form-${Date.now().toString(36)}${Math.random().toString(36).substring(2, 5)}`;
const generateQuestionId = () => `q-${Date.now().toString(36)}${Math.random().toString(36).substring(2, 5)}`;
const generateResponseId = () => `resp-${Date.now().toString(36)}${Math.random().toString(36).substring(2, 5)}`;

export const useFormStore = defineStore('form', () => {
    // Estado
    const forms = ref<Form[]>([]);
    const formResponses = ref<FormResponse[]>([]); // Almacena todas las respuestas de todos los forms

    // Getters
    const getFormById = computed(() => {
        return (formId: string): Form | undefined => forms.value.find(f => f.id === formId);
    });

    const getResponsesForForm = computed(() => {
        // Devuelve las respuestas para un ID de form específico, ordenadas por fecha descendente
        return (formId: string): FormResponse[] => {
            return formResponses.value
                .filter(r => r.formId === formId)
                .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()); // Más reciente primero
        }
    });

    // Actions
    function addForm(title: string, questions: FormQuestion[]) {
        if (!title || !title.trim()) {
             console.error("Form title cannot be empty.");
             alert("Form title cannot be empty.");
            return null;
        }
         if (!questions || questions.length === 0) {
            console.error("Form must have at least one question.");
            alert("Form must have at least one question.");
            return null;
        }
         // Validar preguntas individuales (básico)
         if (questions.some(q => !q.text || !q.text.trim())) {
             console.error("All form questions must have text.");
             alert("All form questions must have text.");
             return null;
         }
         if (questions.some(q => q.type === 'radio' && (!q.options || q.options.length < 1 || q.options.some(opt => !opt || !opt.trim())))) {
             console.error("Radio questions must have at least one non-empty option.");
              alert("Radio questions must have at least one non-empty option.");
             return null;
         }


        const newForm: Form = {
            id: generateFormId(),
            title: title.trim(),
            // Asegura que cada pregunta tenga un ID único si no lo tiene
            questions: questions.map(q => ({
                ...q,
                id: q.id || generateQuestionId(), // Genera ID si falta
                // Limpia opciones de radio si no es tipo radio
                options: q.type === 'radio' ? (q.options || []).map(opt => opt.trim()).filter(opt => opt) : undefined,
                // Asegura que los campos opcionales existan como undefined si no están
                required: q.required ?? false,
                placeholder: q.placeholder ?? undefined
            })),
        };
        forms.value.push(newForm);
        console.log("Form added:", newForm);
        return newForm.id;
    }

    function addFormResponse(formId: string, answers: FormAnswers) {
        const form = forms.value.find(f => f.id === formId);
        if (!form) {
            console.error("Form not found when adding response:", formId);
            alert("Error: Could not submit response. Form not found.");
            return;
        }

        // Validación básica de respuesta (ej: campos requeridos)
        for (const question of form.questions) {
            if (question.required) {
                 const answer = answers[question.id];
                 // Verifica si es nulo, indefinido o una cadena vacía (después de quitar espacios)
                 const isEmpty = answer === null || answer === undefined || (typeof answer === 'string' && answer.trim() === '');
                if (isEmpty) {
                    console.error(`Required question "${question.text}" was not answered.`);
                    alert(`Required question "${question.text}" must be answered.`);
                    return; // Detiene el envío
                }
            }
        }

        const newResponse: FormResponse = {
            id: generateResponseId(),
            formId: formId,
            submittedAt: new Date(), // Hora actual del envío
            answers: answers, // Guarda las respuestas recibidas
        };
        formResponses.value.push(newResponse);
        console.log("Form response added:", newResponse);
    }

    // --- Datos de Ejemplo Iniciales (Opcional) ---
    const initializeExampleForms = () => {
        if (forms.value.length === 0) {
            console.log("Initializing example forms...");
            addForm("Website Feedback", [
                { id: generateQuestionId(), type: 'short-answer', text: 'Your Name (Optional)', required: false, placeholder: 'John Doe' },
                { id: generateQuestionId(), type: 'number', text: 'Rate usability (1-5)', required: true, placeholder: '5' },
                { id: generateQuestionId(), type: 'radio', text: 'Did you find what you needed?', options: ['Yes, easily', 'Yes, after searching', 'No'], required: true },
                { id: generateQuestionId(), type: 'long-answer', text: 'Any suggestions for improvement?', required: false, placeholder: 'More examples, clearer navigation...' },
            ]);
            addForm("Event Registration", [
                 { id: generateQuestionId(), type: 'short-answer', text: 'Full Name', required: true, placeholder: 'Jane Smith'},
                 { id: generateQuestionId(), type: 'short-answer', text: 'Email Address', required: true, placeholder: 'jane.smith@example.com'}, // Podría ser 'email' type en BaseInput
                 { id: generateQuestionId(), type: 'radio', text: 'Dietary Restrictions?', options: ['None', 'Vegetarian', 'Gluten-Free', 'Other'], required: false }
            ]);
        }
    };
    initializeExampleForms();


    return {
        forms,
        formResponses,
        getFormById,
        getResponsesForForm,
        addForm,
        addFormResponse,
    };
},
// { persist: true } // Descomenta si usas persistencia
);