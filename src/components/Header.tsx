export const Header = () => {
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2">
        <img src="/logos/pelsa-logo.PNG" alt="PELSA" className="h-10 object-contain" />
        <img src="/logos/eternity-logo.png" alt="Eternity" className="h-8 object-contain" />
      </div>
    </header>
  );
};
