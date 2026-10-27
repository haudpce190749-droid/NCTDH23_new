import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all local IP addresses (0.0.0.0) for local Wi-Fi testing
    port: 3000,
    proxy: {
    '/api': {
      target: 'https://nctdh23-backend.onrender.com',
      changeOrigin: true,
      secure: false
    },
    '/uploads': {
      target: 'https://nctdh23-backend.onrender.com',
      changeOrigin: true,
      secure: false
    },
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
