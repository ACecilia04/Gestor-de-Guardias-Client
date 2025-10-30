<template>
  <label :for="for" class="error" role="alert" aria-live="polite" v-if="visible">
    {{ message }}
  </label>
</template>

<script setup>
  const props = defineProps({
    for: { type: String, required: true },
    message: { type: String, required: true },
    visible: { type: [Boolean, String], default: false } // permite controlar visibilidad desde el padre
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
