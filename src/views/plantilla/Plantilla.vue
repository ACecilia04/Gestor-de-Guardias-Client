<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h3 class="panel-title">Nueva Planificación</h3>
      <div class="panel-options">
        <!-- Crear plantilla (próximo mes / hoy) -->
        <a href="#" @click.prevent="loadPlantilla(false)" title="Crear desde próximo mes" :class="{ disabled: loading }">
          <i class="fa fa-calendar"></i>
        </a>

        <a href="#" @click.prevent="loadPlantilla(true)" title="Crear desde hoy" :class="{ disabled: loading }">
          <i class="fa fa-calendar"></i>
        </a>

        <!-- Nuevo: crear planificacion automáticamente (usa dias actuales) -->
        <a href="#" @click.prevent="crearAutomatica" title="Crear planificación automáticamente" :class="{ disabled: creatingAuto || loading }">
          <i class="fa fa-magic"></i>
        </a>

        <!-- Nuevo: guardar turnos en backend y navegar a /planif -->
        <a href="#" @click.prevent="guardarTodos" title="Guardar turnos y ver planificación" :class="{ disabled: saving || loading }">
          <i class="fa fa-floppy-o"></i>
        </a>
      </div>
    </div>
    <div class="panel-body">
      <div v-if="loading">Cargando plantilla...</div>
      <div v-if="error" class="text-danger">{{ error }}</div>

      <div v-if="dias.length" class="table-responsive" style="max-height: 400px; overflow-y: auto;">
        <div v-for="dia in dias" :key="dia.fecha" class="mb-4">
          <h5 class="text-primary">{{ formatDate(dia.fecha) }}</h5>
          <table class="table table-hover table-bordered table-striped table-clickable">
            <thead>
              <tr>
                <th>Horario</th>
                <th>Persona Asignada</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(turno, idx) in dia.turnos"
                :key="turno.id ?? idx"
                @click="editTurno(dia.fecha, turno)"
                style="cursor: pointer;"
              >
                <td>{{ turno.horario?.inicio ?? '' }} - {{ turno.horario?.fin ?? '' }}</td>
                <td>{{ turno.personaAsignada?.nombre  || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else-if="!loading && !error" class="text-muted">
        No hay días en la plantilla.
      </div>
    </div>

    <!-- TurnoEditor as a side panel with backdrop.
         Note: TurnoEditor itself is fixed-positioned; we render a backdrop and the component when editing. -->
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { crearPlantilla, crearPlanificacionAutomaticamente } from '@/services/plantillaService'
import { guardarTurnos } from '@/services/planificationService'
import TurnoEditor from './TurnoEditor.vue'

const dias = ref([])
const loading = ref(false)
const error = ref(null)

const creatingAuto = ref(false)
const saving = ref(false)

const selectedTurno = ref(null)
const selectedFecha = ref(null)

const router = useRouter()

/*
  Cargar plantilla (ya existente)
*/
const loadPlantilla = async (empezarHoy) => {
  loading.value = true
  error.value = null
  try {
    const response = await crearPlantilla(empezarHoy)
    const payload = response?.data ?? response
    dias.value = Array.isArray(payload) ? payload : []
    if (!Array.isArray(dias.value)) {
      dias.value = []
      error.value = 'Respuesta inesperada del servidor'
    }
  } catch (err) {
    console.error('Error loadPlantilla:', err)
    error.value = 'Error cargando plantilla'
  } finally {
    loading.value = false
  }
}

/*
  Crear planificación automáticamente: llamamos al endpoint que crea la planificación
  en el backend. Se espera un payload de días; aquí enviamos los días actuales si existen.
*/
// usar la implementación que asume que crearPlanificacionAutomaticamente devuelve los dias ya asignados
const crearAutomatica = async () => {
  if (creatingAuto.value || loading.value) return

  if (!dias.value || dias.value.length === 0) {
    await loadPlantilla(false)
    if (!dias.value || dias.value.length === 0) {
      error.value = 'No se pudo generar la plantilla base para asignar personas.'
      return
    }
  }

  creatingAuto.value = true
  error.value = null

  try {
    // Enviar 'dias' al backend; backend devolverá los mismos dias con personasAsignadas rellenadas
    const resp = await crearPlanificacionAutomaticamente(dias.value)
    const assignedDias = resp?.data ?? resp

    if (Array.isArray(assignedDias) && assignedDias.length > 0) {
      // actualizar UI con los turnos ya asignados por el backend
      dias.value = assignedDias
    } else {
      // fallback: recargar desde server si no viene body
      await loadPlantilla(false)
    }
  } catch (err) {
    console.error('Error crearAutomatica:', err)
    error.value = 'Error al crear automáticamente la planificación'
  } finally {
    creatingAuto.value = false
  }
}

/*
  Guardar todos los turnos (guardarTurnos) filtrando únicamente los turnos que
  tienen personaAsignada. Los turnos sin personaAsignada NO se incluirán en la petición.
  Si no hay ningún turno con persona asignada se muestra mensaje y no se llama al backend.
*/
const guardarTodos = async () => {
  if (saving.value || loading.value) return
  if (!dias.value || dias.value.length === 0) {
    error.value = 'No hay turnos para guardar.'
    return
  }

  // Construir payload filtrado: mantener solo días con al menos un turno con personaAsignada
  const payloadDias = []
  let totalTurnos = 0
  let turnosConPersona = 0

  for (const d of dias.value) {
    const turnos = Array.isArray(d.turnos) ? d.turnos : []
    totalTurnos += turnos.length
    const turnosAsignados = turnos.filter(t => t?.personaAsignada && (t.personaAsignada.id !== undefined && t.personaAsignada.id !== null))
    turnosConPersona += turnosAsignados.length
    if (turnosAsignados.length > 0) {
      // enviar sólo la estructura mínima necesaria; si backend necesita más campos ajusta aquí
      payloadDias.push({
        fecha: d.fecha,
        turnos: turnosAsignados
      })
    }
  }

  if (turnosConPersona === 0) {
    error.value = 'No hay turnos con persona asignada para guardar.'
    return
  }

  saving.value = true
  error.value = null
  try {
    // Llamada al backend con sólo los turnos que tienen persona asignada
    await guardarTurnos(payloadDias)

    // Opcional: informar cuántos turnos se guardaron vs cuántos fueron ignorados
    console.log(`guardarTurnos: enviados ${turnosConPersona} turnos de ${totalTurnos} totales`)

    // Navegar a la pantalla de planificaciones
    router.push('/planif')
  } catch (err) {
    console.error('Error guardarTurnos:', err)
    error.value = 'Error guardando turnos en el servidor'
  } finally {
    saving.value = false
  }
}

/*
  Editar turno (mantener copy para el editor)
*/
const editTurno = (fecha, turno) => {
  selectedFecha.value = fecha
  try {
    selectedTurno.value = JSON.parse(JSON.stringify(turno))
  } catch (e) {
    selectedTurno.value = { ...turno }
  }
}

/*
  Actualizar turno dentro de dias (idéntico a tu implementación)
*/
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
      t.horario?.inicio === updatedTurno.horario?.inicio &&
      t.horario?.fin === updatedTurno.horario?.fin
    )
  }

  if (idx !== -1) {
    dia.turnos[idx] = updatedTurno
  } else {
    console.warn('No se encontró el turno para actualizar. Considerar agregarlo manualmente.', updatedTurno)
  }

  selectedTurno.value = null
}

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  } catch (e) {
    return iso
  }
}
</script>

<style scoped>
div.panel-heading > div.panel-options a {
  float: right;
  font-size: 13px;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-left: 6px;
  color: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
div.panel-heading > div.panel-options a.disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* icon sizing */
div.panel-heading > div.panel-options i.fa {
  font-size: 14px;
}
</style>