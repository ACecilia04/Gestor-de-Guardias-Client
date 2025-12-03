import axios from 'axios'

const horarioApi = axios.create({
  baseURL: 'http://localhost:9091/guardia-api/horario',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

export const getAllHorarios = () => {
  return horarioApi.get('/getAll')
}

export const getHorarioById = (id) => {
  return horarioApi.get('/get', {
    params: { id }
  })
}

export const getHorarioByPk = (inicio, fin) => {
  return horarioApi.get('/getByPk', {
    params: { inicio, fin }
  })
}

export const insertHorario = (horario) => {
  return horarioApi.post('/insert', horario)
}

export const updateHorario = (horario) => {
  return horarioApi.post('/update', horario)
}

export const deleteHorario = (id) => {
  return horarioApi.delete('/delete', {
    data: id
  })
}