import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/Nagercoil_pencil_sharp.png', '**/2.png']
    }
  },
  build: {
    // Production optimizations
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunk — React + Router (rarely changes, cached aggressively)
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) {
            return 'vendor';
          }
          // Convex chunk — DB client (separate caching)
          if (id.includes('node_modules/convex')) {
            return 'convex';
          }
          // Icons chunk
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
        }
      }
    },
    // Asset size warnings
    chunkSizeWarningLimit: 500,
    // Source maps for debugging (disable in production deploy)
    sourcemap: false
  }
})
