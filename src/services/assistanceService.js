import axios from 'axios'

const asistenciaApi = axios.create({
  baseURL: 'http://localhost:9091/guardia-api/turnoDeGuardia',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

export const getPrimerasFechasPorActualizarAsistencia = () =>
  asistenciaApi.get('/getPrimerasFechasPorActualizarAsistencia')