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
              <td>{{ g.dia }}</td>
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

const guardias = ref([])
const route = useRoute()
const fecha = route.params.id

const loading = ref(true)
const error = ref(null)

// Valida formato ISO yyyy-mm-dd
const isIsoDate = (s) => {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(new Date(s).getTime())
}

onMounted(async () => {

    const response = await getTurnosAPartirDe(fecha)
    const turnos = response?.data ?? []

    guardias.value = turnos.map((t, index) => {
      const inicio = t.horario?.inicio ? t.horario.inicio.slice(0, 5) : ''
      const fin = t.horario?.fin ? t.horario.fin.slice(0, 5) : ''
      return {
        id: t.id || index,
        dia: new Date(t.fecha).toLocaleDateString('es-ES', {
          day: 'numeric',
          weekday: 'long'
        }),
        horario: inicio && fin ? `${inicio} - ${fin}` : (inicio || fin || ''),
        carnet: t.personaAsignada?.carnet || '',
        apellidos: t.personaAsignada?.apellido || '',
        nombre: t.personaAsignada?.nombre || ''
      }
    })
})

function exportToPdf() {
  // TODO: conectar con API o fallback de frontend
  console.log('[Export] Planificación -> PDF (pendiente de servicio)')
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