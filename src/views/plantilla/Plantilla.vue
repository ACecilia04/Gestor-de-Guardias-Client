<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h3 class="panel-title">Nueva Planificación</h3>

      <div class="panel-options">
        <button
          class="action-btn action-btn-outline"
          @click.prevent="loadPlantilla(false)"
          :disabled="loading"
          title="Crear desde próximo mes"
          aria-label="Crear desde próximo mes"
        >
          <i class="fa fa-calendar-plus-o" aria-hidden="true"></i>
          <span class="visually-hidden">Crear desde próximo mes</span>
        </button>

        <button
          class="action-btn"
          @click.prevent="loadPlantilla(true)"
          :disabled="loading"
          title="Crear desde hoy"
          aria-label="Crear desde hoy"
        >
          <i class="fa fa-calendar-check-o" aria-hidden="true"></i>
          <span class="visually-hidden">Crear desde hoy</span>
        </button>
      </div>
    </div>

    <div class="panel-body">
      <div v-if="loading">Cargando plantilla...</div>
      <div v-if="error" class="text-danger">{{ error }}</div>

      <div class="table-responsive" style="max-height: 400px; overflow-y: auto;" v-if="guardias.length">
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
            <tr v-for="g in guardias" :key="g.id" @click="onRowClick(g)" style="cursor: pointer;">
              <td>{{ g.dia }}</td>
              <td>{{ g.horario }}</td>
              <td>{{ g.carnet }}</td>
              <td>{{ g.apellidos }}</td>
              <td>{{ g.nombre }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="!loading && !error" class="text-muted">
        No hay días en la plantilla.
      </div>
    </div>

    <div v-if="selectedTurno">
      <div class="modal-backdrop fade in" style="height: 100vh;"></div>
      <TurnoEditor
        :fecha="selectedFecha"
        :turno="selectedTurno"
        @close="selectedTurno = null"
        @save="updateTurno"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { crearPlantilla } from '@/services/plantillaService'
import TurnoEditor from './TurnoEditor.vue'

const dias = ref([])
const loading = ref(false)
const error = ref(null)

const selectedTurno = ref(null)
const selectedFecha = ref(null)

const safeFormatDay = (iso) => {
  try {
    if (!iso && iso !== '') return ''
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return String(iso)
    return d.toLocaleDateString('es-ES', { day: 'numeric', weekday: 'long' })
  } catch {
    return String(iso)
  }
}

const safeToString = (v) => {
  if (v === undefined || v === null) return ''
  if (typeof v === 'string') return v
  try { return String(v) } catch { return '' }
}

const loadPlantilla = async (empezarHoy) => {
  loading.value = true
  error.value = null
  try {
    const response = await crearPlantilla(empezarHoy)
    const payload = response?.data ?? response

    // normalizar a array de dias con turnos
    const arr = Array.isArray(payload) ? payload : (Array.isArray(payload?.dias) ? payload.dias : [])
    dias.value = arr.map(d => ({
      fecha: d?.fecha ?? null,
      turnos: Array.isArray(d?.turnos) ? d.turnos : []
    }))
    console.log('Plantilla cargada (dias):', dias.value)
  } catch (err) {
    console.error('Error loadPlantilla:', err)
    error.value = 'Error cargando plantilla'
    dias.value = []
  } finally {
    loading.value = false
  }
}

// Computed: robusto y defensivo — evita llamadas a métodos inexistentes y captura errores.
const guardias = computed(() => {
  try {
    if (!Array.isArray(dias.value)) return []

    const list = []
    for (const d of dias.value) {
      const diaStr = d?.fecha ?? ''
      const prettyDia = safeFormatDay(diaStr)
      const turnos = Array.isArray(d?.turnos) ? d.turnos : []

      for (let idx = 0; idx < turnos.length; idx++) {
        const t = turnos[idx]
        // proteger tipos inesperados: convertir inicio/fin a string antes de slice
        const inicioRaw = t?.horario?.inicio
        const finRaw = t?.horario?.fin
        const inicio = safeToString(inicioRaw).slice(0, 5)
        const fin = safeToString(finRaw).slice(0, 5)
        const horario = (inicio || fin) ? (inicio && fin ? `${inicio} - ${fin}` : (inicio || fin)) : ''

        list.push({
          id: t?.id ?? `${diaStr}-${idx}`,
          rawDia: diaStr,
          dia: prettyDia,
          horario,
          carnet: t?.personaAsignada?.carnet ?? '',
          apellidos: t?.personaAsignada?.apellido ?? '',
          nombre: t?.personaAsignada?.nombre ?? '',
          turno: t
        })
      }
    }
    return list
  } catch (err) {
    console.error('Error en computed guardias:', err)
    // devolver array vacío en caso de fallo para que la UI no rompa
    return []
  }
})

const onRowClick = (g) => {
  selectedFecha.value = g.rawDia
  try {
    selectedTurno.value = JSON.parse(JSON.stringify(g.turno))
  } catch {
    selectedTurno.value = { ...g.turno }
  }
}

const updateTurno = (updatedTurno) => {
  const dia = dias.value.find(d => d.fecha === selectedFecha.value)
  if (!dia) {
    console.warn('No se encontró el día para la fecha:', selectedFecha.value)
    selectedTurno.value = null
    return
  }

  let idx = -1
  if (updatedTurno.id !== undefined && updatedTurno.id !== null) {
    idx = dia.turnos.findIndex(t => t.id === updatedTurno.id)
  } else {
    idx = dia.turnos.findIndex(t =>
      safeToString(t?.horario?.inicio) === safeToString(updatedTurno?.horario?.inicio) &&
      safeToString(t?.horario?.fin) === safeToString(updatedTurno?.horario?.fin)
    )
  }

  if (idx !== -1) {
    dia.turnos[idx] = updatedTurno
  } else {
    console.warn('No se encontró el turno para actualizar, no se añade automáticamente.', updatedTurno)
  }

  selectedTurno.value = null
}
</script>

<style scoped>
/* forzar que el header mantenga su posición y los botones sean visibles */
.panel-heading {
  position: relative;
  background: #fff;
  color: #222;
  display: block;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
}

/* título centrado visualmente */
.panel-title {
  margin: 0;
  text-align: center;
  font-size: 1.05rem;
  font-weight: 600;
}

/* opciones posicionadas a la derecha, siempre visibles */
.panel-options {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 8px;
  align-items: center;
  z-index: 5;
}

.action-btn {
  background-color: #0066CC;
  color: #fff;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
}
.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn-outline {
  background: #fff;
  color: #0066CC;
  border: 1px solid #0066CC;
}

.visually-hidden {
  border: 0 !important;
  clip: rect(1px, 1px, 1px, 1px) !important;
  clip-path: inset(50%) !important;
  height: 1px !important;
  margin: -1px !important;
  overflow: hidden !important;
  padding: 0 !important;
  position: absolute !important;
  width: 1px !important;
  white-space: nowrap !important;
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