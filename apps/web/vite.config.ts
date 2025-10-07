// apps/web/vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Vẫn giữ lại path cho alias

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // XÓA PHẦN 'css: { postcss: {...} }'
  // VITE SẼ TỰ ĐỘNG TÌM file postcss.config.cjs

  resolve: {
    alias: {
      'core': path.resolve(__dirname, '../../packages/core/src'), 
    },
  },

  server: {
    watch: {
      ignored: ['!**/node_modules/'],
    },
  },
});