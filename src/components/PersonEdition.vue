<template>
  <div class="modal-header">
    <button type="button" class="close" @click="closeWindow" aria-label="Cerrar modal">&times;</button>
    <h4 class="modal-title">{{ persona?.id ? 'Editar' : 'Nueva' }} persona</h4>
  </div>

  <div class="modal-body">
    <div class="form-group">
      <label for="nombre" class="control-label">Nombre</label>
      <input type="text" class="form-control" id="nombre" v-model="form.nombre" placeholder="Nombre" />
      <validation-message for="nombre" message="Requerido" :visible="v$.nombre.$error" />
    </div>

    <div class="form-group">
      <label for="apellido" class="control-label">Apellido</label>
      <input type="text" class="form-control" id="apellido" v-model="form.apellido" placeholder="Apellido" />
      <validation-message for="apellido" message="Requerido" :visible="v$.apellido.$error" />
    </div>

    <div class="form-group">
      <label for="carnet" class="control-label">Carnet</label>
      <input type="text" class="form-control" id="carnet" v-model="form.carnet" placeholder="Carnet" />
      <validation-message for="carnet" message="Requerido" :visible="v$.carnet.$error" />
    </div>

    <div class="form-group">
      <label for="sexo" class="control-label">Sexo</label>
      <select class="form-control" id="sexo" v-model="form.sexo">
        <option disabled value="">Seleccione sexo</option>
        <option value="Masculino">Masculino</option>
        <option value="Femenino">Femenino</option>
      </select>
      <validation-message for="sexo" message="Requerido" :visible="v$.sexo.$error" />
    </div>
  </div>

  <div class="modal-footer d-flex">
    <button type="button" class="btn btn-danger mr-auto" @click="deleteRecord" v-if="persona?.id">Eliminar</button>
    <button type="button" class="btn btn-info" @click="saveRecord">Guardar</button>
    <button type="button" class="btn btn-white" @click="closeWindow">Cerrar</button>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { insertPersona, updatePersona, deletePersonaById } from '@/services/personService'

const props = defineProps({ persona: Object })
const emit = defineEmits(['onClose'])

const form = reactive({
  nombre: props.persona?.nombre || '',
  apellido: props.persona?.apellido || '',
  carnet: props.persona?.carnet || '',
  sexo: props.persona?.sexo || ''
})

const rules = {
  nombre: { required },
  apellido: { required },
  carnet: { required },
  sexo: { required }
}

const v$ = useVuelidate(rules, form)
const error = ref(null)

const closeWindow = () => emit('onClose')

const saveRecord = async () => {
  await v$.value.$validate()
  if (v$.value.$invalid) {
    error.value = 'Por favor completa todos los campos obligatorios'
    return
  }

  try {
    if (!props.persona?.id) {
      await insertPersona({ ...form })
    } else {
      await updatePersona({ ...props.persona, ...form })
    }
    closeWindow()
  } catch (err) {
    error.value = 'Error guardando cambios'
    console.error(err)
  }
}

const deleteRecord = async () => {
  if (!confirm('¿Está seguro de que quiere eliminar el registro?')) return
  try {
    await deletePersonaById(props.persona.id)
    closeWindow()
  } catch (err) {
    error.value = 'Error al eliminar'
    console.error(err)
  }
}
</script>