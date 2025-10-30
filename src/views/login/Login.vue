<template>
  <div class="login-page login-light">
    <div class="login-container">
      <!-- Add class "fade-in-effect" for login form effect -->
      <form method="post" role="form" id="login" class="login-form fade-in-effect" 
        :class="{ in: faded }" @submit.prevent="handleLogin" ref="loginForm">
        
        <div class="login-header">
          <span>Gestor de guardias</span>
          <p>Iniciar sesión</p>
        </div>

        <div class="form-group" :class="{ 'is-focused': isFocused.username || (typeof form.username === 'string' && form.username.trim().length > 0) }">
          <label class="control-label" for="username" @click="focusField('username')">Usuario</label>
          <input type="text" id="username" class="form-control" v-model="form.username" autocomplete="off"
            :class="{ error: v$.username.$error }" @focus="setFocus('username', true)" @keydown="setFocus('username', true)" @blur="onBlur('username')"/>
          <validation-message for="username" message="Introduzca nombre de usuario" :visible="v$.username.$error"></validation-message>
        </div>

        <div class="form-group" :class="{ 'is-focused': isFocused.password || (typeof form.password === 'string' && form.password.trim().length > 0) }">
          <label class="control-label" for="password" @click="focusField('password')">Contrasena</label>
          <input type="password" id="password" class="form-control" v-model="form.password" autocomplete="off"
            :class="{ error: v$.password.$error }" @focus="setFocus('password', true)" @keydown="setFocus('password', true)" @blur="onBlur('password')" />
          <validation-message for="username" message="Introduzca contrasena" :visible="v$.password.$error"></validation-message>
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
  import ValidationMessage from '@/components/ValidationMessage.vue'

  const router = useRouter()

  // Crear las propiedades del formulario, o sea los inputs, ej. <input type="text" v-model="form.username"
  const form = reactive({
    username: '',
    password: ''
  })

  // Reglas de validación de las propiedades
  const rules = {
    username: { required },
    password: { required }
  }

  // Inicializar Vuelidate, para validar que las reglas de validacion se cumplan en el form
  const v$ = useVuelidate(rules, form)

  const error = ref('') // Mensaje de error general
  const loginForm = ref(null) // referencia al form para poderlo manejar en el js, por ej en: const input = loginForm.value?.querySelector(selector). Hay que ponerle la referencia (ref) al form en el html: <form method="post" [...] ref="loginForm">
  const faded = ref(false) // bandera boolean para controlar el fade-in del form. Ver: <form method="post" [...] :class="{ in: faded }"...

  // Crea un objeto reactivo isFocused, que Vue rastrea automáticamente. Si cambian sus propiedades, el DOM se actualiza
  // La idea es q cuando un control gane o pierda el foco se actualice esta propiedad y esto ponga/quite la clase 'is-focused' en el div.form-group correspondiente: <div class="form-group" :class="{ 'is-focused': isFocused.password ||...
  const isFocused = reactive({
    username: false,
    password: false
  })

  // funcion que se llama desde los inputs cuando ganan el foco. 
  const setFocus = (field, value) => {
    isFocused[field] = value
  }

  // funcion que se llama desde los inputs cuando pierden el foco
  const onBlur = (field) => {
    isFocused[field] = false
  }

  // funcion que se llama desde el click de los labels para que el label se oculte y el input enlazado a el gane el foco
  const focusField = (field) => {
    // sin refs en inputs: localizamos el input por id dentro del form
    const selector = field === 'username' ? 'input[id="username"]' : 'input[id="password"]'
    const input = loginForm.value?.querySelector(selector)
    if (input) input.focus()
  }

  // funcion que se llama desde el submit del form, <form method="post" [...] @submit.prevent="handleLogin"
  const handleLogin = async () => {
    await v$.value.$validate()

    if (v$.value.$invalid) {
      error.value = 'Por favor completa todos los campos obligatorios'
      return
    }

    try {
      const response = await login(form.username, form.password)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('username', form.username)
      router.push('/')
    } catch (err) {
      error.value = 'Credenciales inválidas'
    }
  }

  // funcion Vue que se llama autiomaticamente cuando se completa la carga del componente
  onMounted(async () => {
    // efecto de aparición
    await nextTick() // espera a que se actualice el DOM
    setTimeout(() => { //activa el valor faded.value para disparar la animacion fade-in
      faded.value = true
    }, 1)

    // foco en el primer control del form
    await nextTick() // Espera a que el DOM este listo
    const firstInput = loginForm.value?.querySelector('.form-group .form-control') // busca el primer input del form usando querySelector
    //if (firstInput) firstInput.focus() // le da el foco al primer input, lo voy a comentar por el momento

    // inicializar estados isFocused según valores existentes
    if (typeof form.username === 'string' && form.username.trim().length > 0) {
      isFocused.username = true
    }
    if (typeof form.password === 'string' && form.password.trim().length > 0) {
      isFocused.password = true
    }
  })
</script>

<style scoped>
  .login-page .login-form .login-header span{
    font-size: 20px;
  }
  .login-page .login-form .login-header p{
    font-size: 16px;
  }
  .errors-container p {
    color: rgba(204, 63, 68, .5);
  }
</style>
