import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  // Serving from a custom domain (erp.adoracoatings.com) now, which sits at
  // the domain root -- not from a github.io/<repo> subpath anymore.
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
