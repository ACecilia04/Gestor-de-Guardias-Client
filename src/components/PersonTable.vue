<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h3 class="panel-title">{{ title }}</h3>
      <div class="panel-options">
        <a href="#" @click.prevent="openEditionForm(null)" title="Añadir">
          <i class="fa fa-plus"></i>
        </a>
        <!-- Botón Exportar PDF -->
        <a href="#" @click.prevent="exportToPdf" title="Exportar PDF">
          <i class="fa fa-file-pdf-o"></i>
        </a>
      </div>
    </div>
    <div class="panel-body">
      <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
        <table class="table table-hover table-bordered table-striped table-clickable">
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
            <tr
              v-for="persona in personas"
              :key="persona.id"
              @click="openEditionForm(persona)"
              style="cursor: pointer;"
            >
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
      <div v-if="loading">Cargando personas...</div>
      <div v-if="error">{{ error }}</div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade in" style="display: block" v-if="showModal">
    <div class="modal-backdrop fade in" style="height: 100vh;"></div>
    <div class="modal-dialog">
      <div class="modal-content">
        <PersonaEdition :persona="selectedPersona" @onClose="closeEditionForm" />
      </div>
    </div>
  </div>
</template>

<script setup>
// import { getPersonasPdf } from '@/services/exportService' // TODO: integrar servicio API
import { ref, onMounted, watch, computed } from 'vue'
import { getPersonasByTipo } from '@/services/personService'
import PersonaEdition from './PersonEdition.vue'

const props = defineProps({ tipo: String })
const personas = ref([])
const loading = ref(false)
const error = ref(null)

const pluralMap = {
  Trabajador: 'Trabajadores',
  Estudiante: 'Estudiantes',
  Directivo: 'Directivos'
}

const title = computed(() => pluralMap[props.tipo] || props.tipo + 's')

const loadData = async () => {
  loading.value = true
  try {
    const response = await getPersonasByTipo(props.tipo)
    personas.value = response.data
  } catch (err) {
    error.value = 'No se pudieron cargar las personas'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
watch(() => props.tipo, loadData)

// Modal logic
const showModal = ref(false)
const selectedPersona = ref(null)

const openEditionForm = (persona) => {
  showModal.value = true
  selectedPersona.value = persona
}

const closeEditionForm = async () => {
  showModal.value = false
  selectedPersona.value = null
  await loadData()
}

// Botón Exportar PDF (placeholder)
function exportToPdf() {
  // TODO: conectar con API o fallback de frontend
  // Ejemplo futuro:
  // const blob = await getPersonasPdf({ tipo: props.tipo })
  // downloadBlob(blob, `personas-${props.tipo}.pdf`)
  console.log('[Export] Personas -> PDF (pendiente de servicio)', props.tipo)
}
</script>