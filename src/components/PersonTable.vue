<!-- PersonTable.vue -->
<template>
  <div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">{{ title }}</h3>
    </div>
    <div class="panel-body">
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Carnet</th>
            <th>Apellido</th>
            <th>Nombre</th>
            <th>Sexo</th>
            <th>Disponibilidad</th>
            <th>Días desde última guardia</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="persona in personas" :key="persona.id">
            <td>{{ persona.carnet }}</td>
            <td>{{ persona.apellido }}</td>
            <td>{{ persona.nombre }}</td>
            <td>{{ persona.sexo }}</td>
            <td>{{ persona.disponibilidad }}</td>
            <td>{{ persona.diasDesdeUltimaGuardia }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { getTablaByTipo } from '@/services/personService'

const props = defineProps({ tipo: String })
const personas = ref([])

const pluralMap = {
  Trabajador: 'Trabajadores',
  Estudiante: 'Estudiantes',
  Directivo: 'Directivos'
}

const title = computed(() => pluralMap[props.tipo] || props.tipo + 's')

const loadData = async () => {
  const response = await getTablaByTipo(props.tipo)
  personas.value = response.data
}

onMounted(loadData)
watch(() => props.tipo, loadData)
</script>
