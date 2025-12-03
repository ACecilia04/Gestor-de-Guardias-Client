import axios from 'axios'

const configuracionApi = axios.create({
  baseURL: 'http://localhost:9091/guardia-api/configuracion',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

export const getAllConfiguraciones = () => {
  return configuracionApi.get('/getAll')
}

export const saveConfiguracion = (payload) => {
  return configuracionApi.post('/insert', payload)
}

export const deleteConfiguracion = (id) => {
  return configuracionApi.delete(`/delete/${id}`)
}
