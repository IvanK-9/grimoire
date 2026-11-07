import React from 'react';

export default function AppNavBar({ activeView, onSelectView, hasActiveGame = false, activePlayerCount = 0 }) {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      desc: 'Dashboard & Quick Start',
    },
    {
      id: 'compendium',
      label: 'Compendium',
      icon: '📖',
      desc: 'Characters & Reference',
    },
    {
      id: 'scripts',
      label: 'Scripts',
      icon: '📜',
      desc: 'Editions & Builder',
    },
    {
      id: 'games',
      label: 'Games',
      icon: '🎲',
      desc: 'Active Grimoire & History',
      badge: hasActiveGame ? (activePlayerCount ? `${activePlayerCount}p` : 'LIVE') : null,
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: '💬',
      desc: 'Big Text & Cues',
    },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation Bar (Fixed) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800/90 px-1.5 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl transition-all"
      >
        <div className="grid grid-cols-5 gap-0.5 max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-amber-400 bg-amber-500/10 font-bold scale-[1.02]'
                    : 'text-zinc-400 hover:text-zinc-200 active:scale-95'
                }`}
              >
                <div className="relative text-base sm:text-lg leading-none mb-0.5">
                  <span>{item.icon}</span>
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-3 px-1 py-0.2 bg-red-600 text-white text-[8px] font-black rounded-full animate-pulse shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[9.5px] sm:text-[10px] tracking-tight truncate max-w-full">
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 w-5 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Top Sub-Bar (Integrated below Header) */}
      <nav
        aria-label="Desktop Navigation"
        className="hidden md:flex items-center justify-center gap-2 bg-zinc-900/80 border-b border-zinc-800 px-6 py-2 sticky top-[53px] z-20 backdrop-blur-sm"
      >
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-zinc-950 text-amber-300' : 'bg-red-600 text-white animate-pulse'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
