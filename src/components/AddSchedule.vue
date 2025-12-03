<template>
  <div>
    <div class="modal-header">
      <button type="button" class="close" @click="$emit('onClose')" aria-label="Cerrar modal">&times;</button>
      <h4 class="modal-title">Añadir horario</h4>
    </div>

    <div class="modal-body">
      <div class="form-group">
        <label class="control-label">Inicio</label>
        <input type="time" class="form-control" v-model="start" />
      </div>

      <div class="form-group">
        <label class="control-label">Fin</label>
        <input type="time" class="form-control" v-model="end" />
      </div>
    </div>

    <div class="modal-footer d-flex">
      <button type="button" class="btn btn-white" @click="$emit('onClose')">Cancelar</button>
      <button type="button" class="btn btn-info" @click="submit">Aceptar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { insertHorario, getAllHorarios } from '@/services/scheduleService'

const existingHorarios = ref([])

const props = defineProps({
  initial: { type: Object, default: () => ({ start: '08:00', end: '20:00' }) }
})
const emit = defineEmits(['onClose', 'onSubmit'])

const start = ref(props.initial.start ?? '08:00')
const end = ref(props.initial.end ?? '20:00')

onMounted(async () => {
  try {
    const response = await getAllHorarios()
    existingHorarios.value = response.data.map(h => ({
      inicio: h.inicio,
      fin: h.fin
    }))
  } catch (err) {
    console.error('Error cargando horarios existentes:', err)
  }
})

async function submit() {
  const exists = existingHorarios.value.some(h =>
    h.inicio === start.value && h.fin === end.value
  )

  if (exists) {
    alert('Este horario ya está registrado.')
    return
  }

  try {
    const payload = {
      inicio: start.value,
      fin: end.value
    }

    await insertHorario(payload)

    emit('onSubmit', payload)
    emit('onClose')
  } catch (err) {
    console.error('Error al guardar el horario:', err)
  }
}

</script>
