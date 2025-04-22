// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Home' }
    },
    // --- Poll Routes ---
    {
      path: '/polls/create',
      name: 'poll-create',
      component: () => import('@/views/PollCreateView.vue'),
      meta: { title: 'Create Poll' }
    },
    {
      // Ruta combinada para ver/responder. La vista decidirá qué mostrar.
      path: '/polls/:id',
      name: 'poll-respond',
      component: () => import('@/views/PollRespondView.vue'),
      props: true, // Pasa params de ruta como props
      meta: { title: 'Respond to Poll' }
    },
    {
      path: '/polls/:id/results',
      name: 'poll-results',
      component: () => import('@/views/PollResultsView.vue'),
      props: true,
      meta: { title: 'Poll Results' }
    },
    // --- Form Routes ---
     {
      path: '/forms/create',
      name: 'form-create',
      component: () => import('@/views/FormCreateView.vue'),
      meta: { title: 'Create Form' }
    },
     {
      path: '/forms/:id',
      name: 'form-respond',
      component: () => import('@/views/FormRespondView.vue'),
      props: true,
      meta: { title: 'Respond to Form' }
    },
    {
      path: '/forms/:id/responses',
      name: 'form-responses',
      component: () => import('@/views/FormResponsesView.vue'),
      props: true,
      meta: { title: 'Form Responses' }
    },
     // Ruta Catch-all / Not Found (Opcional pero recomendado)
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'), // Crea este componente simple
      meta: { title: 'Not Found' }
    }
  ],
  // Scroll behavior para volver arriba al navegar
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Actualizar título de la página (Opcional)
router.beforeEach((to, from, next) => {
  const baseTitle = 'Polls & Forms';
  document.title = to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle;
  next();
});


export default router;