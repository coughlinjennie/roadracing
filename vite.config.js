import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/roadracing/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        c25k: resolve(__dirname, 'c25k/index.html'),
        corrals: resolve(__dirname, 'corrals/index.html'),
        paces: resolve(__dirname, 'paces/index.html'),
        details: resolve(__dirname, 'details/index.html'),
      },
    },
  },
})

