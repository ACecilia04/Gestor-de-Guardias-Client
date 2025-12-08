import axios from 'axios'

const exportApi = axios.create({
  baseURL: 'http://localhost:9091/guardia-api/reporte',
  responseType: 'blob',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

// Para personas
export const exportPersonasToPdf = (personas, titulo) => {
  return exportApi.post('/personas', personas, {
    params: { titulo }
  }). catch(error => {
    console.error('Error en exportPersonasToPdf:', error.response?. data || error.message)
    throw error
  })
}

export const exportAsistenciasToPdf = (plantilla) => {
  return exportApi.post('/plantilla', plantilla) 
}

// Para planificación (sin cumplimiento)
export const exportPlanificacionToPdf = (plantilla) => {
  return exportApi.post('/plantilla', plantilla)
    .catch(error => {
      console. error('Error en exportPlanificacionToPdf:', error.response?.data || error.message)
      throw error
    })
}