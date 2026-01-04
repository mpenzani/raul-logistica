import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',  // Fix GH Pages repo root - TESTADO
  plugins: [react()],
})
