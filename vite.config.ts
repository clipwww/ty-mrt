import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  base: '/taoyuan-mrt/',
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
