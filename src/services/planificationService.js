import axios from 'axios'

const turnoApi = axios.create({
  baseURL: 'http://localhost:9091/guardia-api/turnoDeGuardia',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

export const getPrimerasFechasPorMes = () =>  turnoApi.get('/getPrimerasFechasPorMes')

export const getTurnosAPartirDe = (fecha) =>  turnoApi.get(`/getAPartirDe?fecha=${fecha}`)

