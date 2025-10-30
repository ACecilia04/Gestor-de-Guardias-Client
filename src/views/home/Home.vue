<template>
  <div class="page-container"><!-- add class "sidebar-collapsed" to close sidebar by default, "chat-visible" to make chat appear always -->
  
    <!-- Add "fixed" class to make the sidebar fixed always to the browser viewport. -->
    <!-- Adding class "toggle-others" will keep only one menu item open at a time. -->
    <!-- Adding class "collapsed" collapse sidebar root elements and show only icons. -->
      <div class="sidebar-menu toggle-others fixed">
      <div class="sidebar-menu-inner">
        <header class="logo-env">
          <!-- logo -->
          <div class="logo">
            <a href="/" class="router-link-active router-link-exact-active" aria-current="page" style="display: flex; align-items: center;">
              <img src="@/assets/images/logo.png" width="30" alt="">
              <span style="color: white; font-size: 18px; margin-left: 10px;">Gestor de guardias</span>
            </a>
          </div>

          <!-- This will toggle the mobile menu and will be visible only on mobile devices -->
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

    <div class="main-content">
			<nav class="navbar user-info-navbar"  role="navigation"><!-- User Info, Notifications and Menu Bar -->
				<!-- Left links for user info navbar -->
				<ul class="user-info-menu left-links list-inline list-unstyled">
					<li class="hidden-sm hidden-xs" style="min-height: 76px;">
						<a href="#" data-toggle="sidebar">
							<i class="fa-bars"></i>
						</a>
					</li>
				</ul>
			
				<!-- Right links for user info navbar -->
				<ul class="user-info-menu right-links list-inline list-unstyled">
							<li class="search-form"><!-- You can add "always-visible" to show make the search input visible -->
			
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
								Pepe Grillo
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

      <div style="min-height: calc(100vh - 179px);">
        <router-view /> <!-- Aquí se renderizan los .vue hijos-->
      </div>

			<!-- Main Footer -->
			<!-- Choose between footer styles: "footer-type-1" or "footer-type-2" -->
			<!-- Add class "sticky" to  always stick the footer to the end of page (if page contents is small) -->
			<!-- Or class "fixed" to  always fix the footer to the end of page -->
			<footer class="main-footer sticky footer-type-1">
				
				<div class="footer-inner">
				
					<!-- Add your copyright text here -->
					<div class="footer-text">
						&copy; 2025 
						<strong>Gestor de guardias</strong> 
					</div>
					
					
					<!-- Go to Top Link, just add rel="go-top" to any link to add this functionality -->
					<div class="go-up">
					
						<a href="#" rel="go-top">
							<i class="fa-angle-up"></i>
						</a>
						
					</div>
					
				</div>
				
			</footer>

    </div>
  </div>

    <!-- Page Loading Overlay -->
  <!-- <div class="page-loading-overlay">
    <div class="loader-2"></div>
  </div> -->
</template>

<script setup>
  import Navbar from '@/components/Navbar.vue'
  import { useRouter } from 'vue-router'
  import { logout } from '@/services/authenticationService'

  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      router.push('/login')
    }
  }
</script>