import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/datajp/' : '/',
  server: {
    port: 3000,
    open: false,
    host: true
  }
}))
