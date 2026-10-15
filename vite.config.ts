import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Served from https://<user>.github.io/Japanese-Practice-Anywhere/
export default defineConfig({ base: '/Japanese-Practice-Anywhere/', plugins: [react(), tailwindcss()] })
