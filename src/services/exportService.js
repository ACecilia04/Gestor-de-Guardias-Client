import axios from 'axios'

const exportApi = axios.create({
  baseURL: 'http://localhost:9091/guardia-api/reporte',
  responseType: 'blob',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

export const exportAsistenciasToPdf = (plantilla, rutaArchivo) => {
  return exportApi.post('/plantilla', plantilla, {
    params: { rutaArchivo }
  })
}

