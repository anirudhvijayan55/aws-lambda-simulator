import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative asset paths so the build works under GitHub Pages' /<repo>/ subpath
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
})
