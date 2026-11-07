import React, { useState, useMemo } from 'react';
import { getAllRoles, EDITIONS } from '../data/roles';

const TEAM_LABELS = {
  all: { label: 'All Teams', icon: '✦', badge: 'bg-zinc-800 text-zinc-300' },
  townsfolk: { label: 'Townsfolk', icon: '🧺', badge: 'bg-blue-950/80 text-blue-300 border-blue-600/40' },
  outsider: { label: 'Outsiders', icon: '🍺', badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-600/40' },
  minion: { label: 'Minions', icon: '🧪', badge: 'bg-orange-950/80 text-orange-300 border-orange-600/40' },
  demon: { label: 'Demons', icon: '😈', badge: 'bg-red-950/80 text-red-300 border-red-600/40' },
  traveller: { label: 'Travellers', icon: '🧳', badge: 'bg-purple-950/80 text-purple-300 border-purple-600/40' },
};

export default function CompendiumView({ onShowRoleFullscreen }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedEdition, setSelectedEdition] = useState('all');

  const allRoles = useMemo(() => getAllRoles(), []);

  // Filter roles based on query, team, and edition
  const filteredRoles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allRoles.filter((r) => {
      // Team filter
      if (selectedTeam !== 'all' && r.team !== selectedTeam) {
        return false;
      }
      // Edition filter
      if (selectedEdition !== 'all' && r.edition !== selectedEdition) {
        return false;
      }
      // Query filter
      if (q) {
        const matchName = r.name.toLowerCase().includes(q);
        const matchAbility = r.ability.toLowerCase().includes(q);
        const matchId = r.id.toLowerCase().includes(q);
        if (!matchName && !matchAbility && !matchId) return false;
      }
      return true;
    });
  }, [allRoles, searchQuery, selectedTeam, selectedEdition]);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-5 pb-24 md:pb-12 select-none animate-fadeIn">
      {/* Top Compendium Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <h1 className="text-lg sm:text-xl font-black text-zinc-100 tracking-tight">
              Compendium & Character Registry
            </h1>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-500/30">
            {allRoles.length} Characters
          </span>
        </div>
        <p className="text-xs text-zinc-400">
          Official abilities, rulings, and Big Text fullscreen inspection for players.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">🔍</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by character or ability (e.g. poison, executed, neighbor)..."
          className="w-full bg-zinc-900 border border-zinc-700/80 rounded-2xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 text-sm w-5 h-5 flex items-center justify-center rounded-full bg-zinc-800"
          >
            ✕
          </button>
        )}
      </div>

      {/* Team Filter Pills */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
          Filter by Team
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {Object.entries(TEAM_LABELS).map(([k, v]) => {
            const isSel = selectedTeam === k;
            return (
              <button
                key={k}
                onClick={() => setSelectedTeam(k)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 border ${
                  isSel
                    ? 'bg-amber-500 text-zinc-950 font-bold border-amber-400 shadow-md'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <span>{v.icon}</span>
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Edition Filter Pills */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
          Filter by Edition
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {Object.entries(EDITIONS).map(([k, v]) => {
            const isSel = selectedEdition === k;
            return (
              <button
                key={k}
                onClick={() => setSelectedEdition(k)}
                className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition-all border ${
                  isSel
                    ? 'bg-zinc-100 text-zinc-950 font-bold border-zinc-200 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Count Status */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1 pt-1">
        <span>
          Showing <strong className="text-zinc-200">{filteredRoles.length}</strong> of {allRoles.length} roles
        </span>
        {(searchQuery || selectedTeam !== 'all' || selectedEdition !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTeam('all');
              setSelectedEdition('all');
            }}
            className="text-amber-400 hover:underline text-[11px] font-semibold"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Characters Grid */}
      {filteredRoles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredRoles.map((role) => {
            const teamStyle = TEAM_LABELS[role.team] || TEAM_LABELS.all;
            const editionInfo = EDITIONS[role.edition] || { label: 'Custom' };

            return (
              <div
                key={role.id}
                className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 transition-all flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md"
              >
                <div className="space-y-2">
                  {/* Card Header: Icon, Name, Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center shrink-0">
                        {role.icon}
                      </span>
                      <div>
                        <h2 className="text-sm font-bold text-zinc-100 leading-snug">
                          {role.name}
                        </h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${teamStyle.badge}`}
                          >
                            {teamStyle.label}
                          </span>
                          <span className="text-[9px] text-zinc-400 bg-zinc-800 px-1.5 py-0.2 rounded border border-zinc-700">
                            {editionInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ability text */}
                  <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800/60">
                    {role.ability || 'No official description provided.'}
                  </p>
                </div>

                {/* Show to player CTA */}
                <div className="pt-1 flex items-center justify-end">
                  <button
                    onClick={() =>
                      onShowRoleFullscreen({
                        title: role.name,
                        icon: role.icon,
                        subtitle: `${teamStyle.label} • ${editionInfo.label}`,
                        body: role.ability,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-amber-300 hover:text-amber-200 border border-zinc-700 hover:border-amber-500/40 rounded-xl text-xs font-semibold transition-all active:scale-95"
                    title="Display card in fullscreen mode to show a player silently"
                  >
                    <span>👁️</span>
                    <span>Show to Player</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center space-y-3">
          <div className="text-3xl">🔍</div>
          <p className="text-sm text-zinc-300 font-semibold">No characters found</p>
          <p className="text-xs text-zinc-500">
            No roles matched your search criteria "{searchQuery}". Try a different keyword or reset filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTeam('all');
              setSelectedEdition('all');
            }}
            className="px-4 py-2 bg-zinc-800 text-zinc-200 text-xs font-bold rounded-xl border border-zinc-700 hover:bg-zinc-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
