// src/services/plantillaService.js
import axios from 'axios'

const plantillaApi = axios.create({
  baseURL: 'http://localhost:9091/guardia-api/plantilla',
  withCredentials: true
})

// GET /crearPlantilla?empezarHoy=true|false
export const crearPlantilla = (empezarHoy = false) => {
  return plantillaApi.get('/crearPlantilla', {
    params: { empezarHoy }
  })
}

// GET /getPersonasDisponibles?fecha=...&horario=...&diasEnPantalla=...
export const getPersonasDisponibles = (fecha, horario, diasEnPantalla) => {
  return plantillaApi.get('/getPersonasDisponibles', {
    params: {
      fecha,
      horario,
      diasEnPantalla
    }
  })
}

// GET /getPlanificacionesAPartirDe?fecha=...
export const getPlanificacionesAPartirDe = (fecha) => {
  return plantillaApi.get('/getPlanificacionesAPartirDe', {
    params: { fecha }
  })
}

// GET /getDiasPorActualizarCumplimiento
export const getDiasPorActualizarCumplimiento = () => {
  return plantillaApi.get('/getDiasPorActualizarCumplimiento')
}

// POST /crearPlanificacionAutomaticamente
export const crearPlanificacionAutomaticamente = (dias) => {
  return plantillaApi.post('/crearPlanificacionAutomaticamente', dias)
}

// POST /asignarPersona
export const asignarPersona = (personaAsignada) => {
  return plantillaApi.post('/asignarPersona', personaAsignada)
}