import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@pages": "/src/pages/",
      "@hooks": "/src/hooks/",
      "@assets": "/src/assets/",
      "@layouts": "/src/layouts/",
      "@services": "/src/services/",
      "@constants": "/src/constants/",
      "@components": "/src/components/"
    },
  },
})