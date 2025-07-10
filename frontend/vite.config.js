import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  
  // Добавляем эти настройки
  
  resolve: {
    alias: {
      '@css': path.resolve(__dirname, './frontend/css') // Алиас для папки с CSS
    }
  },
  
  
  server: {
    fs: {
      allow: ['..'] // Разрешаем доступ к родительским директориям
    }
  },
  
  /*
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@css/variables.scss";` // Глобальные SCSS переменные (если нужны)
      }
    }
  }
    */
})