<template>
  <nav>
    <router-link to="/">Inicio</router-link> |
    <router-link to="/roles">Roles</router-link> |
    <router-link to="/workers">Trabajadores</router-link> |
    <router-link to="/" @click.prevent="handleLogout">Cerrar sesión</router-link>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { logout } from '../../services/authenticationService'

const router = useRouter()

const handleLogout = async () => {
  try {
    await logout()
  } catch (err) {
    console.error('Error al cerrar sesión:', err)
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
  }
}
</script>

