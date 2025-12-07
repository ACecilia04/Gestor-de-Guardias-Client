import { ref, computed } from 'vue'

const username = ref(localStorage.getItem('username') || '')
const rol = ref(localStorage.getItem('rol') || '')

export const useAuth = () => {
  const isAuthenticated = computed(() => !!username.value)

  const login = (user, role) => {
    username.value = user
    rol.value = role
    localStorage.setItem('username', user)
    localStorage.setItem('rol', role)
  }

  const logout = () => {
    username.value = ''
    rol.value = ''
    localStorage.removeItem('username')
    localStorage.removeItem('rol')
  }

  return {
    username,
    rol,
    isAuthenticated,
    login,
    logout
  }
}
