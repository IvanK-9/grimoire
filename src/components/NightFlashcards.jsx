import React, { useState } from 'react';

const OFFICIAL_PROMPTS = [
  { id: 'choose_player', title: 'Choose a player', category: 'action', color: 'amber' },
  { id: 'point_two', title: 'Point to 2 players', category: 'action', color: 'amber' },
  { id: 'choose_char', title: 'Choose a character', category: 'action', color: 'amber' },
  { id: 'these_minions', title: 'These are your Minions', category: 'evil', color: 'orange' },
  { id: 'this_demon', title: 'This is your Demon', category: 'evil', color: 'red' },
  { id: 'close_eyes', title: 'Close your eyes', category: 'action', color: 'zinc' },
  { id: 'did_nominate', title: 'Did you nominate today?', category: 'question', color: 'cyan' },
  { id: 'did_vote', title: 'Did you vote today?', category: 'question', color: 'cyan' },
  { id: 'ans_yes', title: 'YES', category: 'answer', color: 'emerald' },
  { id: 'ans_no', title: 'NO', category: 'answer', color: 'rose' },
  { id: 'count_0', title: '0', category: 'count', color: 'purple' },
  { id: 'count_1', title: '1', category: 'count', color: 'purple' },
  { id: 'count_2', title: '2', category: 'count', color: 'purple' },
  { id: 'count_3', title: '3', category: 'count', color: 'purple' },
];

export function FullscreenFlashcard({ card, onClose }) {
  if (!card) return null;

  const colorStyles = {
    amber: 'text-amber-400 border-amber-500/50 shadow-amber-500/20',
    orange: 'text-orange-400 border-orange-500/50 shadow-orange-500/20',
    red: 'text-red-500 border-red-500/50 shadow-red-500/20',
    emerald: 'text-emerald-400 border-emerald-500/50 shadow-emerald-500/20',
    rose: 'text-rose-500 border-rose-500/50 shadow-rose-500/20',
    purple: 'text-purple-400 border-purple-500/50 shadow-purple-500/20',
    cyan: 'text-cyan-400 border-cyan-500/50 shadow-cyan-500/20',
    zinc: 'text-zinc-200 border-zinc-700 shadow-zinc-800/50',
    townsfolk: 'text-blue-400 border-blue-500/50 shadow-blue-500/20',
    outsider: 'text-cyan-400 border-cyan-500/50 shadow-cyan-500/20',
    minion: 'text-orange-400 border-orange-500/50 shadow-orange-500/20',
    demon: 'text-red-500 border-red-500/50 shadow-red-500/20',
  };

  const styleClass = colorStyles[card.color || card.team] || colorStyles.amber;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer"
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-700 rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold"
      >
        ✕
      </button>

      {card.subtitle && (
        <p className="text-sm sm:text-base font-bold tracking-widest uppercase text-zinc-500 mb-3">
          {card.subtitle}
        </p>
      )}

      {card.icon && (
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-5xl sm:text-6xl mb-6 bg-zinc-900 border-2 border-zinc-800 shadow-2xl">
          {card.icon}
        </div>
      )}

      <h1 className={`text-4xl sm:text-6xl md:text-7xl font-black tracking-wide leading-tight max-w-2xl ${styleClass}`}>
        {card.title}
      </h1>

      {card.teamLabel && (
        <div className="mt-4">
          <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300">
            {card.teamLabel}
          </span>
        </div>
      )}

      {card.description && (
        <p className="mt-6 text-xs sm:text-sm text-zinc-400 max-w-md italic px-4">
          "{card.description}"
        </p>
      )}

      <div className="absolute bottom-6 text-zinc-600 text-[11px] font-medium tracking-wider uppercase">
        Tap anywhere to dismiss
      </div>
    </div>
  );
}

