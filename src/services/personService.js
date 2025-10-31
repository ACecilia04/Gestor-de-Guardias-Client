import axios from 'axios'

const personaApi = axios.create({
  baseURL: 'http://localhost:9091/guardia-api/persona',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

// GET endpoints
export const getAllPersonas = () => personaApi.get('/getAll')

export const getPersonaByCi = (ci) =>
  personaApi.get('/getByCi', { params: { ci } })

export const getPersonaById = (id) =>
  personaApi.get('/getById', { params: { id } })

export const getPersonasByTipo = (tipo) =>
  personaApi.get('/getByTipo', { params: { tipo } })

export const getPersonasDisponibles = (fecha, tipo, sexo = null) =>
  personaApi.get('/getDisponibles', {
    params: { fecha, tipo, sexo }
  })

export const getPersonasDeBaja = (fecha) =>
  personaApi.get('/getDeBaja', { params: { fecha } })

// POST endpoint
export const insertPersona = (persona) =>
  personaApi.post('/insert', persona)

// PUT endpoints
export const updatePersona = (persona) =>
  personaApi.put('/update', persona)

export const darBaja = (ci, fecha) =>
  personaApi.put('/darBaja', null, {
    params: { ci, fecha }
  })

export const darBajaConReincorporacion = (ci, fechaBaja, fechaReincorporacion) =>
  personaApi.put('/darBajaConReincorporacion', null, {
    params: { ci, fechaBaja, fechaReincorporacion }
  })

// DELETE endpoints
export const deletePersonaByCi = (ci) =>
  personaApi.delete('/deleteByCi', { params: { ci } })

export const deletePersonaById = (id) =>
  personaApi.delete('/deleteById', { params: { id } })

export const getTablaByTipo = (tipo) =>
  personaApi.get('/getTablaByTipo', { params: { tipo } })
