import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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