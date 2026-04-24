import ModuleCard from './ModuleCard'

export default function HomePage() {
  return (
    <div className="home">
      <div className="home-hero">
        <h1>Demo comparativa de librerias pivot</h1>
        <p>
          Elige un modulo para ver como cada libreria renderiza la misma data
          de expedientes. Compara API, UI y control de render antes de decidir.
        </p>
      </div>

      <div className="home-grid">
        <ModuleCard
          to="/tanstack"
          subtitle="Modulo 1"
          title="TanStack Table v8"
          tagline="Headless. Tu controlas el render. Vista plana, agrupada y pivot cruzada manual."
          badges={['Headless', 'MIT', 'Custom UI']}
          accent="#2563eb"
          icon="▦"
        />
        <ModuleCard
          to="/pivottable"
          subtitle="Modulo 2"
          title="react-pivottable"
          tagline="Drag & drop estilo Excel. UI lista con agregadores y renderers incluidos."
          badges={['Drag & Drop', 'MIT', 'Ready-made UI']}
          accent="#9333ea"
          icon="⚏"
        />
      </div>

      <div className="home-footer-note">
        Mismo dataset en <code>src/data/expedientes.js</code>. Cada modulo vive aislado en
        su carpeta (<code>src/tanstack/</code>, <code>src/react-pivottable/</code>) por si
        quieres replicar solo uno.
      </div>
    </div>
  )
}
