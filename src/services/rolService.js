import axios from 'axios'

const rolApi = axios.create({
  baseURL: 'http://localhost:9091/guardia-api/rol',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

export const getAllRoles = () => rolApi.get('/getAll')

export const getRol = (nombre) => rolApi.get('/get', { params: { nombre } })

export const insertRol = (nombre) => rolApi.post('/insert', nombre, {
  headers: { 'Content-Type': 'text/plain' }
})

export const updateRol = (nombre, nuevoNombre) =>
  rolApi.get('/update', { params: { nombre, nuevoNombre } 
})

export const deleteRol = (nombre) =>
  rolApi.delete('/delete', { data: nombre, headers: { 'Content-Type': 'text/plain' } 
})
