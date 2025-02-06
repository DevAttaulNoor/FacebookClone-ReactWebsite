import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@pages": "/src/pages/",
      "@hooks": "/src/hooks/",
      "@assets": "/src/assets/",
      "@layouts": "/src/layouts/",
      "@constants": "/src/constants/",
      "@components": "/src/components/"
    },
  },
})
