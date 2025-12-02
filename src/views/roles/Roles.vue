<template>
  <!-- Responsive Roles Table -->
  <div class="row">
    <div class="col-md-12">
    
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">Roles</h3>
          <div class="panel-options">
            <a href="#" @click="openEditionForm('')">
              <i class="fa fa-plus"></i>
            </a>
          </div>
        </div>  
        
        <div class="panel-body">
          <div class="table-responsive" data-pattern="priority-columns" data-focus-btn-icon="fa-asterisk" data-sticky-table-header="true" 
            data-add-display-all-btn="true" data-add-focus-btn="true">
          
  					<table class="table table-striped table-bordered table-clickable" cellspacing="0" width="100%">
              <thead>
                <tr>
                  <th>Nombre</th>
                </tr>
              </thead>

              <tfoot>
                <tr>
                  <th>Nombre</th>
                </tr>
              </tfoot>

              <tbody>
                <tr v-for="rol in roles" :key="rol.nombre" @click="openEditionForm(rol.nombre)">
                  <td>{{ rol.nombre }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="loading">Cargando roles...</div>
          <div v-if="error">{{ error }}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade in" style="display:block" id="modal-edition" v-if="showModal">
    <div class="modal-backdrop fade in" style="height: 100vh;"></div>
		<div class="modal-dialog">
			<div class="modal-content">
        <RoleEdition :rolNombre="selectedRole" @onClose="closeEditionForm"/>
			</div>
		</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getAllRoles } from '@/services/rolService'
import RoleEdition from './RoleEdition.vue'

const roles = ref([])
const showModal = ref(false)
const selectedRole = ref('')

const openEditionForm = (selectedValue) => {
  //$('#modal-edition').modal('show', {backdrop: 'static'})
  showModal.value = true;
  selectedRole.value = selectedValue
}

const closeEditionForm = async () => {
  showModal.value = false
  const response = await getAllRoles()
  roles.value = response.data
}

const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  loading.value = true
  try {
    const response = await getAllRoles()
    roles.value = response.data
  } catch (err) {
    error.value = 'No se pudieron cargar los roles'
    console.error(err)
  } finally {
    loading.value = false
  }
})

</script>
