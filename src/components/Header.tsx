export default function Header() {
  return (
    <header className="bg-white border-b-4 border-blue-600 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 md:py-6">
        <div className="flex justify-between items-center gap-8 md:gap-12">
          <div className="flex-1 flex justify-center h-20 md:h-24">
            <img src="/logos/balore-logo.png" alt="Balore" className="h-full object-contain" />
          </div>
          <div className="flex-1 flex justify-center h-20 md:h-24">
            <img src="/logos/pelsa-logo.jpeg" alt="PELSA" className="h-full object-contain" />
          </div>
          <div className="flex-1 flex justify-center h-20 md:h-24">
            <img src="/logos/eternity-logo.png" alt="Eternity" className="h-full object-contain" />
          </div>
        </div>
      </div>
    </header>
  );
}
