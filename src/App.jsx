import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import HomePage from './HomePage'
import TanStackPage from './tanstack/TanStackPage'
import PivotTablePage from './react-pivottable/PivotTablePage'
import './App.css'

// Shell principal: header estilo ERP, breadcrumb y enrutador.
// Cada modulo vive bajo su propia ruta:
//   /           -> home con las dos tarjetas
//   /tanstack   -> Modulo 1 (TanStack Table v8)
//   /pivottable -> Modulo 2 (react-pivottable)
export default function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div>
            <Link to="/" className="header-home-link">
              <h1>Tables Lab</h1>
            </Link>
            <div className="subtitle">
              Comparativa de librerias pivot sobre el mismo dataset de expedientes
            </div>
          </div>
          <div className="badge-stack">
            <span className="badge">React 18.3</span>
            <span className="badge">Vite</span>
            <span className="badge">open-source (MIT)</span>
          </div>
        </div>
      </header>

      {!isHome && (
        <nav className="crumbs">
          <div className="crumbs-inner">
            <Link to="/" className="crumb">← Inicio</Link>
          </div>
        </nav>
      )}

      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tanstack" element={<TanStackPage />} />
          <Route path="/pivottable" element={<PivotTablePage />} />
        </Routes>
      </main>

      <footer className="footer">
        <div>Demo preparado para presentacion interna · Todo el procesamiento ocurre en el frontend sobre datos hardcodeados.</div>
      </footer>
    </div>
  )
}
