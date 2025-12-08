<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h3 class="panel-title">Planificación</h3>
      <div class="panel-options">
        <a href="#" @click.prevent="exportToPdf" title="Exportar PDF">
          <i class="fa fa-file-pdf-o"></i>
        </a>
      </div>
    </div>

    <div class="panel-body">
      <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
        <table class="table table-bordered table-striped">
          <thead>
            <tr class="bg-primary text-white">
              <th>Día</th>
              <th>Horario</th>
              <th>Carnet</th>
              <th>Apellidos</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="g in guardias" :key="g.id">
              <td>{{ g. dia }}</td>
              <td>{{ g.horario }}</td>
              <td>{{ g.carnet }}</td>
              <td>{{ g.apellidos }}</td>
              <td>{{ g.nombre }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="loading" class="text-muted mt-3">Cargando planificación...</div>
      <div v-if="error" class="text-danger mt-2">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getTurnosAPartirDe } from '@/services/planificationService'
import { exportPlanificacionToPdf } from '@/services/exportService'

const guardias = ref([])
const route = useRoute()
const fecha = route.params.id

const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await getTurnosAPartirDe(fecha)
    const turnos = response?.data ?? []

    guardias.value = turnos.map((t, index) => {
      // Asegurar formato ISO YYYY-MM-DD para la fecha
      const fechaObj = new Date(t.fecha)
      const fechaISO = fechaObj.toISOString().split('T')[0]
      
      const inicio = t.horario?.inicio ? t.horario.inicio. slice(0, 5) : ''
      const fin = t. horario?.fin ? t.horario.fin.slice(0, 5) : ''
      
      return {
        id: t.id || index,
        fecha: fechaISO, // ← Formato "2025-12-08"
        dia: fechaObj.toLocaleDateString('es-ES', {
          day: 'numeric',
          weekday: 'long'
        }),
        horario: inicio && fin ? `${inicio} - ${fin}` : (inicio || fin || ''),
        carnet: t.personaAsignada?.carnet || '',
        apellidos: t.personaAsignada?.apellido || '',
        nombre: t.personaAsignada?.nombre || ''
      }
    })
  } catch (err) {
    error.value = 'No se pudo cargar la planificación.'
    console.error(err)
  } finally {
    loading.value = false
  }
})

async function exportToPdf() {
  try {
    // Agrupar guardias por fecha
    const grouped = {}
    for (const g of guardias.value) {
      const fecha = g.fecha // debe ser formato YYYY-MM-DD
      if (!grouped[fecha]) grouped[fecha] = []
      grouped[fecha].push(g)
    }

    // Construir estructura de plantilla para el backend
    const plantilla = Object.entries(grouped).map(([fecha, turnos]) => {
      const [inicio, fin] = turnos[0]?.horario. split(' - ') || ['', '']
      
      return {
        fecha, // formato ISO "2025-12-08"
        turnos: turnos.map(g => {
          const [horarioInicio, horarioFin] = g.horario.split(' - ')
          
          return {
            id: g.id,
            horario: {
              inicio: horarioInicio || '', // "08:00"
              fin: horarioFin || ''         // "10:00"
            },
            personaAsignada: {
              nombre: g.nombre,
              apellido: g.apellidos,
              carnet: g.carnet
            },
          }
        })
      }
    })

    console.log('Plantilla enviada al backend:', JSON.stringify(plantilla, null, 2))
    
    const response = await exportPlanificacionToPdf(plantilla)

    // Crear y descargar el PDF
    const blob = new Blob([response. data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'planificacion.pdf')
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    console.log('PDF de planificación descargado exitosamente')
  } catch (err) {
    console.error('Error exportando PDF:', err)
    alert('Error al generar el PDF. Revisa la consola.')
  }
}
</script>

<style scoped>
.panel-heading {
  color: #fff;
}

.table th {
  background-color: #fff !important;
  color: #000 !important;
  font-weight: 600;
}

.table-striped>tbody>tr:nth-of-type(odd) {
  background-color: #f8f9fc;
}

.table-hover tbody tr:hover {
  background-color: #e6f0ff;
}

.panel {
  transition: all 0.3s ease;
}

.panel:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 14px rgba(0, 90, 170, 0.25);
}
</style>