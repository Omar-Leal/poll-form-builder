<template>
    <div>
       <nav aria-label="Breadcrumb" class="mb-6">
        <ol role="list" class="flex items-center space-x-2 text-sm text-gray-500">
          <li><RouterLink :to="{ name: 'home' }" class="hover:text-gray-700">Home</RouterLink></li>
          <li><svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" /></svg></li>
          <li><span class="font-medium text-gray-700">Create Form</span></li>
        </ol>
      </nav>
  
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Build a New Form</h1>
  
      <FormBuilder @form-created="handleCreateForm" />
  
       <div v-if="creationStatus.message" :class="['mt-4 p-3 rounded text-center', creationStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
           {{ creationStatus.message }}
       </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { reactive } from 'vue';
  import FormBuilder from '@/components/forms/FormBuilder.vue';
  import { useFormStore } from '@/store/formStore';
  import { useRouter, RouterLink } from 'vue-router';
  import type { FormQuestion } from '@/types';
  
  const formStore = useFormStore();
  const router = useRouter();
  
  // Estado para feedback
  const creationStatus = reactive({
      success: false,
      message: ''
  });
  
  // Define la estructura esperada del evento
  interface FormData {
      title: string;
      questions: FormQuestion[];
  }
  
  const handleCreateForm = (formData: FormData) => {
      console.log("Received formCreated event in view with data:", formData);
      creationStatus.message = ''; // Limpia mensaje
  
      // Llama a la acción del store para añadir el form
      const newFormId = formStore.addForm(formData.title, formData.questions);
  
      if (newFormId) {
          creationStatus.success = true;
          creationStatus.message = 'Form created successfully! Redirecting...';
          console.log(`Form created with ID: ${newFormId}. Redirecting...`);
          // Redirige a la página para responder al nuevo formulario
          setTimeout(() => {
              router.push({ name: 'form-respond', params: { id: newFormId } });
          }, 1000);
      } else {
          creationStatus.success = false;
          creationStatus.message = 'Failed to create form. Please check the form for errors or try again.';
          console.error("Form creation failed in view.");
           // El store o FormBuilder ya deberían haber mostrado errores más específicos
      }
  };
  </script>