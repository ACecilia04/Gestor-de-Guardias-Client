<template>
  <div class="login-page login-light">
    <div class="login-container">
      <!-- Add class "fade-in-effect" for login form effect -->
      <form method="post" role="form" id="login" class="login-form fade-in-effect" :class="{ in: faded }"
        @submit.prevent="handleLogin" ref="loginForm">

        <div class="login-header">
          <span>Gestor de guardias</span>
          <p>Iniciar sesión</p>
        </div>

        <div class="form-group"
          :class="{ 'is-focused': isFocused.username || (typeof form.username === 'string' && form.username.trim().length > 0) }">
          <label class="control-label" for="username" @click="focusField('username')">Usuario</label>
          <input type="text" id="username" class="form-control" v-model="form.username" autocomplete="off"
            :class="{ error: v$.username.$error }" @focus="setFocus('username', true)"
            @keydown="setFocus('username', true)" @blur="onBlur('username')" />
          <validation-message for="username" message="Introduzca nombre de usuario"
            :visible="v$.username.$error"></validation-message>
        </div>

        <div class="form-group"
          :class="{ 'is-focused': isFocused.password || (typeof form.password === 'string' && form.password.trim().length > 0) }">
          <label class="control-label" for="password" @click="focusField('password')">Contrasena</label>
          <input type="password" id="password" class="form-control" v-model="form.password" autocomplete="off"
            :class="{ error: v$.password.$error }" @focus="setFocus('password', true)"
            @keydown="setFocus('password', true)" @blur="onBlur('password')" />
          <validation-message for="password" message="Introduzca contrasena"
            :visible="v$.password.$error"></validation-message>
        </div>

        <div class="form-group">
          <button type="submit" class="btn btn-primary btn-block text-left">
            <i class="fa-lock"></i>Entrar
          </button>
        </div>
      </form>

      <!-- Error general -->
      <div class="errors-container">
        <p v-if="error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useRouter } from 'vue-router'
import { login } from '@/services/authenticationService'
import { useAuth } from '@/stores/authStore'
import ValidationMessage from '@/components/ValidationMessage.vue'

const router = useRouter()
const { login: setAuth } = useAuth()

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: { required },
  password: { required }
}

const v$ = useVuelidate(rules, form)
const error = ref('')
const loading = ref(false)
const faded = ref(false)
const loginForm = ref(null)

const isFocused = reactive({
  username: false,
  password: false
})

const setFocus = (field, value) => {
  isFocused[field] = value
}

const onBlur = (field) => {
  isFocused[field] = false
}

const focusField = (field) => {
  const selector = field === 'username' ? 'input[id="username"]' : 'input[id="password"]'
  const input = loginForm.value?.querySelector(selector)
  if (input) input.focus()
}

const handleLogin = async () => {
  if (loading.value) return

  await v$.value.$validate()
  if (v$.value.$invalid) {
    error.value = 'Por favor completa todos los campos obligatorios'
    return
  }

  loading.value = true
  try {
    const response = await login(form.username, form.password)
    setAuth(response.username, response.rol.nombre)
    router.push('/')
  } catch (err) {
  if (err.response?.status === 401) {
    error.value = 'Credenciales inválidas'
  } else if (err.response) {
    error.value = `Error ${err.response.status}: ${err.response.statusText}`
  } else {
    error.value = 'No se pudo conectar con el servidor'
  }
  console.error('Login error:', err)
}
 finally {
    loading.value = false
  }
}

onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    faded.value = true
  }, 1)

  await nextTick()
  const firstInput = loginForm.value?.querySelector('.form-group .form-control')
  if (firstInput) firstInput.focus()

  if (typeof form.username === 'string' && form.username.trim().length > 0) {
    isFocused.username = true
  }
  if (typeof form.password === 'string' && form.password.trim().length > 0) {
    isFocused.password = true
  }
})
</script>

<style scoped>
.login-page .login-form .login-header span {
  font-size: 20px;
}

.login-page .login-form .login-header p {
  font-size: 16px;
}

.errors-container p {
  color: rgba(204, 63, 68, .5);
}
</style>
