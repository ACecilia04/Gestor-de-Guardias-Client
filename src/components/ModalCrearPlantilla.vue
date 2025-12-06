<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="modal-title" class="modal-title">Crear nueva plantilla</h5>
          <button type="button" class="btn-close" aria-label="Cerrar" @click="close">×</button>
        </div>

        <div class="modal-body">
          <div class="d-grid gap-2">
            <button
              class="btn btn-primary mono"
              :disabled="loading"
              @click="crear(true)"
            >
              Crear desde hoy
              <span v-if="loading && mode === 'today'" class="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
            </button>

            <button
              class="btn btn-secondary mono-outline"
              :disabled="loading"
              @click="crear(false)"
            >
              Crear a partir del próximo mes
              <span v-if="loading && mode === 'nextMonth'" class="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
            </button>
          </div>

          <div v-if="error" class="mt-3 text-danger small mono-error">
            {{ error }}
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-link mono-link" @click="close" :disabled="loading">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { crearPlantilla } from '@/services/plantillaService'

const emit = defineEmits(['close', 'created'])

const loading = ref(false)
const mode = ref(null) // 'today' | 'nextMonth'
const error = ref(null)

const close = () => {
  if (loading.value) return
  error.value = null
  emit('close')
}

const crear = async (empezarHoy) => {
  if (loading.value) return
  error.value = null
  loading.value = true
  mode.value = empezarHoy ? 'today' : 'nextMonth'
  try {
    const resp = await crearPlantilla(empezarHoy)
    emit('created', resp.data)
    // parent will usually close modal on created
  } catch (err) {
    console.error('Error creando plantilla:', err)
    error.value = 'No se pudo crear la plantilla. Intenta de nuevo.'
  } finally {
    loading.value = false
    mode.value = null
  }
}
</script>

<style scoped>
/* Backdrop and dialog */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}
.modal-dialog {
  width: 420px;
  max-width: 95%;
}
.modal-content {
  background: #fff; /* blanco */
  color: #000; /* texto negro */
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
.modal-header, .modal-footer {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eee;
}
.modal-body {
  padding: 1rem;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-title {
  margin: 0;
  font-size: 1.05rem;
  color: #000;
}

/* Close button: simple black X */
.btn-close {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  color: #000;
}

/* MONOCHROME (blanco y negro) button styles */
.btn.mono {
  background-color: #000; /* negro */
  color: #fff; /* texto blanco */
  border: 1px solid #000;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  transition: background 0.12s ease;
}
.btn.mono:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn.mono:hover:not(:disabled) {
  background-color: #111;
}

/* Outline/inverse style: blanco con borde negro */
.btn.mono-outline {
  background-color: #fff; /* blanco */
  color: #000;
  border: 1px solid #000;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
}
.btn.mono-outline:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn.mono-outline:hover:not(:disabled) {
  background-color: #f3f3f3;
}

/* Link style in black */
.mono-link {
  color: #000;
}

/* Error text in black/gray but still stands out */
.mono-error {
  color: #000;
  opacity: 0.85;
}

/* Spinner: force monochrome color */
.spinner-border {
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  border-width: .18em;
  color: #000; /* use currentColor for monochrome spinner */
}
/* For browsers where spinner uses border-color, force it */
.spinner-border::after {
  border-color: #000 transparent #000 transparent;
}

/* Small layout niceties */
.d-grid.gap-2 {
  display: grid;
  gap: 0.5rem;
}
</style>