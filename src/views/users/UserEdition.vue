<template>
  <div class="modal-header">
    <button type="button" class="close" @click="closeWindow" aria-label="Cerrar modal">&times;</button>
    <h4 class="modal-title">{{ usuario?.id ? 'Editar' : 'Nuevo' }} usuario</h4>
  </div>

  <div class="modal-body">
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label for="nombreUsuario" class="control-label">Nombre de Usuario</label>
          <input type="text" class="form-control" id="nombreUsuario" v-model="form.nombreUsuario"
            placeholder="Nombre de usuario" />
          <ValidationMessage for="nombreUsuario" message="Requerido" :visible="v$.nombreUsuario.$error" />
        </div>
      </div>

      <div class="col-md-6">
        <div class="form-group">
          <label for="rol" class="control-label">Rol</label>
          <select id="rol" class="form-control" v-model="form.rol">
            <option disabled value="">Seleccione un rol</option>
            <option v-for="r in roles" :key="r.nombre" :value="r.nombre">
              {{ r.nombre }}
            </option>
          </select>
          <ValidationMessage for="rol" message="Requerido" :visible="v$.rol.$error" />
        </div>

      </div>
    </div>
  </div>

  <div class="modal-footer d-flex">
    <button type="button" class="btn btn-danger mr-auto" @click="deleteRecord" v-if="usuario?.id">
      Eliminar
    </button>
    <button type="button" class="btn btn-info" @click="saveRecord">Guardar</button>
    <button type="button" class="btn btn-white" @click="closeWindow">Cerrar</button>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { insertUsuario, updateUsuario, deleteUsuario } from '@/services/userService'
import { getAllRoles } from '@/services/rolService'
import ValidationMessage from '@/components/ValidationMessage.vue'

const props = defineProps({
  usuario: { type: Object, default: null }
})

const emit = defineEmits(['onClose'])

const roles = ref([])
const error = ref(null)

const form = reactive({
  id: null,
  nombreUsuario: '',
  rol: ''
})

const rules = {
  nombreUsuario: { required },
  rol: { required }
}

const v$ = useVuelidate(rules, form)

onMounted(async () => {
  try {
    const response = await getAllRoles()
    roles.value = response.data
  } catch (err) {
    console.error('Error cargando roles:', err)
  }
})

// Watch for prop changes and populate form reactively
watch(
  () => props.usuario,
  (usuario) => {
    form.id = usuario?.id || null
    form.nombreUsuario = usuario?.nombre || ''
    form.rol = usuario?.rol?.nombre || ''
  },
  { immediate: true }
)

const closeWindow = () => {
  emit('onClose')
}

const saveRecord = async () => {
  await v$.value.$validate()
  if (v$.value.$invalid) {
    error.value = 'Por favor completa todos los campos obligatorios'
    return
  }

  try {
    const payload = {
      id: form.id,
      nombreUsuario: form.nombreUsuario,
      rol: { nombre: form.rol }
    }

    if (!form.id) {
      await insertUsuario(payload)
    } else {
      await updateUsuario(payload)
    }

    closeWindow()
  } catch (err) {
    error.value = 'Error guardando cambios'
    console.error(err)
  }
}

const deleteRecord = async () => {
  if (!confirm('¿Está seguro de que quiere eliminar el usuario?')) return

  try {
    await deleteUsuario(form.id)
    closeWindow()
  } catch (err) {
    error.value = 'Error al eliminar'
    console.error(err)
  }
}
</script>