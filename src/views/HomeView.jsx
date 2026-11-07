import React from 'react';

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
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <span>🕯️</span>
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
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/30 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Live Game in Progress
              </span>
            </div>
            <span className="text-[11px] font-medium bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-700">
              {scriptName}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2 mb-4 bg-zinc-950/60 rounded-xl p-3 border border-zinc-800/80 text-center">
            <div>
              <div className="text-lg font-black text-amber-400">{seats.length}</div>
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
              <span>⭕</span>
            </button>
            <button
              onClick={() => onNavigate('games', 'night')}
              className="w-full sm:w-auto py-3 px-4 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 font-semibold rounded-xl text-xs transition-colors border border-zinc-700 flex items-center justify-center gap-1.5"
            >
              <span>Prompts</span>
              <span>🌙</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 text-center space-y-3 shadow-lg">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto text-2xl">
            🎲
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
            <span>+ Start New Game</span>
            <span>🎲</span>
          </button>
        </div>
      )}

      {/* Quick Navigation Cards Grid */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">
          App Sections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Compendium Card */}
          <button
            onClick={() => onNavigate('compendium')}
            className="text-left bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-amber-500/40 rounded-2xl p-4 transition-all group shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-start justify-between w-full mb-2">
              <span className="text-2xl p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                📖
              </span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase group-hover:text-amber-400 transition-colors">
                ~130 Roles ➔
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                Compendium
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Full character registry across TB, BMR, S&V, Travellers, and Experimental. Instant search & Big Text cards.
              </p>
            </div>
          </button>

          {/* Scripts Card */}
          <button
            onClick={() => onNavigate('scripts')}
            className="text-left bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-amber-500/40 rounded-2xl p-4 transition-all group shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-start justify-between w-full mb-2">
              <span className="text-2xl p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                📜
              </span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase group-hover:text-amber-400 transition-colors">
                Builder & Import ➔
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                Scripts
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Official core editions, load from link or JSON file, and create custom scripts with balance validation.
              </p>
            </div>
          </button>

          {/* Live Grimoire Card */}
          <button
            onClick={() => onNavigate('games', 'table')}
            className="text-left bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-amber-500/40 rounded-2xl p-4 transition-all group shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-start justify-between w-full mb-2">
              <span className="text-2xl p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                🎲
              </span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase group-hover:text-amber-400 transition-colors">
                Live Table ➔
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                Active Grimoire
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Interactive round table circle, live neighbours calculation, Drunk disguise, reminders, and night actions.
              </p>
            </div>
          </button>

          {/* Games History Card */}
          <button
            onClick={() => onNavigate('games', 'history')}
            className="text-left bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-amber-500/40 rounded-2xl p-4 transition-all group shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-start justify-between w-full mb-2">
              <span className="text-2xl p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                🏆
              </span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase group-hover:text-amber-400 transition-colors">
                {gameHistory.length} Logged ➔
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                Game History
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Log completed games, declare winning teams, save storyteller notes, and review final table snapshots.
              </p>
            </div>
          </button>

          {/* Messages & Big Text Card */}
          <button
            onClick={() => onNavigate('messages')}
            className="sm:col-span-2 text-left bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/20 hover:to-amber-950/30 border border-zinc-800 hover:border-amber-500/40 rounded-2xl p-4 transition-all group shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                💬
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                    Messages & Big Text Communicator
                  </h3>
                  <span className="text-[9px] font-black bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/30 uppercase">
                    New
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Silent night cues (YES/NO, numbers 0-3, 'choose a player'), role tokens in giant text, and on-the-fly free text generator.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400 shrink-0 self-end sm:self-center group-hover:translate-x-1 transition-transform">
              Open Communicator ➔
            </span>
          </button>
        </div>
      </div>

      {/* Recent Games Mini-List */}
      {gameHistory.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Recent Games
            </h2>
            <button
              onClick={() => onNavigate('games', 'history')}
              className="text-xs text-amber-400 hover:underline font-semibold"
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
                          ? 'bg-blue-950 text-blue-300 border border-blue-600/40'
                          : g.winner === 'evil'
                          ? 'bg-red-950 text-red-300 border border-red-600/40'
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
        <span className="text-xl">📶</span>
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
