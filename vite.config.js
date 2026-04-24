import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cuando corremos en GitHub Actions, el deploy va a usuario.github.io/<repo>/
// asi que base tiene que ser "/<repo>/". En local queda "/" normal.
const repo = process.env.GITHUB_REPOSITORY
const base = repo ? `/${repo.split('/')[1]}/` : '/'

// dedupe evita que Vite cargue dos copias de la misma libreria cuando una
// dependencia transitiva la arrastra aparte. Sin esto, el pre-bundler
// puede meter dos Reacts y truena con "Invalid hook call".
export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom']
  },
  server: {
    port: 5173,
    strictPort: true,
    open: true
  }
})
