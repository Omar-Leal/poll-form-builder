// src/store/formStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Form, FormQuestion, FormResponse, FormAnswers } from '@/types';

// Helper for simple ID generation (replace with UUID in real app)
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export const useFormStore = defineStore('form', () => {
    const forms = ref<Form[]>([]);
    const formResponses = ref<FormResponse[]>([]);

    const getFormById = computed(() => {
        return (formId: string) => forms.value.find(f => f.id === formId);
    });

    const getResponsesForForm = computed(() => {
        return (formId: string) => formResponses.value.filter(r => r.formId === formId);
    });

    function addForm(title: string, questions: FormQuestion[]) {
         if (!title || questions.length === 0) {
            console.error("Form needs a title and at least one question.");
            return null;
        }
        const newForm: Form = {
            id: generateId(),
            title: title.trim(),
            // Ensure questions have IDs if they don't already
            questions: questions.map(q => ({ ...q, id: q.id || generateId() })),
        };
        forms.value.push(newForm);
        console.log("Form added:", newForm);
        return newForm.id; // Return the new form's ID
    }

    function addFormResponse(formId: string, answers: FormAnswers) {
         const form = forms.value.find(f => f.id === formId);
         if (!form) {
             console.error("Form not found for response:", formId);
             return;
         }
         // Basic validation (can be expanded)
         if (Object.keys(answers).length !== form.questions.length) {
             // This is a simple check, more robust validation needed for required fields etc.
             console.warn("Number of answers doesn't match number of questions.");
         }

        const newResponse: FormResponse = {
            id: generateId(),
            formId: formId,
            submittedAt: new Date(),
            answers: answers,
        };
        formResponses.value.push(newResponse);
        console.log("Form response added:", newResponse);
    }

     // Example Form for Testing
    addForm("User Feedback Survey", [
        { id: generateId(), type: 'short-answer', text: 'What is your name?', required: true, placeholder: 'John Doe' },
        { id: generateId(), type: 'long-answer', text: 'Share your feedback about our service:', required: true },
        { id: generateId(), type: 'number', text: 'Rate our service (1-5)', required: false, placeholder: '3' },
        { id: generateId(), type: 'radio', text: 'Would you recommend us?', options: ['Yes', 'No', 'Maybe'], required: true },
    ]);


    return {
        forms,
        formResponses,
        getFormById,
        getResponsesForForm,
        addForm,
        addFormResponse,
    };
});