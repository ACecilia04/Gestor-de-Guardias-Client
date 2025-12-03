<script setup>
import { useRoute } from 'vue-router'
import AssistanceTable from '@/components/AssistanceTable.vue'

const route = useRoute()
const fecha = route.params.fecha
</script>

<template>
  <AssistanceTable :fecha="fecha" />
</template>
