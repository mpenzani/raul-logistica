import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '',  // Vazio - sem /raul-logistica/
  plugins: [react()],
})
