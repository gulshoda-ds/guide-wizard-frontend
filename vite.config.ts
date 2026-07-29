import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Bolt-hosted copy: builds to a normal dist/ at the site root.
// (The repo copy next to the FastAPI backend instead uses base '/static/' and
// outDir '../src/serving/static' so the backend can serve the built SPA.)
// The dev proxy is kept so the app still works locally when the backend runs
// on :7860; on Bolt there is no backend and the app degrades gracefully.
export default defineConfig({
  base: '/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:7860', changeOrigin: true },
      '/videos': { target: 'http://localhost:7860', changeOrigin: true },
      '/auth': { target: 'http://localhost:7860', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
  },
});
