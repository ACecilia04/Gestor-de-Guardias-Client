import axios from 'axios'

const usuarioApi = axios.create({
  baseURL: 'http://localhost:9091/guardia-api/usuario',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

export const getAllUsuarios = () => usuarioApi.get('/getAll')

export const getUsuarioById = (id) =>
  usuarioApi.get('/get', { params: { id } })

export const getUsuarioByNombre = (nombre) =>
  usuarioApi.get('/getByNombre', { params: { nombre } })

export const insertUsuario = (usuario) =>
  usuarioApi.post('/insert', usuario)

export const updateUsuario = (usuario) =>
  usuarioApi.post('/update', usuario)

export const deleteUsuario = (id) =>
  usuarioApi.delete('/delete', {
    data: id,
    headers: { 'Content-Type': 'text/plain' }
  })