<template>
  <!-- Responsive Config Table -->
  <div class="row">
    <div class="col-md-12">

      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">Configuración</h3>
          <div class="panel-options">
            <a href="#" @click.prevent="openModal(null)" title="Añadir configuración">
              <i class="fa fa-plus"></i>
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
            style="max-height: 400px; overflow-y: auto;"
          >
            <ConfigurationTable
              :rows="rows"
              :columns="columns"
              :groupByDay="true"
              @edit="openModal"
            />
          </div>

          <div v-if="loading">Cargando configuración...</div>
          <div v-if="error">{{ error }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal for Config Edition -->
  <div class="modal fade in" style="display:block" id="modal-config" v-if="showModal">
    <div class="modal-backdrop fade in" style="height: 100vh;"></div>
    <div class="modal-dialog">
      <div class="modal-content">
        <ConfigurationEdition
          :initial="selectedItem"
          @onClose="closeModal"
          @onSubmit="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ConfigurationTable from '@/components/ConfigurationTable.vue'
import ConfigurationEdition from '@/components/ConfigurationEdition.vue'
import { saveConfiguracion, getAllConfiguraciones } from '@/services/configurationService'

const columns = [
  { key: 'day', label: 'Día' },
  { key: 'time', label: 'Horario' },
  { key: 'persons', label: 'Personas' },
  { key: 'sex', label: 'Sexo' },
  { key: 'personType', label: 'Tipo' },  
  { key: 'break', label: 'Receso' }
]

const rows = ref([])
const loading = ref(false)
const error = ref(null)

const showModal = ref(false)
const selectedItem = ref(null)

function openModal(item) {
  selectedItem.value = item
  showModal.value = true
}

function closeModal() {
  selectedItem.value = null
  showModal.value = false
}

async function handleSubmit(payload) {
  loading.value = true
  try {
    // Aquí guardas la configuración
    await saveConfiguracion(payload)
    // Actualizas la lista para mostrar lo nuevo
    const response = await getAllConfiguraciones()
    rows.value = response.data.map(c => ({
      day: mapDiaSemana(c.diaSemana),
      time: `${c.horario.inicio} - ${c.horario.fin}`,
      persons: c.cantPersonas,
      sex: mapSexo(c.sexo),
      personType: mapTipoPersona(c.tipoPersona?.nombre),
      break: c.receso ? 'Sí' : 'No'
    }))
  } catch (err) {
    error.value = 'No se pudo guardar la configuración'
    console.error(err)
  } finally {
    loading.value = false
    closeModal()
  }
}

// Nuevo mapeo para tipo y sexo legible
function mapDiaSemana(num) {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  return dias[num % 7] || 'Desconocido'
}

function mapSexo(sexo) {
  if (!sexo) return 'Ambos'
  if (sexo === 'M' || sexo === 'Masculino') return 'Masculino'
  if (sexo === 'F' || sexo === 'Femenino') return 'Femenino'
  return sexo
}

function mapTipoPersona(nombreTipo) {
  if (!nombreTipo) return 'Ambos'  // Si es null, undefined o vacío, mostrar "Ambos"
  // Puedes personalizar según tus valores reales de backend aquí:
  return nombreTipo
}

// Nuevo onMounted con mapeo limpio
onMounted(async () => {
  loading.value = true
  try {
    const response = await getAllConfiguraciones()
    rows.value = response.data.map(c => ({
      day: mapDiaSemana(c.diaSemana),
      time: `${c.horario.inicio} - ${c.horario.fin}`,
      persons: c.cantPersonas,
      sex: mapSexo(c.sexo),
      personType: mapTipoPersona(c.tipoPersona?.nombre),
      break: c.receso ? 'Sí' : 'No'
    }))
  } catch (err) {
    error.value = 'No se pudo cargar la configuración'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>