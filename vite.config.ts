import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/raul-logistica/',  // ← Nome repo
  plugins: [react()],
})
