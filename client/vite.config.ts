import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      "public": fileURLToPath(new URL('./public', import.meta.url))
    }
  },
  server: {
    // port: 3001,
    proxy: {
      "/api": {
        target: "http://localhost:3200/",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    }
  },

})
