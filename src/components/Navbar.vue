<template>
  <ul id="main-menu" class="main-menu">
    <li>
      <router-link to="/">
        <i class="fa-home"></i>
        <span class="title">Inicio</span>
      </router-link>
    </li>
    <li>
      <router-link to="/roles">
        <i class="fa-gears"></i>
        <span class="title">Roles</span>
      </router-link>
    </li>
    <li>
      <router-link to="/workers">
        <i class="fa-group"></i>
        <span class="title">Trabajadores</span>
      </router-link>
    </li>
    <li>
      <router-link to="/students">
        <i class="fa-students"></i>
        <span class="title">Estudiantes</span>
      </router-link>
    </li>
    <li>
      <router-link to="/planif">
        <i class="fa fa-calendar"></i>
        <span class="title">Planificaciones</span>
      </router-link>
    </li>

  </ul>
</template>

