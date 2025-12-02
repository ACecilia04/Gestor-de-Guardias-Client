<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h3 class="panel-title">Planificación</h3>
      <div class="panel-options">
        <!-- Botón Exportar PDF -->
        <a href="#" @click.prevent="exportToPdf" title="Exportar PDF">
          <i class="fa fa-file-pdf-o"></i>
        </a>
      </div>
    </div>

    <div class="panel-body">
      <table class="table table-bordered table-striped text-center align-middle">
        <thead>
          <tr class="bg-primary text-white">
            <th>Día</th>
            <th>Horario</th>
            <th>Carnet</th>
            <th>Apellidos</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="g in guardias" :key="g.id">
            <td>{{ g.dia }}</td>
            <td>{{ g.horario }}</td>
            <td>{{ g.carnet }}</td>
            <td>{{ g.apellidos }}</td>
            <td>{{ g.nombre }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
// import { getPlanificacionPdf } from '@/services/exportService' // TODO: integrar servicio API
import { ref } from 'vue'

const guardias = ref([
  {
    id: 1,
    dia: '23 Lunes',
    horario: '20:00 - 08:00',
    carnet: '01011186884',
    apellidos: 'Banegas Andrade',
    nombre: 'Marlon Roberto',
  },
  {
    id: 2,
    dia: '24 Martes',
    horario: '20:00 - 08:00',
    carnet: '01100144547',
    apellidos: 'Blakman Briones',
    nombre: 'Teodoro Ivan',
  },
])

function exportToPdf() {
  // TODO: conectar con API o fallback de frontend
  // Ejemplo futuro:
  // const blob = await getPlanificacionPdf({ /* filtros */ })
  // downloadBlob(blob, 'planificacion.pdf')
  console.log('[Export] Planificación -> PDF (pendiente de servicio)')
}
</script>

<style scoped>
.panel-heading {
  color: #fff;
}
.table th {
  background-color: #fff !important;
  color: #000 !important;
  font-weight: 600;
}
.table-striped > tbody > tr:nth-of-type(odd) {
  background-color: #f8f9fc;
}
.table-hover tbody tr:hover {
  background-color: #e6f0ff;
}
.panel {
  transition: all 0.3s ease;
}
.panel:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 14px rgba(0, 90, 170, 0.25);
}
</style>