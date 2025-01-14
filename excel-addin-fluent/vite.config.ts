import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        taskpane: resolve(__dirname, 'src/taskpane/taskpane.html'),
      },
    },
  },
  server: {
    port: 3000,
    https: {
      key:  fs.readFileSync("./.office-addin-dev-certs/localhost.key"),
      cert: fs.readFileSync("./.office-addin-dev-certs/localhost.crt")
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  base: process.env.NODE_ENV === 'production' 
    ? 'https://api.contractsmarts.ai/static/d/'
    : '/',
})
