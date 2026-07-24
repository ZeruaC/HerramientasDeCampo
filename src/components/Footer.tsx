export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-6 md:py-8 border-t border-slate-800 mt-8 md:mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6">
          <div>
            <p className="text-sm md:text-base font-semibold text-slate-300 mb-2">Herramientas de Campo</p>
            <p className="text-xs md:text-sm text-slate-500">Argumentario comercial y técnico para profesionales Eternity.</p>
          </div>
          <div>
            <p className="text-sm md:text-base font-semibold text-slate-300 mb-2">Versión</p>
            <p className="text-xs md:text-sm text-slate-500">v4.0 · 2026-07-23</p>
          </div>
          <div>
            <p className="text-sm md:text-base font-semibold text-slate-300 mb-2">Material</p>
            <p className="text-xs md:text-sm text-slate-500">Formación interna Balore Engineering</p>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-4 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-center md:text-left">
          <p className="text-xs md:text-sm text-slate-500 order-2 md:order-1">
            © 2026 Balore Engineering. Todos los derechos reservados.
          </p>
          <p className="text-xs md:text-sm text-slate-500 order-1 md:order-2">
            Powered by Eternity Technologies
          </p>
        </div>
      </div>
    </footer>
  );
}
