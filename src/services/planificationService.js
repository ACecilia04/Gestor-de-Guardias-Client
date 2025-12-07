<<<<<<< HEAD
// src/services/turnoDeGuardiaService.js
=======
// src/services/planificationService.js
>>>>>>> f52e494 (fix: update crearPlantilla API call for improved functionality)
import axios from 'axios'

const turnoApi = axios.create({
  baseURL: 'http://localhost:9091/guardia-api/turnoDeGuardia',
  withCredentials: true
})

// GET /getAll
export const getAllTurnos = () => {
  return turnoApi.get('/getAll')
}

// GET /getById?id=...
export const getTurnoById = (id) => {
  return turnoApi.get('/getById', { params: { id } })
}

// GET /getByPk?horarioId=...&fecha=...&personaId=...
export const getTurnoByPk = (horarioId, fecha, personaId) => {
  return turnoApi.get('/getByPk', {
    params: { horarioId, fecha, personaId }
  })
}

// GET /getUltimo
export const getUltimoTurno = () => {
  return turnoApi.get('/getUltimo')
}

// GET /getAPartirDe?fecha=...
export const getTurnosAPartirDe = (fecha) => {
  return turnoApi.get('/getAPartirDe', { params: { fecha } })
}

// GET /getPrimerasFechasPorMes
export const getPrimerasFechasPorMes = () => {
  return turnoApi.get('/getPrimerasFechasPorMes')
}

// GET /getPrimerasFechasPorActualizarAsistencia
export const getFechasParaActualizarAsistencia = () => {
  return turnoApi.get('/getPrimerasFechasPorActualizarAsistencia')
}

// POST /insert
export const insertTurno = (turno) => {
  return turnoApi.post('/insert', turno)
}

// PUT /update
export const updateTurno = (turno) => {
  return turnoApi.put('/update', turno)
}

// DELETE /delete?id=...
export const deleteTurno = (id) => {
  return turnoApi.delete('/delete', { params: { id } })
}

// DELETE /deleteAPartirDe?fecha=...
export const deleteTurnosAPartirDe = (fecha) => {
  return turnoApi.delete('/deleteAPartirDe', { params: { fecha } })
}

// POST /guardarTurnos
export const guardarTurnos = (dias) => {
  return turnoApi.post('/guardarTurnos', dias)
}

// PUT /guardarCumplimiento
export const guardarCumplimiento = (dias) => {
  return turnoApi.put('/guardarCumplimiento', dias)
}