<template>
  <!-- Contenido del modal de Configuración -->
  <div>
    <div class="modal-header">
      <button type="button" class="close" @click="$emit('onClose')" aria-label="Cerrar modal">&times;</button>
      <h4 class="modal-title">Añadir Configuración</h4>
    </div>

    <div class="modal-body">
      <div class="form-group">
        <label class="control-label">Cantidad de personas en el turno</label>
        <input type="number" min="1" class="form-control" v-model.number="form.persons" />
      </div>

      <div class="form-group">
        <label class="control-label">Tipo de persona</label>
        <select class="form-control" v-model="form.personType">
          <option value="Ambos">Ambos</option>
          <option value="Docente">Trabajador</option>
          <option value="Estudiante">Estudiante</option>
        </select>
      </div>

      <div class="form-group">
        <label class="control-label">Sexo</label>
        <select class="form-control" v-model="form.sex">
          <option value="Ambos">Ambos</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
        </select>
      </div>

      <div class="form-group">
        <label class="control-label">Día de la semana</label>
        <select class="form-control" v-model="form.day">
          <option value="Lunes">Lunes</option>
          <option value="Martes">Martes</option>
          <option value="Miércoles">Miércoles</option>
          <option value="Jueves">Jueves</option>
          <option value="Viernes">Viernes</option>
          <option value="Sábado">Sábado</option>
          <option value="Domingo">Domingo</option>
        </select>
      </div>

      <!-- Lista de horarios registrados (realmente: todos los horarios disponibles) -->
      <div class="form-group">
        <label class="control-label">Horario</label>
        <div class="d-flex" style="gap: 8px; flex-wrap: wrap; align-items: center;">
          <select class="form-control" v-model="selectedIndex" style="min-width: 220px;">
            <option v-for="(s, idx) in allHorarios" :key="idx" :value="idx">
              {{ s.start }} - {{ s.end }}
            </option>
            <option v-if="allHorarios.length === 0" disabled value="-1">Sin horarios</option>
          </select>
        </div>
      </div>

      <div class="form-group d-flex" style="gap: 8px; align-items: center;">
        <input type="checkbox" v-model="form.break" id="breakCheck" />
        <label for="breakCheck" class="control-label" style="margin: 0;">¿Es receso?</label>
      </div>
    </div>

    <div class="modal-footer d-flex">
      <button type="button" class="btn btn-white" @click="$emit('onClose')">Cancelar</button>
      <button type="button" class="btn btn-info" @click="submit">Aceptar</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getAllHorarios } from '@/services/scheduleService'

function getDiaSemanaInt(str) {
  const map = {
    'Domingo': 0,
    'Lunes': 1,
    'Martes': 2,
    'Miércoles': 3,
    'Jueves': 4,
    'Viernes': 5,
    'Sábado': 6
  }
  return map[str] ?? 1
}
function mapSexoToBackend(sexo) {
  if (sexo === 'Masculino') return 'M'
  if (sexo === 'Femenino') return 'F'
  return null
}

const allHorarios = ref([])
const selectedIndex = ref(-1)

onMounted(async () => {
  try {
    const response = await getAllHorarios()
    allHorarios.value = response.data.map(h => ({
      start: h.inicio,
      end: h.fin
    }))
    // Selecciona por defecto el primero si hay horarios
    if (allHorarios.value.length > 0) {
      selectedIndex.value = 0
    }
  } catch (err) {
    console.error('Error cargando horarios desde la API:', err)
  }
})

const props = defineProps({
  initial: { type: Object, default: null }
})
const emit = defineEmits(['onClose', 'onSubmit'])

const form = reactive({
  persons: props.initial?.persons ?? 1,
  personType: props.initial?.personType ?? 'Ambos',
  sex: props.initial?.sex ?? 'Ambos',
  day: props.initial?.day ?? 'Lunes',
  break: props.initial?.break ?? false
})

function submit() {
  const idx = selectedIndex.value
  if (allHorarios.value.length === 0 || idx === -1) {
    alert('Por favor, seleccione un horario antes de guardar la configuración.')
    return
  }
  const horarioSeleccionado = allHorarios.value[idx]
  emit('onSubmit', {
    diaSemana: getDiaSemanaInt(form.day),
    horario: { 
      inicio: horarioSeleccionado.start, 
      fin: horarioSeleccionado.end 
    },
    cantPersonas: Number(form.persons),
    sexo: mapSexoToBackend(form.sex),
    tipoPersona: form.personType === 'Ambos' ? null : { nombre: form.personType },
    receso: !!form.break
  })
}
</script>