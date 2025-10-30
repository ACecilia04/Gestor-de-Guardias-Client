<template>
  <!-- Responsive Table -->
  <div class="row">
    <div class="col-md-12">
    
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">Roles</h3>
          <div class="panel-options">
            <a href="#">
              <i class="fa-file-o"></i>
            </a>
          </div>
        </div>  
        
        <div class="panel-body">
          <div class="table-responsive" data-pattern="priority-columns" data-focus-btn-icon="fa-asterisk" data-sticky-table-header="true" 
            data-add-display-all-btn="true" data-add-focus-btn="true">
          
            <table cellspacing="0" class="table table-small-font table-bordered table-striped">
              <thead>
                <tr>
                  <th>Nombre</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="rol in roles" :key="rol.nombre">
                  <td>{{ rol.nombre }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getAllRoles } from '../../services/rolService'

const roles = ref([])

onMounted(async () => {
  try {
    const response = await getAllRoles()
    roles.value = response.data
  } catch (err) {
    console.error('Error al cargar roles:', err)
  }
})
</script>
