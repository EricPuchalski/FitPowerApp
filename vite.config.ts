import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000, // Aumenta el límite de warning
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          vendor: ['axios', 'jwt-decode', 'date-fns']
        }
      }
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' } // Ignora más warnings
  }
})