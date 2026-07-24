export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex justify-around md:justify-between items-center gap-3 md:gap-6">
          <img src="/logos/balore-logo.png" alt="Balore" className="h-8 md:h-10 object-contain" />
          <img src="/logos/pelsa-logo.jpeg" alt="PELSA" className="h-8 md:h-10 object-contain" />
          <img src="/logos/eternity-logo.png" alt="Eternity" className="h-8 md:h-10 object-contain" />
        </div>
      </div>
    </header>
  );
}
