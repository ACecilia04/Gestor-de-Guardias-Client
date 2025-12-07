import axios from 'axios'

const authApi = axios.create({
  baseURL: 'http://localhost:9091/guardia-api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

// LOGIN: sends Basic Auth header, stores username if successful
export const login = async (username, password) => {
  const basicAuth = 'Basic ' + btoa(`${username}:${password}`)

  try {
    const response = await authApi.post('/authentication/signin', null, {
      headers: { Authorization: basicAuth }
    })

    // Store session info
    localStorage.setItem('username', response.data.username)
    localStorage.setItem('rol', response.data.rol.nombre)

    return response.data
  } catch (err) {
    console.error('Error during login:', err)
    throw err
  }
}

// LOGOUT: clears session and localStorage
export const logout = async () => {
  try {
    await authApi.post('/authentication/logout', null)
    localStorage.clear()
  } catch (err) {
    console.error('Error during logout:', err)
  } finally {
    localStorage.removeItem('username')
    localStorage.removeItem('rol')
    // localStorage.removeItem('token') // optional
  }
}

// SESSION VALIDATION: checks if session is still valid
export const isAuthenticated = async () => {
  const username = localStorage.getItem('username')
  if (!username) return false

  try {
    const response = await authApi.post('/authentication/isSessionValid', { username })
    return response.data === true
  } catch (err) {
    console.error('Error validating session:', err)
    return false
  }
}