import React from 'react'
import { Link } from 'react-router-dom'

// Tarjeta tipo modulo ERP — se usa en el home para cada libreria.
// Al hacer clic navega a la ruta indicada.
export default function ModuleCard({ to, title, subtitle, tagline, badges, accent, icon }) {
  return (
    <Link to={to} className="module-card" style={{ '--accent': accent }}>
      <div className="module-card-icon">{icon}</div>
      <div className="module-card-body">
        <div className="module-card-subtitle">{subtitle}</div>
        <div className="module-card-title">{title}</div>
        <div className="module-card-tagline">{tagline}</div>
        <div className="module-card-badges">
          {badges?.map(b => (
            <span key={b} className="module-card-badge">{b}</span>
          ))}
        </div>
      </div>
      <div className="module-card-cta">Abrir modulo →</div>
    </Link>
  )
}
