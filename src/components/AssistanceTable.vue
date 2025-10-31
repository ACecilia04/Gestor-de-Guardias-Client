<template>
  <div class="panel panel-default shadow-sm rounded">
    <div class="panel-heading bg-primary text-white p-3 rounded-top">
      <h3 class="panel-title mb-0 fw-semibold">Asistencias</h3>
    </div>

    <div class="panel-body p-3 bg-light rounded-bottom">
      <table class="table table-bordered table-striped text-center align-middle">
        <thead>
          <tr class="bg-white text-dark">
            <th>Día</th>
            <th>Horario</th>
            <th>Carnet</th>
            <th>Apellidos</th>
            <th>Nombre</th>
            <th>Asistencia</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="g in guardias" :key="g.id" class="align-middle">
            <td>{{ g.dia }}</td>
            <td>{{ g.horario }}</td>
            <td>{{ g.carnet }}</td>
            <td>{{ g.apellidos }}</td>
            <td>{{ g.nombre }}</td>
            <td>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  :name="'asistencia-' + g.id"
                  value="cumplido"
                  v-model="g.asistencia"
                />
                <label class="form-check-label">Cumplido</label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  :name="'asistencia-' + g.id"
                  value="incumplido"
                  v-model="g.asistencia"
                />
                <label class="form-check-label">Incumplido</label>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const guardias = ref([
  { id: 1, dia: '2 Miércoles', horario: '20:00 - 08:00', carnet: '01100144547', apellidos: 'Blakman Briones', nombre: 'Teodoro Ivan', asistencia: null },
  { id: 2, dia: '3 Jueves', horario: '20:00 - 08:00', carnet: '05111090166', apellidos: 'De Sousa Diaz', nombre: 'Luis Gabriel', asistencia: null },
  { id: 3, dia: '4 Viernes', horario: '08:00 - 20:00', carnet: '04022578253', apellidos: 'Aguilera Garcia', nombre: 'Amanda Cecilia', asistencia: null },
])
</script>
