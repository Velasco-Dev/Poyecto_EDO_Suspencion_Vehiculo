import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // Vital para despliegue sin problemas en GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
