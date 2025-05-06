import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@pages": "/src/pages/",
      "@hooks": "/src/hooks/",
      "@assets": "/src/assets/",
      "@routes": "/src/routes/",
      "@layouts": "/src/layouts/",
      "@sections": "/src/sections/",
      "@components": "/src/components/",
      "@utils": "/src/libs/utils/",
      "@services": "/src/libs/services/",
      "@contexts": "/src/libs/contexts/",
      "@constants": "/src/libs/constants/",
    },
  },
})