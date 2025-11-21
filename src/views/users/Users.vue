<template>
  <!-- Responsive Users Table -->
  <div class="row">
    <div class="col-md-12">

      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">Usuarios</h3>
          <div class="panel-options">
            <a href="#" @click="openEditionForm(null)">
              <i class="fa fa-user-plus"></i>
            </a>
          </div>
        </div>

        <div class="panel-body">
          <div
            class="table-responsive"
            data-pattern="priority-columns"
            data-focus-btn-icon="fa-asterisk"
            data-sticky-table-header="true"
            data-add-display-all-btn="true"
            data-add-focus-btn="true"
          >
            <table class="table table-striped table-bordered table-clickable" cellspacing="0" width="100%">
              <thead>
                <tr>
                  <th>Nombre de Usuario</th>
                  <th>Rol</th>
                </tr>
              </thead>

              <tfoot>
                <tr>
                  <th>Nombre de Usuario</th>
                  <th>Rol</th>
                </tr>
              </tfoot>

              <tbody>
                <tr
                  v-for="usuario in usuarios"
                  :key="usuario.id"
                  @click="openEditionForm(usuario)"
                >
                  <td>{{ usuario.nombreUsuario }}</td>
                  <td>{{ usuario.rol.nombre }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="loading">Cargando usuarios...</div>
          <div v-if="error">{{ error }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal for User Edition -->
  <div class="modal fade in" style="display:block" id="modal-edition" v-if="showModal">
    <div class="modal-backdrop fade in" style="height: 100vh;"></div>
    <div class="modal-dialog">
      <div class="modal-content">
        <UserEdition :usuario="selectedUser" @onClose="closeEditionForm" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getAllUsuarios } from '@/services/userService'
import UserEdition from './UserEdition.vue'

const usuarios = ref([])
const showModal = ref(false)
const selectedUser = ref(null)

const openEditionForm = (usuario) => {
  showModal.value = true
  selectedUser.value = usuario
}

const closeEditionForm = async () => {
  showModal.value = false
  const response = await getAllUsuarios()
  usuarios.value = response.data
}

const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  loading.value = true
  try {
    const response = await getAllUsuarios()
    usuarios.value = response.data
  } catch (err) {
    error.value = 'No se pudieron cargar los usuarios'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>