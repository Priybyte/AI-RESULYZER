import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  // Vite only exposes VITE_* values from this application directory.
  envDir: path.resolve(__dirname),
  plugins: [react()],
})
