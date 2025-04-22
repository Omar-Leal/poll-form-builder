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
    },
    // --- Poll Routes ---
    {
      path: '/polls/create',
      name: 'poll-create',
      component: () => import('@/views/PollCreateView.vue'), // Lazy load
    },
    {
      path: '/polls/:id', // Combined view/respond route
      name: 'poll-respond',
      component: () => import('@/views/PollRespondView.vue'),
      props: true, // Pass route params as props
    },
    {
      path: '/polls/:id/results',
      name: 'poll-results',
      component: () => import('@/views/PollResultsView.vue'),
      props: true,
    },
    // --- Form Routes ---
     {
      path: '/forms/create',
      name: 'form-create',
      component: () => import('@/views/FormCreateView.vue'),
    },
     {
      path: '/forms/:id',
      name: 'form-respond',
      component: () => import('@/views/FormRespondView.vue'),
      props: true,
    },
    {
      path: '/forms/:id/responses',
      name: 'form-responses',
      component: () => import('@/views/FormResponsesView.vue'),
      props: true,
    },
     // Catch-all or Not Found route (optional)
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'NotFound',
    //   component: () => import('@/views/NotFoundView.vue')
    // }
  ],
});

export default router;