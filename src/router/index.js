// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home/Home.vue'
import Login from '@/views/login/Login.vue'
import Roles from '@/views/roles/Roles.vue'
import Workers from '@/views/workers/Workers.vue'
import Students from '@/views/students/Students.vue'
import Users from '@/views/users/Users.vue'
import PlanificationCards from '@/views/planif/PlanificationCards.vue'
import PlanificationList from '@/views/planif/PlanificationList.vue'
import Configuration from '@/views/configuration/Configuration.vue'
import AssistanceCards from '@/views/assistance/AssistanceCards.vue'
import AssistanceList from '@/views/assistance/AssistanceList.vue'
import Plantilla from '@/views/plantilla/Plantilla.vue'
import { isAuthenticated } from '@/services/authenticationService'
import { puedeVer } from '@/auth/permissions'

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: 'roles',
        component: Roles,
        meta: { permiso: 'roles' }
      },
      {
        path: 'workers', 
        component: Workers, 
        meta: { permiso: 'workers' }
      },
      { 
        path: 'students', 
        component: Students, 
        meta: { permiso: 'students' } 
      },
      { 
        path: 'users', 
        component: Users,
        meta: { permiso: 'users' } 
      },
      { 
        path: 'configuration', 
        component: Configuration, 
        meta: { permiso: 'configuration' } 
      },
      {
        path: 'planif', 
        component: PlanificationCards, 
        meta: { permiso: 'planif' } 
      },
      { 
        path: 'planif/:id', 
        component: PlanificationList, 
        meta: { permiso: 'planif' } 
      },
      { 
        path: 'assistance', 
        component: AssistanceCards, 
        meta: { permiso: 'assistance' } 
      },
      { 
        path: 'assistance/list/:fecha', 
        name: 'AssistanceList', 
        component: AssistanceList, 
        meta: { permiso: 'assistance' } 
      },
      { 
        path: 'plantilla', 
        name: 'Plantilla', 
        component: Plantilla, 
        meta: { permiso: 'planif' } 
      }
    ],
    beforeEnter: async (to, from, next) => {
      const valid = await isAuthenticated()
      if (!valid) return next('/login')

      const rol = localStorage.getItem('rol')?.toLowerCase()
      const permiso = to.meta?.permiso
      if (!permiso || puedeVer(rol, permiso)) {
        console.log("unauthorized")
        next()
      } else {
        next('/login') // o redirige a /forbidden
      }
    }
  },
  { path: '/login', component: Login }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router