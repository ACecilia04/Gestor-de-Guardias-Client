<template>
  <!-- Responsive Config Table -->
  <div class="row">
    <div class="col-md-12">

      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">Configuración</h3>
          <div class="panel-options">
            <a href="#" @click.prevent="openModal(null)" title="Añadir configuración">
              <i class="fa fa-file-o"></i>
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
import { ref } from 'vue'
import ConfigurationTable from '@/components/ConfigurationTable.vue'
import ConfigurationEdition from '@/components/ConfigurationEdition.vue'

// Columnas según la imagen
const columns = [
  { key: 'day', label: 'Día' },
  { key: 'time', label: 'Horario' },
  { key: 'persons', label: 'Personas' },
  { key: 'sex', label: 'Sexo' },
  { key: 'break', label: 'Receso' }
]

// Datos de ejemplo para maquetar; se reemplazarán por API
const rows = ref([
  { day: 'Lunes', time: '09:00 - 14:00', persons: 1, sex: 'Ambos', break: 'Sí' },
  { day: 'Lunes', time: '14:00 - 19:00', persons: 1, sex: 'Ambos', break: 'Sí' },
  { day: 'Lunes', time: '20:00 - 08:00', persons: 1, sex: 'Masculino', break: 'No' },
  { day: 'Martes', time: '09:00 - 14:00', persons: 1, sex: 'Ambos', break: 'Sí' },
  { day: 'Martes', time: '14:00 - 19:00', persons: 1, sex: 'Ambos', break: 'Sí' },
  { day: 'Martes', time: '20:00 - 08:00', persons: 1, sex: 'Masculino', break: 'No' },
  // ...continúa con Miércoles, Jueves, etc.
])

const loading = ref(false)
const error = ref(null)

// Modal logic (corregido: nombres coherentes con el template)
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

function handleSubmit(payload) {
  // Añade filas por cada horario
  const { day, persons, sex, break: isBreak, schedules } = payload
  // Si está editando un item, elimínalo primero
  if (selectedItem.value) {
    const idx = rows.value.findIndex(r =>
      r.day === selectedItem.value.day &&
      r.time === selectedItem.value.time &&
      r.persons === selectedItem.value.persons &&
      r.sex === selectedItem.value.sex &&
      r.break === selectedItem.value.break
    )
    if (idx !== -1) rows.value.splice(idx, 1)
  }
  // Agrega nuevas filas
  for (const s of schedules) {
    rows.value.push({
      day,
      time: `${s.start} - ${s.end}`,
      persons: Number(persons),
      sex,
      break: isBreak ? 'Sí' : 'No'
    })
  }
  closeModal()
}
</script>