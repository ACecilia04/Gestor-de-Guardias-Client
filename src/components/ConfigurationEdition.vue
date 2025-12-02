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

      <!-- Lista de horarios registrados + botón para abrir el segundo modal -->
      <div class="form-group">
        <label class="control-label">Horarios registrados</label>
        <div class="d-flex" style="gap: 8px; flex-wrap: wrap; align-items: center;">
          <select class="form-control" v-model="selectedIndex" style="min-width: 220px;">
            <option v-for="(s, idx) in form.schedules" :key="idx" :value="idx">
              {{ s.start }} - {{ s.end }}
            </option>
            <option v-if="form.schedules.length === 0" disabled value="-1">Sin horarios</option>
          </select>

          <!-- Solo este botón, sin inputs inline ni eliminar -->
          <button type="button" class="btn btn-info" @click="openAddSchedule">
            Añadir horario
          </button>
        </div>
      </div>

      <div class="form-group d-flex" style="gap: 8px; align-items: center;">
        <input type="checkbox" v-model="form.break" id="breakCheck" />
        <label for="breakCheck" class="control-label" style="margin: 0;">¿Es receso?</label>
      </div>
    </div>

    <div class="modal-footer d-flex">
      <button type="button" class="btn btn-white" @click="$emit('onClose')">Cancel...</button>
      <button type="button" class="btn btn-info" @click="submit">Aceptar</button>
    </div>
  </div>

  <!-- Modal secundario: AddSchedule -->
  <div class="modal fade in" style="display:block" v-if="showAddSchedule">
    <div class="modal-backdrop fade in" style="height: 100vh;"></div>
    <div class="modal-dialog">
      <div class="modal-content">
        <AddSchedule
          :initial="{ start: '09:00', end: '14:00' }"
          @onClose="closeAddSchedule"
          @onSubmit="receiveSchedule"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import AddSchedule from './AddSchedule.vue'

const props = defineProps({
  initial: { type: Object, default: null }
})
const emit = defineEmits(['onClose', 'onSubmit'])

const form = reactive({
  persons: props.initial?.persons ?? 1,
  personType: 'Ambos',
  sex: props.initial?.sex ?? 'Ambos',
  day: props.initial?.day ?? 'Lunes',
  break: props.initial?.break ?? false,
  schedules: props.initial?.time
    ? [{ start: props.initial.time.split(' - ')[0], end: props.initial.time.split(' - ')[1] }]
    : []
})

// Índice seleccionado como ref real (ya no computed) para que el select funcione bien
const selectedIndex = ref(form.schedules.length ? 0 : -1)
watch(() => form.schedules.length, (len) => {
  selectedIndex.value = len ? 0 : -1
})

// Segundo modal: estado y handlers
const showAddSchedule = ref(false)
function openAddSchedule() {
  showAddSchedule.value = true
}
function closeAddSchedule() {
  showAddSchedule.value = false
}
function receiveSchedule(s) {
  // Sin validaciones por ahora
  form.schedules.push({ start: s.start, end: s.end })
  showAddSchedule.value = false
}

function submit() {
  emit('onSubmit', {
    persons: Number(form.persons),
    personType: form.personType,
    sex: form.sex,
    day: form.day,
    break: !!form.break,
    schedules: form.schedules.map(s => ({ start: s.start, end: s.end }))
  })
}
</script>