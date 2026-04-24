import React from 'react'
import ModuleCard from './ModuleCard'

// Home estilo ERP — presenta las dos librerias como modulos independientes.
// Objetivo: que el usuario pueda comparar lado a lado como se ve un pivot
// hecho con TanStack Table v8 versus uno hecho con react-pivottable, usando
// exactamente la misma data de entrada.
export default function HomePage() {
  return (
    <div className="home">
      <div className="home-hero">
        <h1>Demo comparativa de librerias pivot</h1>
        <p>
          Elige un modulo para ver como cada libreria renderiza la misma data
          de expedientes. El objetivo es comparar capacidades, ergonomia
          de API y experiencia de usuario antes de decidir cual adoptar.
        </p>
      </div>

      <div className="home-grid">
        <ModuleCard
          to="/tanstack"
          subtitle="Modulo 1"
          title="TanStack Table v8"
          tagline="Headless, configurable, tu controlas el render. Vista plana, agrupada y pivot cruzada manual."
          badges={['Headless', 'MIT', 'Custom UI']}
          accent="#2563eb"
          icon="▦"
        />
        <ModuleCard
          to="/pivottable"
          subtitle="Modulo 2"
          title="react-pivottable"
          tagline="Drag & drop estilo tabla dinamica de Excel. UI lista para usar con agregaciones y renderers incluidos."
          badges={['Drag & Drop', 'MIT', 'Ready-made UI']}
          accent="#9333ea"
          icon="⚏"
        />
      </div>

      <div className="home-footer-note">
        Ambos modulos consumen el mismo dataset de 60 expedientes (ver
        <code> src/data/expedientes.js</code>). Cada modulo vive aislado en
        su propia carpeta (<code>src/tanstack/</code>,
        <code> src/react-pivottable/</code>) para que el codigo sirva de guia
        si quieres replicar solo una de las dos implementaciones.
      </div>
    </div>
  )
}
