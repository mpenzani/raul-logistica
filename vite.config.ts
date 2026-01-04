import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '',  // Vazio para GH Pages root
  plugins: [react()],
})
