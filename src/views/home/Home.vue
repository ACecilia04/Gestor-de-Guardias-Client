<template>
  <div>
    <h1>Gestor de guardias</h1>
    <div>
      <Navbar />
    </div>
  </div>
  <div>
    <router-view /> <!-- Aquí se renderizan los .vue hijos-->
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue'
</script>
