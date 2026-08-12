import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/campus-guard/', // e.g., if repo URL is github.com/user/my-app, use '/my-app/'
})