import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    proxy: {
      '/guardia-api': {
        target: 'http://localhost:9091',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