export default function NightFlashcards({
  scriptRoles,
  bagRoles,
  drunkDisguise,
  getRoleInfo,
  onShowCard,
}) {
  const [customText, setCustomText] = useState('');

  const handleShowCustom = (e) => {
    e.preventDefault();
    if (!customText.trim()) return;
    onShowCard({
      title: customText.trim(),
      subtitle: 'Custom Prompt',
      color: 'amber',
    });
  };

  // Anti-leak: Replace Drunk with its Townsfolk disguise so Drunk role is never revealed to players at night
  const rolesToDisplay = (bagRoles.length > 0 ? bagRoles : scriptRoles)
    .map((id) => (id === 'drunk' ? drunkDisguise || null : id))
    .filter(Boolean);

  return (
    <main className="p-4 space-y-6 max-w-lg mx-auto pb-28">
      {/* Custom Text Input Bar */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
          <span>Custom Message (Big Text):</span>
          <span className="text-[10px] text-zinc-500">Free input</span>
        </div>
        <form onSubmit={handleShowCustom} className="flex gap-2">
          <input
            type="text"
            placeholder="Type anything (e.g. You are safe)..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!customText.trim()}
            className="bg-amber-500 disabled:opacity-40 text-zinc-950 font-bold text-xs px-4 py-2 rounded-xl shrink-0 hover:bg-amber-400"
          >
            Show Big
          </button>
        </form>
      </section>

      {/* Answers & Count Buttons */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Quick Answers & Counts
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onShowCard({ title: 'YES', subtitle: 'Storyteller Answer', color: 'emerald' })}
            className="py-3 rounded-xl bg-emerald-950/40 border border-emerald-600/50 text-emerald-400 font-black text-xl hover:bg-emerald-900/40"
          >
            YES
          </button>
          <button
            onClick={() => onShowCard({ title: 'NO', subtitle: 'Storyteller Answer', color: 'rose' })}
            className="py-3 rounded-xl bg-rose-950/40 border border-rose-600/50 text-rose-400 font-black text-xl hover:bg-rose-900/40"
          >
            NO
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 pt-1">
          {['0', '1', '2', '3'].map((num) => (
            <button
              key={num}
              onClick={() => onShowCard({ title: num, subtitle: 'Count / Fingers', color: 'purple' })}
              className="py-2.5 rounded-xl bg-purple-950/40 border border-purple-600/50 text-purple-300 font-bold text-lg hover:bg-purple-900/40"
            >
              {num}
            </button>
          ))}
        </div>
      </section>

      {/* Official Night Prompts */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Official Night Directions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {OFFICIAL_PROMPTS.filter((p) => p.category === 'action' || p.category === 'evil' || p.category === 'question').map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => onShowCard({ title: prompt.title, subtitle: 'Night Instruction', color: prompt.color })}
              className="px-3.5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-left text-sm font-semibold text-zinc-200 hover:border-amber-500/50 hover:bg-zinc-850 flex items-center justify-between"
            >
              <span>{prompt.title}</span>
              <span className="text-zinc-500 text-xs">➔</span>
            </button>
          ))}
        </div>
      </section>

      {/* Character Cards */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Show Character Token ({rolesToDisplay.length})
          </h2>
          <span className="text-[10px] text-zinc-500">
            {bagRoles.length > 0 ? 'From Bag' : 'All Script'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {rolesToDisplay.map((roleId) => {
            const role = getRoleInfo(roleId);
            return (
              <button
                key={roleId}
                onClick={() =>
                  onShowCard({
                    title: role.name,
                    subtitle: 'This player is / Character in play',
                    icon: role.icon,
                    team: role.team,
                    teamLabel: role.team.toUpperCase(),
                    description: role.ability,
                  })
                }
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-left hover:border-zinc-600 flex items-center gap-2.5"
              >
                <span className="text-xl shrink-0">{role.icon || '✦'}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-zinc-200 truncate">{role.name}</div>
                  <div className="text-[10px] uppercase text-zinc-500 font-medium">{role.team}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
