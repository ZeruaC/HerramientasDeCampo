export default function Header() {
  return (
    <header className="bg-white border-b-4 border-blue-600 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-5">
        <div className="flex justify-between items-center gap-6 md:gap-8">
          <div className="flex-1 flex justify-center">
            <img src="/logos/balore-logo.png" alt="Balore" className="h-12 md:h-16 object-contain" />
          </div>
          <div className="flex-1 flex justify-center">
            <img src="/logos/pelsa-logo.jpeg" alt="PELSA" className="h-12 md:h-16 object-contain" />
          </div>
          <div className="flex-1 flex justify-center">
            <img src="/logos/eternity-logo.png" alt="Eternity" className="h-12 md:h-16 object-contain" />
          </div>
        </div>
      </div>
    </header>
  );
}
