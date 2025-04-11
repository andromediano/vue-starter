import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import HomeView from '../views/HomeView.vue'
import CharacterView from '../views/CharacterView.vue'
import UserView from '../views/UserView.vue'

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
      component: AboutView,
      props: (route) => ({
        page: parseInt(route.query.page as string) || 1,
        query: (route.query.q as string) || '',
      }),
    },
    {
      path: '/users',
      name: 'users',
      component: UserView,
      props: (route) => ({
        page: parseInt(route.query.page as string) || 1,
      }),
    },
    {
      path: '/characters',
      name: 'characters',
      component: CharacterView,
      props: (route) => ({
        page: parseInt(route.query.page as string) || 1,
      }),
    },
  ],
})

export default router
