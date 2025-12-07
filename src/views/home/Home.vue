<template>
  <div class="page-container">
    <!-- Sidebar -->
    <div class="sidebar-menu toggle-others fixed">
      <div class="sidebar-menu-inner">
        <header class="logo-env">
          <div class="logo">
            <router-link to="/" style="display: flex; align-items: center;">
              <img src="@/assets/images/logo.png" width="30" alt="Logo" />
              <span style="color: white; font-size: 18px; margin-left: 10px;">Gestor de guardias</span>
            </router-link>
          </div>

          <div class="mobile-menu-toggle visible-xs">
            <a href="#" data-toggle="user-info-menu">
              <i class="fa-bell-o"></i>
              <span class="badge badge-success">7</span>
            </a>
            <a href="#" data-toggle="mobile-menu">
              <i class="fa-bars"></i>
            </a>
          </div>
        </header>

        <Navbar />
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Top Navbar -->
      <nav class="navbar user-info-navbar" role="navigation">
        <ul class="user-info-menu left-links list-inline list-unstyled">
          <li class="hidden-sm hidden-xs" style="min-height: 76px;">
            <a href="#" data-toggle="sidebar">
              <i class="fa-bars"></i>
            </a>
          </li>
        </ul>

        <ul class="user-info-menu right-links list-inline list-unstyled">
          <li class="search-form">
            <form name="userinfo_search_form" method="get" action="extra-search.html">
              <input type="text" name="s" class="form-control search-field" placeholder="Buscar..." />
              <button type="submit" class="btn btn-link">
                <i class="linecons-search"></i>
              </button>
            </form>
          </li>

          <li class="dropdown user-profile">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
              <img src="@/assets/images/user-4.png" alt="user-image" class="img-circle img-inline userpic-32" width="28" />
              <span>
                {{ username || 'Usuario' }}
                <i class="fa-angle-down"></i>
              </span>
            </a>

            <ul class="dropdown-menu user-profile-menu list-unstyled">
              <li>
                <a href="#">
                  <i class="fa-user"></i>
                  Mi perfil
                </a>
              </li>
              <li>
                <a href="#">
                  <i class="fa-info"></i>
                  Ayuda
                </a>
              </li>
              <li class="last">
                <router-link to="/" @click.prevent="handleLogout">
                  <i class="fa-lock"></i>
                  <span class="title">Cerrar sesión</span>
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <!-- Routed Views -->
      <div style="min-height: calc(100vh - 179px);">
        <router-view />
      </div>

      <!-- Footer -->
      <footer class="main-footer sticky footer-type-1">
        <div class="footer-inner">
          <div class="footer-text">
            &copy; 2025 <strong>Gestor de guardias</strong>
          </div>
          <div class="go-up">
            <a href="#" rel="go-top">
              <i class="fa-angle-up"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/authStore'

const router = useRouter()
const { logout, username } = useAuth()

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>