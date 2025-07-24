import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'web-vitals'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separate vendor chunks for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            if (id.includes('web-vitals')) {
              return 'performance';
            }
            return 'vendor';
          }
          // Separate component chunks
          if (id.includes('src/components/sections')) {
            return 'sections';
          }
          if (id.includes('src/components/ui')) {
            return 'ui-components';
          }
        },
      },
    },
    // Optimize for production
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 500,
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  // Performance optimizations
  server: {
    hmr: {
      overlay: false,
    },
  },
  // Enable experimental features for better performance
  esbuild: {
    // Remove console.log in production
    drop: ['console', 'debugger'],
  },
}));
