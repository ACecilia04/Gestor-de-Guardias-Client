<template>
  <div>
    <h1>Roles</h1>
    <table>
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
