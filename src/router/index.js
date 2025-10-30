import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home/Home.vue'
import Login from '@/views/login/Login.vue'
import Roles from '@/views/roles/Roles.vue'
import Workers from '@/views/workers/Workers.vue'
import { isAuthenticated } from '@/services/authenticationService'

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: 'roles', // esto crea /roles dentro de Home
        component: Roles
      },
      {
        path: 'workers', // esto crea /roles dentro de Home
        component: Workers
      }

    ],
    beforeEnter: async (to, from, next) => {
      const valid = await isAuthenticated()
      if (valid) {
        next()
      } else {
        next('/login')
      }
    }
  },

  {
    path: '/login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
