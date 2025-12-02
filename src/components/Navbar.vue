<template>
<ul id="main-menu" class="main-menu">
  <li>
    <router-link to="/">
      <i class="fa fa-home"></i>
      <span class="title">Inicio</span>
    </router-link>
  </li>
  <li>
    <router-link to="/roles">
      <i class="fa fa-gears"></i>
      <span class="title">Roles</span>
    </router-link>
  </li>
  <li>
    <router-link to="/workers">
      <i class="fa fa-briefcase"></i>
      <span class="title">Trabajadores</span>
    </router-link>
  </li>
  <li>
    <router-link to="/students">
      <i class="fa fa-graduation-cap"></i>
      <span class="title">Estudiantes</span>
    </router-link>
  </li>
  <li>
    <router-link to="/planif">
      <i class="fa fa-calendar"></i>
      <span class="title">Planificaciones</span>
    </router-link>
  </li>
  <li>
    <router-link to="/assistance">
      <i class="fa fa-check"></i>
      <span class="title">Asistencia</span>
    </router-link>
  </li>
    <li>
    <router-link to="/users">
      <i class="fa fa-users"></i>
      <span class="title">Usuarios</span>
    </router-link>
  </li>
   <li>
    <router-link to="/configuration">
      <i class="fa fa-cog"></i>
      <span class="title">Configuración</span>
    </router-link>
   </li>
</ul>
</template>

