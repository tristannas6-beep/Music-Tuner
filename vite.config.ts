import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/icon.png', 'assets/splash.png'],
      manifest: {
        name: 'Modern Music Tuner',
        short_name: 'Tuner',
        description: 'A professional, minimalist music tuner for instruments.',
        theme_color: '#121212',
        background_color: '#121212',
        display: 'standalone',
        icons: [
          {
            src: 'assets/icon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'assets/icon.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'assets/icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});
