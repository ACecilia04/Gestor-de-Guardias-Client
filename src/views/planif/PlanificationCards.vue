<template>
  <div class="container mt-4">
    <h3 class="fw-bold mb-4">Planificaciones</h3>

    <div class="row">
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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      planificaciones: [
        { id: 1, nombre: 'Junio 2025', fechaInicio: '23/06/2025' },
        { id: 2, nombre: 'Julio 2025', fechaInicio: '01/07/2025' },
        { id: 3, nombre: 'Agosto 2025', fechaInicio: '01/08/2025' },
      ],
    }
  },
  methods: {
    verDetalle(id) {
      this.$router.push(`/planif/${id}`)
    },
  },
}
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
