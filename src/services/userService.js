import axios from 'axios'

const baseUrl = '/usuario'

export async function getAllUsuarios() {
  return axios.get(`${baseUrl}/getAll`)
}

export async function getUsuarioById(id) {
  return axios.get(`${baseUrl}/get`, {
    params: { id }
  })
}

export async function getUsuarioByNombre(nombre) {
  return axios.get(`${baseUrl}/getByNombre`, {
    params: { nombre }
  })
}

export async function insertUsuario(usuario) {
  return axios.post(`${baseUrl}/insert`, usuario)
}

export async function updateUsuario(usuario) {
  return axios.post(`${baseUrl}/update`, usuario)
}

export async function deleteUsuario(id) {
  return axios.delete(`${baseUrl}/delete`, {
    data: ida
  })
}