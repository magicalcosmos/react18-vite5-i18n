import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import AutoImport from 'unplugin-auto-import/vite';
import postcsspxtoviewport8plugin from 'postcss-px-to-viewport-8-plugin';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    AutoImport({
      imports: [
        'react',
        'react-router-dom',
        'react-i18next' // Add this to auto-import react-i18next functions
      ]
    })
  ],
  css: {
    postcss: {
      plugins: [postcsspxtoviewport8plugin()],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  }
});
