import axios from 'axios'

const reporteApi = axios.create({
  baseURL: 'http://localhost:9091/guardia-api/reporte',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

/**
 * Genera un reporte de personas.
 * @param {Array} personas - Lista de objetos Persona.
 * @param {string} rutaArchivo - Ruta absoluta donde guardar el archivo.
 * @param {string} titulo - Título del reporte.
 */
export const generarReportePersonas = (personas, rutaArchivo, titulo) => {
  return reporteApi.post('/personas', personas, {
    params: {
      rutaArchivo,
      titulo
    }
  })
}

/**
 * Genera un reporte de plantilla de guardia.
 * @param {Array} plantilla - Lista de objetos DiaGuardia.
 * @param {string} rutaArchivo - Ruta absoluta donde guardar el archivo.
 */
export const generarReportePlantilla = (plantilla, rutaArchivo) => {
  return reporteApi.post('/plantilla', plantilla, {
    params: {
      rutaArchivo
    }
  })
}