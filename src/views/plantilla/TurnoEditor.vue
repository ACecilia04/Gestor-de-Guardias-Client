<template>
  <div class="turno-editor-panel">
    <div class="panel-header">
      <h4>Asignar Persona</h4>
      <button class="close" @click="closeWindow">&times;</button>
    </div>

    <div class="panel-body">
      <div class="form-group">
        <label for="persona" class="control-label">Seleccionar persona</label>
        <select class="form-control" v-model="selectedId">
          <option disabled value="">Seleccione una persona</option>
          <option v-for="p in personas" :key="p.id" :value="p.id">
            {{ p.nombre }} {{ p.apellido }} ({{ p.carnet }})
          </option>
        </select>
        <ValidationMessage for="persona" message="Requerido" :visible="!selectedId" />
      </div>
    </div>

    <div class="panel-footer d-flex">
      <button class="btn btn-info" @click="saveRecord" :disabled="!selectedId">Guardar</button>
      <button class="btn btn-white" @click="closeWindow">Cerrar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllPersonas } from '@/services/personService'
import ValidationMessage from '@/components/ValidationMessage.vue'

const props = defineProps({
  turno: Object,
  fecha: String
})
const emit = defineEmits(['close', 'save'])

const personas = ref([])
const selectedId = ref(props.turno?.personaAsignada?.id || '')

onMounted(async () => {
  try {
    const response = await getAllPersonas()
    personas.value = response.data
  } catch (err) {
    console.error('Error cargando personas:', err)
  }
})

const closeWindow = () => emit('close')

const saveRecord = () => {
  const persona = personas.value.find(p => p.id === selectedId.value)
  if (!persona) return
  const updatedTurno = {
    ...props.turno,
    personaAsignada: persona
  }
  emit('save', updatedTurno)
  closeWindow()
}
</script>

<style scoped>
.turno-editor-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 360px;
  height: 100%;
  background: #fff;
  border-left: 1px solid #ccc;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1050;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-body {
  padding: 15px;
  flex: 1;
  overflow-y: auto;
}

.panel-footer {
  padding: 15px;
  border-top: 1px solid #ddd;
}
</style>