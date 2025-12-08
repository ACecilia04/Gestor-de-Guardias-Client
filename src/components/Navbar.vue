<template>
  <ul id="main-menu" class="main-menu">
    <li>
      <router-link to="/" title="Inicio">
        <i class="fa fa-home"></i>
        <span class="title">Inicio</span>
      </router-link>
    </li>
    <li v-if="puedeVer('roles')">
      <router-link to="/roles" title="Roles">
        <i class="fa fa-gears"></i>
        <span class="title">Roles</span>
      </router-link>
    </li>
    <li v-if="puedeVer('workers')">
      <router-link to="/workers" title="Trabajadores">
        <i class="fa fa-briefcase"></i>
        <span class="title">Trabajadores</span>
      </router-link>
    </li>
    <li v-if="puedeVer('students')">
      <router-link to="/students" title="Estudiantes">
        <i class="fa fa-graduation-cap"></i>
        <span class="title">Estudiantes</span>
      </router-link>
    </li>
    <li v-if="puedeVer('planif')">
      <router-link to="/planif" title="Planificaciones">
        <i class="fa fa-calendar"></i>
        <span class="title">Planificaciones</span>
      </router-link>
    </li>
    <li v-if="puedeVer('assistance')">
      <router-link to="/assistance" title="Asistencia">
        <i class="fa fa-check"></i>
        <span class="title">Asistencia</span>
      </router-link>
    </li>
    <li v-if="puedeVer('users')">
      <router-link to="/users" title="Usuarios">
        <i class="fa fa-users"></i>
        <span class="title">Usuarios</span>
      </router-link>
    </li>
    <li v-if="puedeVer('configuration')">
      <router-link to="/configuration" title="Configuración">
        <i class="fa fa-cog"></i>
        <span class="title">Configuración</span>
      </router-link>
    </li>
    <li v-if="puedeVer('plantilla')">
      <router-link to="/plantilla" title="Nueva planificación">
        <i class="fa fa-calendar"></i>
        <span class="title">Nueva planificación</span>
      </router-link>
    </li>
  </ul>
</template>

<script setup>
import { useAuth } from '@/stores/authStore'
import { puedeVer as rawPuedeVer } from '@/auth/permissions'

const { rol } = useAuth()

const puedeVer = (clave) => {
  return rawPuedeVer(rol.value, clave)
}
</script>