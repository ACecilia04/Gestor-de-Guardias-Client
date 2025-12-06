<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h3 class="panel-title">Nueva Planificación</h3>
      <div class="panel-options">
        <a href="#" @click.prevent="loadPlantilla(false)" title="Crear desde próximo mes">
          <i class="fa fa-calendar-plus-o"></i>
        </a>
        <a href="#" @click.prevent="loadPlantilla(true)" title="Crear desde hoy">
          <i class="fa fa-calendar-check-o"></i>
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
                :key="idx"
                @click="editTurno(dia.fecha, turno)"
                style="cursor: pointer;"
              >
                <td>{{ turno.horario.inicio }} - {{ turno.horario.fin }}</td>
                <td>{{ turno.personaAsignada?.nombre || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade in" style="display: block" v-if="selectedTurno">
      <div class="modal-backdrop fade in" style="height: 100vh;"></div>
      <div class="modal-dialog">
        <div class="modal-content">
          <TurnoEditor
            :fecha="selectedFecha"
            :turno="selectedTurno"
            @close="selectedTurno = null"
            @save="updateTurno"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { crearPlantilla } from '@/services/plantillaService'
import TurnoEditor from './TurnoEditor.vue'

const dias = ref([])
const loading = ref(false)
const error = ref(null)

const selectedTurno = ref(null)
const selectedFecha = ref(null)

const loadPlantilla = async (empezarHoy) => {
  loading.value = true
  error.value = null
  try {
    const response = await crearPlantilla(empezarHoy)
    dias.value = response.data
  } catch (err) {
    error.value = 'Error cargando plantilla'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const editTurno = (fecha, turno) => {
  selectedFecha.value = fecha
  selectedTurno.value = { ...turno }
}

const updateTurno = (updatedTurno) => {
  // Buscar el día correspondiente
  const dia = dias.value.find(d => d.fecha === selectedFecha.value)
  if (!dia) {
    console.warn('No se encontró el día para la fecha:', selectedFecha.value)
    // Cerrar el editor para evitar quedar en estado inconsistente
    selectedTurno.value = null
    return
  }

  // Si el turno tiene un id único, usarlo; si no, comparar por horario
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
    // Reemplazar turno existente
    dia.turnos[idx] = updatedTurno
  } else {
    // Fallback: si no se encontró el turno por las claves anteriores,
    // opcionalmente agregarlo para mantener consistencia visual.
    // Si no querés este comportamiento, podés eliminar la siguiente línea.
    dia.turnos.push(updatedTurno)
  }

  selectedTurno.value = null
}

const formatDate = (iso) => new Date(iso).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
</script>