<template>
  <div class="container mt-4">
    <h3 class="fw-bold mb-4">Planificaciones</h3>

    <div class="row">
      <!-- Card "Crear nueva plantilla" - idéntico estilo a las demás tarjetas -->
      <div class="col-sm-6 col-md-4">
        <div
          class="panel panel-default panel-border"
          style="cursor: pointer;"
          @click="openCrearModal"
        >
          <div class="panel-body text-center">
            <div class="xe-widget xe-counter-block " style="background-color: #12355B !important;">
              <div class="xe-upper" style="background-color: #0066CC !important;">
                <h4 class="fw-bold text-dark mb-2">Crear nueva plantilla</h4>
              </div>
              <div class="xe-lower">
                <span class="text-muted">Haz clic para opciones</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tarjetas existentes (map de planificaciones) -->
      <div
        v-for="plan in planificaciones"
        :key="plan.id"
        class="col-sm-6 col-md-4"
      >
        <div
          class="panel panel-default panel-border"
          style="cursor: pointer;"
          @click="verDetalle(plan.id)"
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

    </div> <!-- row -->

    <!-- Modal component: aparece cuando showCrearModal es true -->
    <ModalCrearPlantilla
      v-if="showCrearModal"
      @close="showCrearModal = false"
      @created="handleCreated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPrimerasFechasPorMes } from '@/services/planificationService'
import ModalCrearPlantilla from '@/components/ModalCrearPlantilla.vue'
import { crearPlantilla } from '@/services/plantillaService' // opcional, no usado aquí

const planificaciones = ref([])
const router = useRouter()

const showCrearModal = ref(false)

const verDetalle = (id) => {
  router.push(`/planif/${id}`)
}

const openCrearModal = () => {
  showCrearModal.value = true
}

const handleCreated = (dias) => {
  // El modal emitió la plantilla creada; cerramos el modal y navegamos al detalle
  showCrearModal.value = false
  if (Array.isArray(dias) && dias.length > 0 && dias[0].fecha) {
    router.push(`/planif/${dias[0].fecha}`)
  } else {
    // Si no devuelve fechas, recargar la lista de planificaciones
    loadPlanificaciones()
  }
}

const loadPlanificaciones = async () => {
  try {
    const response = await getPrimerasFechasPorMes()
    const fechas = response.data

    planificaciones.value = fechas.map(fechaStr => {
      const fecha = new Date(fechaStr)
      return {
        id: fechaStr,
        nombre: fecha.toLocaleString('default', { month: 'long', year: 'numeric' }),
        fechaInicio: fechaStr
      }
    })
  } catch (errorLoad) {
    console.error('Error loading planificaciones:', errorLoad)
  }
}

onMounted(() => {
  loadPlanificaciones()
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