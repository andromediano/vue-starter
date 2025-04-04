import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      props: (route) => ({
        page: parseInt(route.query.page as string) || 1,
        query: (route.query.q as string) || '',
      }),
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UserView.vue'),
      props: (route) => ({
        page: parseInt(route.query.page as string) || 1,
      }),
    },
  ],
})

export default router
