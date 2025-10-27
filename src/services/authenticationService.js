import axios from 'axios'

const authApi = axios.create({
  baseURL: 'http://localhost:9091/guardia-api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

export const login = (username, password) => {
  const basicAuth = 'Basic ' + btoa(`${username}:${password}`)
  return authApi.post('/authentication/signin', null, {
    headers: { Authorization: basicAuth }
  })
}

export const logout = () => {
  try {
    authApi.post('/authentication/logout', null)
    localStorage.setItem('token', '') // si el backend devuelve token
    localStorage.setItem('username', '')
  } catch (err) {
    console.error('Error cerrando sesión:', err)
  }
}

export const isAuthenticated = async () => {
  const username = localStorage.getItem('username')
  if (!username) return false

  try {
    const response = await authApi.post('/authentication/isSessionValid', {username})
    return response.data;
  } catch (err) {
    console.error('Error validando sesión:', err)
    return false
  }
}