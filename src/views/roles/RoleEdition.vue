<template>
  <div class="modal-header">
    <button type="button" class="close" @click="closeWindow" aria-label="Cerrar modal">&times;</button>
    <h4 class="modal-title">{{ !!rolNombre ? 'Editar' : 'Nuevo' }} rol</h4>
  </div>
  
  <div class="modal-body">
  
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label for="nombre" class="control-label">Nombre</label>
          <input type="text" class="form-control" id="nombre" v-model="form.nombre" placeholder="Nombre">
          <validation-message for="nombre" message="Requerido" :visible="v$.nombre.$error"></validation-message>
        </div>	
      </div>
    </div>

  </div>
  
  <div class="modal-footer d-flex">
    <button type="button" class="btn btn-danger mr-auto" @click="deleteRecord">Eliminar</button>
    <button type="button" class="btn btn-info" @click="saveRecord">Guardar</button>
    <button type="button" class="btn btn-white" @click="closeWindow">Cerrar</button>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { insertRol, updateRol, deleteRol } from '@/services/rolService'

const props = defineProps({
  rolNombre: { type: String }
})
const emit = defineEmits(['onClose'])

// Crear las propiedades del formulario, o sea los inputs, ej. <input type="text" v-model="form.nombre"
const form = reactive({
  nombre: props.rolNombre
})

// Reglas de validación de las propiedades
const rules = {
  nombre: { required }
}

// Inicializar Vuelidate, para validar que las reglas de validacion se cumplan en el form
const v$ = useVuelidate(rules, form)

const closeWindow = () => {
  emit('onClose') 
}

const error = ref(null)

const saveRecord = async () => {
  await v$.value.$validate()

  if (v$.value.$invalid) {
    error.value = 'Por favor completa todos los campos obligatorios'
    return
  }

  try {
    if (!props.rolNombre)
      await insertRol(form.nombre)
    else
      await updateRol(props.rolNombre, form.nombre)
  } catch (err) {
    error.value = 'Error guardando cambios'
  }
}

const deleteRecord = async () => {
  if (!confirm('¿Está seguro de que quiere eliminar el registro?')) return

  try {
    await deleteRol(props.rolNombre)
    closeWindow()
  } catch (err) {
    error.value = 'Error al eliminar'
  }
}
</script>
