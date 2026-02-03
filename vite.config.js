import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,      // This forces the port to 3000
    strictPort: true, // If 3000 is taken, it will show an error instead of switching
  },
})