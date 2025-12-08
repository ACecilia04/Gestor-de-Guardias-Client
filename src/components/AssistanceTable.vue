<template>
  <div class="panel panel-default shadow-sm rounded">
    <div class="panel-heading bg-primary text-white p-3 rounded-top">
      <h3 class="panel-title mb-0 fw-semibold">Asistencias</h3>
      <div class="panel-options">
        <a href="#" @click.prevent="exportToPdf" title="Exportar PDF" class="text-white">
          <i class="fa fa-file-pdf-o"></i>
        </a>
      </div>
    </div>

    <div class="panel-body p-3 bg-light rounded-bottom">
      <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
        <table class="table table-bordered table-striped">
          <thead>
            <tr class="bg-white text-dark">
              <th>Día</th>
              <th>Horario</th>
              <th>Carnet</th>
              <th>Apellidos</th>
              <th>Nombre</th>
              <th>Asistencia</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="g in guardias" :key="g.id" class="align-middle">
              <td>{{ g.dia }}</td>
              <td>{{ g.horario }}</td>
              <td>{{ g.carnet }}</td>
              <td>{{ g.apellidos }}</td>
              <td>{{ g.nombre }}</td>
              <td>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" :name="'asistencia-' + g.id" value="cumplido"
                    v-model="g.asistencia" />
                  <label class="form-check-label">Cumplido</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" :name="'asistencia-' + g.id" value="incumplido"
                    v-model="g.asistencia" />
                  <label class="form-check-label">Incumplido</label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="loading" class="text-muted mt-3">Cargando asistencias...</div>
      <div v-if="error" class="text-danger mt-2">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { getTurnosAPartirDe } from '@/services/planificationService' // or assistanceService
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { exportAsistenciasToPdf } from '@/services/exportService'

const guardias = ref([])
const loading = ref(true)
const error = ref(null)
const route = useRoute()
const fecha = route.params.fecha
const props = defineProps({ fecha: String })

onMounted(async () => {
  try {
    const response = await getTurnosAPartirDe(fecha)
    const turnos = response.data

    guardias.value = turnos.map((t, index) => {
      // Asegurar formato YYYY-MM-DD para la fecha
      const fechaObj = new Date(t.fecha)
      const fechaISO = fechaObj.toISOString(). split('T')[0]
      
      return {
        id: t.id || index,
        fecha: fechaISO, // formato "2025-12-08"
        dia: fechaObj.toLocaleDateString('es-ES', {
          day: 'numeric',
          weekday: 'long'
        }),
        horario: `${t.horario?. inicio?. slice(0, 5)} - ${t.horario?.fin?.slice(0, 5)}`,
        carnet: t.personaAsignada?.carnet || '',
        apellidos: t.personaAsignada?.apellido || '',
        nombre: t. personaAsignada?.nombre || '',
        asistencia: t.cumplimiento === true ? 'cumplido' 
          : (t.cumplimiento === false ?  'incumplido' : null)
      }
    })

  } catch (err) {
    error.value = 'No se pudieron cargar las asistencias.'
    console.error(err)
  } finally {
    loading.value = false
  }
})

async function exportToPdf() {
  try {
    const grouped = {}
    for (const g of guardias. value) {
      const fecha = g.fecha
      if (!grouped[fecha]) grouped[fecha] = []
      grouped[fecha].push(g)
    }

    const plantilla = Object.entries(grouped).map(([fecha, turnos]) => ({
      fecha,
      turnos: turnos. map(g => ({
        horario: {
          inicio: g.horario.split(' - ')[0],
          fin: g.horario.split(' - ')[1]
        },
        personaAsignada: {
          nombre: g.nombre,
          apellido: g.apellidos,
          carnet: g. carnet
        },
        cumplimiento: g. asistencia === 'cumplido' ? true : (g.asistencia === 'incumplido' ? false : null)
      }))
    }))

    const response = await exportAsistenciasToPdf(plantilla) // ← Sin rutaArchivo

    const blob = new Blob([response. data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'asistencias.pdf')
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    console.log('✅ PDF descargado exitosamente')
  } catch (err) {
    console.error('❌ Error exportando PDF:', err)
  }
}

</script>