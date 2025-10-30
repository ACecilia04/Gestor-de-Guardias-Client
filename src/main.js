// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Estilos locales (procesados por Vite). Usar alias @ para /src
import './assets/css/fonts/linecons/css/linecons.css'
import './assets/css/fonts/fontawesome/css/font-awesome.min.css'
import './assets/css/bootstrap.css'
import './assets/css/xenon-core.css'
import './assets/css/xenon-forms.css'
import './assets/css/xenon-components.css'
import './assets/css/xenon-skins.css'
import './assets/css/custom.css'

// Cargar Google Fonts dinámicamente (mejor que intentar importarlo como módulo)
const loadGoogleFont = () => {
  const href = 'https://fonts.googleapis.com/css?family=Arimo:400,700,400italic'
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
  }
}

// Cargar script legacy de jQuery que está en src/assets/js
// Usamos new URL(...) para obtener la URL correcta con Vite
const loadLegacyScript = (relativePath) => {
  return new Promise((resolve, reject) => {
    const scriptSrc = new URL(relativePath, import.meta.url).href
    if (document.querySelector(`script[src="${scriptSrc}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = scriptSrc
    script.async = false
    script.onload = () => resolve()
    script.onerror = (e) => reject(e)
    document.body.appendChild(script)
  })
}

async function bootstrap() {
  loadGoogleFont()

  // Ruta relativa desde este archivo: './assets/js/jquery-1.11.1.min.js'
  try {
    await loadLegacyScript('./assets/js/jquery-1.11.1.min.js')

    // Si el plugin espera jQuery en window, exponelo
    if (window.jQuery) {
      window.$ = window.jQuery
    }

    // Ahora montar la app
    createApp(App).use(router).mount('#app')
  } catch (err) {
    // En caso de fallo en la carga de jQuery, igual intentar montar y loguear el error
    // (si tus plugins dependen estrictamente de jQuery, es mejor detenerse)
    console.error('Error cargando scripts legacy:', err)
    const app = createApp(App)
    app.use(router).mount('#app')
  }
}

bootstrap()