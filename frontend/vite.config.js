import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',  // Auto-updates service worker
      devOptions: {
        enabled: true,  // Enable PWA in development mode
      },
      manifest: {
        name: 'CostumeApp',
        short_name: 'CostumeApp',
        start_url: "/",
        description: 'A React PWA built with Vite',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192x192.webp',
            sizes: '192x192',
            type: 'image/webp',
          },
          {
            src: '/icon-512x512.webp',
            sizes: '512x512',
            type: 'image/webp',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg}'], // Cache assets
      },
    }),

  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

})
