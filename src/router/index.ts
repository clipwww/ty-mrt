import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'query',
      component: () => import('@/pages/QueryPage.vue'),
    },
    {
      path: '/timetable',
      name: 'timetable',
      component: () => import('@/pages/TimetablePage.vue'),
    },
    {
      path: '/route',
      name: 'route',
      component: () => import('@/pages/RoutePage.vue'),
    },
  ],
})

export default router
