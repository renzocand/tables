import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// HashRouter en vez de BrowserRouter para que funcione sin configurar
// redirecciones del lado del server (ej. GitHub Pages no soporta
// fallback a index.html en rutas desconocidas).
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
