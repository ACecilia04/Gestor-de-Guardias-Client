<template>
  <div class="container mt-4">
    <h3 class="fw-bold mb-4">Asistencias</h3>

    <div class="row">
      <div
        v-for="plan in planificaciones"
        :key="plan.id"
        class="col-sm-6 col-md-4"
      >
        <div
          class="panel panel-default panel-border"
          style="cursor: pointer;"
          @click="verDetalle(plan.fechaInicio)"

        >
          <div class="panel-body text-center">
            <div class="xe-widget xe-counter-block " style="background-color: #12355B !important;">
              <div class="xe-upper" style="background-color: #0066CC !important;">
                <h4 class="fw-bold text-dark mb-2">{{ plan.nombre }}</h4>
              </div>
              <div class="xe-lower">
                <span class="text-muted">Inicio: {{ plan.fechaInicio }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPrimerasFechasPorActualizarAsistencia } from '@/services/assistanceService'

const planificaciones = ref([])
const router = useRouter()

const verDetalle = (fecha) => {
  router.push(`/assistance/list/${fecha}`)
}

onMounted(async () => {
  try {
    const response = await getPrimerasFechasPorActualizarAsistencia()
    const fechas = response.data
    planificaciones.value = fechas.map(fechaStr => {
      const fecha = new Date(fechaStr)
      return {
        id: fechaStr,
        nombre: fecha.toLocaleString('default', { month: 'long', year: 'numeric' }),
        fechaInicio: fechaStr
      }
    })
  } catch (error) {
    console.error('Error loading asistencias:', error)
  }
})
</script>


<style scoped>
.panel {
  transition: all 0.3s ease;
}
.panel:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
}
</style>
