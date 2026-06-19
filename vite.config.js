import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@trustgate/kernel'],
  },
  build: {
    commonjsOptions: {
      include: [/@trustgate\/kernel/, /node_modules/],
    },
  },
});
