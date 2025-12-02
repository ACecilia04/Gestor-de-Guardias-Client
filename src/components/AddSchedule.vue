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
import { ref } from 'vue'

const props = defineProps({
  initial: { type: Object, default: () => ({ start: '08:00', end: '20:00' }) }
})
const emit = defineEmits(['onClose', 'onSubmit'])

const start = ref(props.initial.start ?? '08:00')
const end = ref(props.initial.end ?? '20:00')

function submit() {
  // Sin validaciones por pedido
  emit('onSubmit', { start: start.value, end: end.value })
}
</script>