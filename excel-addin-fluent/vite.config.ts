import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { homedir } from 'os'
import { readFileSync } from 'node:fs'

// Resolve the home directory path
const certPath = resolve(homedir(), '.office-addin-dev-certs')

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
      key: readFileSync(resolve(certPath, 'localhost.key')),
      cert: readFileSync(resolve(certPath, 'localhost.crt'))
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  base: process.env.NODE_ENV === 'production' 
    ? 'https://api.contractsmarts.ai/static/d/'
    : '/',
})
