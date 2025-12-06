import axios from 'axios'

const plantillApi = axios.create({
  baseURL: 'http://localhost:9091/guardia-api/plantilla',
  withCredentials: true
})

export const crearPlantilla = (empezarHoy = false) => {
  return plantillApi.get('/crearPlantilla', {
    params: { empezarHoy }
  })
}