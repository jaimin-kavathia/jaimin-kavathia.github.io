import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'web-vitals'],
    force: true,
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      'react': 'react',
      'react-dom': 'react-dom'
    }
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion': ['framer-motion'],
          'icons': ['lucide-react'],
          'utils': ['web-vitals']
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
