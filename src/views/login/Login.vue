<template>
  <div>
    <h2>
      Iniciar sesión
    </h2>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="Usuario" />
      <input v-model="password" type="password" placeholder="Contraseña" />
      <button type="submit">Entrar</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../../services/authenticationService'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const response = await login(username.value, password.value)
    localStorage.setItem('token', response.data.token) // si el backend devuelve token
    localStorage.setItem('username', username.value)
    router.push('/')
  } catch (err) {
    error.value = 'Credenciales inválidas'
  }
}
</script>
