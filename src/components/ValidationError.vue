<template>
  <label :for="controlId" class="error-validation-message" role="alert" aria-live="polite" v-if="visible" >
    {{ message }}
  </label>
</template>

<script setup>
import { computed, toRef } from 'vue'

const props = defineProps({
  controlId: { type: String, required: true },
  message: { type: String, required: true },
  visible: { type: [Boolean, String], default: true } // permite controlar visibilidad desde el padre
})

// normalizar visible si viene como string (p.e. v-bind:visible="'true'")
const visibleRef = toRef(props, 'visible')
const visible = computed(() => {
  if (typeof visibleRef.value === 'string') {
    return visibleRef.value === 'true'
  }
  return !!visibleRef.value
})
</script>

<style scoped>
.error-validation-message {
  display: inline-block;
  margin-top: 0.25rem;
  color: #d9534f;
  font-size: 0.875rem;
}
</style>
