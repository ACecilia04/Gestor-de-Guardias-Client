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
                <td>
                  {{
                    (() => {
                      const p = turno.personaAsignada || (Array.isArray(turno.personasAsignadas) ? turno.personasAsignadas[0] : null)
                      return p
                        ? (p.nombre || '') + ' ' + (p.apellido || '') + (p.carnet ? (' (' + p.carnet + ')') : '')
                        : '—'
                    })()
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else-if="!loading && !error" class="text-muted">
        No hay días en la plantilla.
      </div>
    </div>

    <!-- Backdrop + editor mientras se edita -->
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
    console.log('[crearPlantilla] raw response:', response)

    const payload = response?.data ?? response
    console.log('[crearPlantilla] payload used:', payload)

    dias.value = Array.isArray(payload) ? payload : []
    if (!Array.isArray(dias.value)) {
      dias.value = []
      error.value = 'Respuesta inesperada del servidor'
      console.warn('[crearPlantilla] payload no es array, se fuerza dias=[]')
    }
  } catch (err) {
    console.error('Error loadPlantilla:', err)
    error.value = 'Error cargando plantilla'
  } finally {
    loading.value = false
  }
}

/*
  Crear planificación automáticamente (usa solo la primera persona devuelta por backend)
*/
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
    console.log('[crearPlanificacionAutomaticamente] input dias:', dias.value)
    const resp = await crearPlanificacionAutomaticamente(dias.value)
    console.log('[crearPlanificacionAutomaticamente] raw response:', resp)

    const assignedDias = resp?.data ?? resp
    console.log('[crearPlanificacionAutomaticamente] assignedDias used:', assignedDias)

    if (Array.isArray(assignedDias) && assignedDias.length > 0) {
      dias.value = assignedDias.map(d => ({
        ...d,
        turnos: (Array.isArray(d.turnos) ? d.turnos : []).map(t => {
          const first = t.personaAsignada || (Array.isArray(t.personasAsignadas) ? t.personasAsignadas[0] : null)
          return {
            ...t,
            personaAsignada: first || null,
            personasAsignadas: first ? [first] : []
          }
        })
      }))
    } else {
      console.warn('[crearPlanificacionAutomaticamente] assignedDias vacío o no array, fallback a loadPlantilla(false)')
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
  Guardar todos los turnos (solo la primera persona por turno, payload mínimo compatible)
*/
const guardarTodos = async () => {
  if (saving.value || loading.value) return
  if (!dias.value || dias.value.length === 0) {
    error.value = 'No hay turnos para guardar.'
    return
  }

  const payloadDias = []
  let totalTurnos = 0
  let turnosConPersona = 0

  for (const d of dias.value) {
    const turnos = Array.isArray(d.turnos) ? d.turnos : []
    totalTurnos += turnos.length

    // Construir turnos asignados con solo la primera persona (si existe)
    const turnosAsignados = turnos
      .map(t => {
        const p = t.personaAsignada || (Array.isArray(t.personasAsignadas) ? t.personasAsignadas[0] : null)
        if (!p || p.id == null) return null

        // Payload mínimo: evita enviar Persona completa y personaAsignada para no romper deserialización
        return {
          // incluir id del turno si existe; no es obligatorio para inserción
          id: t.id ?? null,
          fecha: d.fecha, // en muchos backends se requiere dentro del turno
          horario: {id: t.horario. id,
          inicio: t. horario.inicio, // AGREGADO
          fin: t.horario. fin         // AGREGAD
          },
          // solo primera persona en lista y solo su id
          personasAsignadas: [{ id: p.id }]
        }
      })
      .filter(Boolean)

    turnosConPersona += turnosAsignados.length

    if (turnosAsignados.length > 0) {
      payloadDias.push({
        fecha: d.fecha,
        turnos: turnosAsignados
      })
    }
  }

  console.log('[guardarTurnos] resumen conteos:', { totalTurnos, turnosConPersona })
  console.log('[guardarTurnos] payloadDias (minimo, solo primera persona):', payloadDias)

  if (turnosConPersona === 0) {
    error.value = 'No hay turnos con persona asignada para guardar.'
    return
  }

  saving.value = true
  error.value = null
  try {
    const resp = await guardarTurnos(payloadDias)
    console.log('[guardarTurnos] raw response:', resp)
    console.log(`guardarTurnos: enviados ${turnosConPersona} turnos de ${totalTurnos} totales`)
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
  console.log('[editTurno] fecha seleccionada:', fecha)
  console.log('[editTurno] turno original:', turno)

  selectedFecha.value = fecha
  try {
    selectedTurno.value = JSON.parse(JSON.stringify(turno))
    console.log('[editTurno] turno clonado (deep):', selectedTurno.value)
  } catch (e) {
    console.warn('[editTurno] fallo deep clone, usando shallow copy:', e)
    selectedTurno.value = { ...turno }
    console.log('[editTurno] turno clonado (shallow):', selectedTurno.value)
  }
}

/*
  Actualizar turno dentro de dias (normalizando a solo la primera persona)
*/
const updateTurno = (updatedTurno) => {
  console.log('[updateTurno] updatedTurno recibido:', updatedTurno)
  const dia = dias.value.find(d => d.fecha === selectedFecha.value)
  console.log('[updateTurno] dia encontrado:', dia)

  if (!dia) {
    console.warn('No se encontró el día para la fecha:', selectedFecha.value)
    selectedTurno.value = null
    return
  }

  let idx = -1
  if (updatedTurno.id !== undefined && updatedTurno.id !== null) {
    idx = dia.turnos.findIndex(t => t.id === updatedTurno.id)
    console.log('[updateTurno] búsqueda por id, idx:', idx)
  } else {
    idx = dia.turnos.findIndex(t =>
      t.horario?.inicio === updatedTurno.horario?.inicio &&
      t.horario?.fin === updatedTurno.horario?.fin
    )
    console.log('[updateTurno] búsqueda por horario, idx:', idx)
  }

  if (idx !== -1) {
    const before = dia.turnos[idx]
    const first = updatedTurno.personaAsignada || (Array.isArray(updatedTurno.personasAsignadas) ? updatedTurno.personasAsignadas[0] : null)
    dia.turnos[idx] = {
      ...updatedTurno,
      personaAsignada: first || null,
      personasAsignadas: first ? [{ id: first.id, nombre: first.nombre, apellido: first.apellido, carnet: first.carnet }] : []
    }
    console.log('[updateTurno] reemplazado turno:', { before, after: dia.turnos[idx], idx })
  } else {
    console.warn('No se encontró el turno para actualizar. Considerar agregarlo manualmente.', updatedTurno)
  }

  selectedTurno.value = null
}

const formatDate = (iso) => {
  try {
    const formatted = new Date(iso).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
    console.log('[formatDate] input:', iso, 'output:', formatted)
    return formatted
  } catch (e) {
    console.warn('[formatDate] fallo al formatear, devolviendo iso:', iso, e)
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