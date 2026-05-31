import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// Importa el plugin condicionalmente para que no explote si no se necesita
const electron = process.env.VERCEL ? null : require('vite-plugin-electron/simple')

export default defineConfig({
  plugins: [
    vue(),
    // Solo añadimos el plugin de electron si NO estamos en Vercel
    !process.env.VERCEL && electron({
      main: { entry: 'electron/main.js' },
    })
  ].filter(Boolean), // Esto elimina los "null" si estamos en Vercel

  // Añade esto para evitar errores de compilación web
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})