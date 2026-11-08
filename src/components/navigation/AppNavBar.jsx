import React from 'react';
import { Home, BookOpen, ScrollText, Dices, MessageSquare } from 'lucide-react';

export default function AppNavBar({ activeView, onSelectView, hasActiveGame = false, activePlayerCount = 0 }) {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      desc: 'Dashboard & Quick Start',
    },
    {
      id: 'compendium',
      label: 'Compendium',
      icon: BookOpen,
      desc: 'Characters & Reference',
    },
    {
      id: 'scripts',
      label: 'Scripts',
      icon: ScrollText,
      desc: 'Editions & Builder',
    },
    {
      id: 'games',
      label: 'Games',
      icon: Dices,
      desc: 'Active Grimoire & History',
      badge: hasActiveGame ? (activePlayerCount ? `${activePlayerCount}p` : 'LIVE') : null,
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      desc: 'Big Text & Cues',
    },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation Bar (Fixed for One-Handed Thumb Operation) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur border-t border-zinc-800 px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl transition-all"
      >
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors relative ${
                  isActive
                    ? 'text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 active:scale-95'
                }`}
              >
                <div className="relative leading-none mb-1">
                  <Icon className="w-5 h-5 text-current" />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-3.5 px-1 py-0.2 bg-red-600 text-white text-[8px] font-black rounded-full animate-pulse shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] tracking-tight truncate max-w-full">
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 w-5 h-0.5 bg-zinc-100 rounded-full" />
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
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs transition-colors relative ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 text-current" />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-zinc-900 text-zinc-200 border border-zinc-700' : 'bg-red-600 text-white animate-pulse'
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
