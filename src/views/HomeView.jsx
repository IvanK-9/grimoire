import React from 'react';
import { Play, Moon, Plus, BookOpen, ScrollText, Dices, History, WifiOff, Sparkles, ArrowRight } from 'lucide-react';

export default function HomeView({
  scriptName,
  seats = [],
  bagRoles = [],
  gameHistory = [],
  onNavigate,
  onStartNewGame,
}) {
  const hasActiveGame = seats.some((s) => s.drawnToken || s.name) || bagRoles.length > 0;
  const aliveCount = seats.filter((s) => !s.isDead).length;
  const travellersCount = seats.filter((s) => s.isTraveller).length;

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto w-full space-y-6 pb-24 md:pb-12 select-none animate-fadeIn">
      {/* Welcome Storyteller Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
          <span>Storyteller Pocket Companion</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">
          Blood on the Clocktower
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Fast, offline grimoire for physical games. Assist, never enforce.
        </p>
      </div>

      {/* Active Game Card (Resume or Quick Start) */}
      {hasActiveGame ? (
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/20 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Live Game in Progress
              </span>
            </div>
            <span className="text-[11px] font-medium bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-full border border-zinc-700">
              {scriptName}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2 mb-4 bg-zinc-950/70 rounded-xl p-3 border border-zinc-800/80 text-center">
            <div>
              <div className="text-lg font-black text-zinc-100">{seats.length}</div>
              <div className="text-[10px] text-zinc-400 uppercase font-semibold">Players</div>
            </div>
            <div>
              <div className="text-lg font-black text-emerald-400">{aliveCount}</div>
              <div className="text-[10px] text-zinc-400 uppercase font-semibold">Alive</div>
            </div>
            <div>
              <div className="text-lg font-black text-purple-400">{travellersCount}</div>
              <div className="text-[10px] text-zinc-400 uppercase font-semibold">Travellers</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={() => onNavigate('games', 'table')}
              className="w-full sm:flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Resume Grimoire Table</span>
              <Play className="w-4 h-4 fill-current text-zinc-950" />
            </button>
            <button
              onClick={() => onNavigate('games', 'night')}
              className="w-full sm:w-auto py-3 px-4 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 font-semibold rounded-xl text-xs transition-colors border border-zinc-700 flex items-center justify-center gap-1.5"
            >
              <Moon className="w-4 h-4 text-zinc-400" />
              <span>Prompts</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 text-center space-y-4 shadow-lg">
          <div className="w-12 h-12 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-2xl flex items-center justify-center mx-auto">
            <Dices className="w-6 h-6 text-zinc-300" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-100">Ready for Tonight's Game?</h2>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
              Select player count, set up the physical tokens in the bag, and run the circle seamlessly.
            </p>
          </div>
          <button
            onClick={onStartNewGame}
            className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-sm transition-all shadow-md inline-flex items-center justify-center gap-2 active:scale-98"
          >
            <Plus className="w-4 h-4 text-zinc-950" />
            <span>Start New Game</span>
          </button>
        </div>
      )}

      {/* Quick Links (Only shown when NO active game to avoid duplicating bottom nav) */}
      {!hasActiveGame && (
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => onNavigate('compendium')}
            className="text-left bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-3.5 transition-colors group shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-200 group-hover:text-zinc-100">Compendium</h3>
                <p className="text-[11px] text-zinc-500">Character registry</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />
          </button>

          <button
            onClick={() => onNavigate('scripts')}
            className="text-left bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-3.5 transition-colors group shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300">
                <ScrollText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-200 group-hover:text-zinc-100">Scripts</h3>
                <p className="text-[11px] text-zinc-500">Editions & Builder</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />
          </button>
        </div>
      )}

      {/* Recent Games Mini-List */}
      {gameHistory.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              <span>Recent Games</span>
            </h2>
            <button
              onClick={() => onNavigate('games', 'history')}
              className="text-xs text-zinc-400 hover:text-zinc-200 font-medium"
            >
              See all ({gameHistory.length})
            </button>
          </div>
          <div className="space-y-2">
            {gameHistory.slice(0, 3).map((g) => (
              <div
                key={g.id}
                onClick={() => onNavigate('games', 'history')}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-3 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-200">{g.scriptName}</span>
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                        g.winner === 'good'
                          ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                          : g.winner === 'evil'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {g.winner === 'good' ? 'Good Won' : g.winner === 'evil' ? 'Evil Won' : 'Draw'}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {new Date(g.date).toLocaleDateString()} • {g.playerCount} players
                    {g.notes ? ` • "${g.notes.slice(0, 30)}..."` : ''}
                  </div>
                </div>
                <span className="text-zinc-500 text-sm">›</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PWA & Privacy Notice */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex items-center gap-3 text-xs text-zinc-400">
        <WifiOff className="w-5 h-5 text-zinc-500 shrink-0" />
        <div>
          <span className="font-semibold text-zinc-300">100% Offline PWA & Zero Accounts: </span>
          <span>
            All your scripts, grimoires, and game histories are stored privately on your device. Works completely offline.
          </span>
        </div>
      </div>
    </div>
  );
}
