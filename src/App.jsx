import React, { useState, useEffect, useMemo } from 'react';
import NightFlashcards, { FullscreenFlashcard } from './components/NightFlashcards';
import GrimoireCircle from './components/GrimoireCircle';

const ROLES_DB = {
  washerwoman: ['Washerwoman', 'townsfolk', '🧺', 'You start knowing that 1 of 2 players is a specific Townsfolk.'],
  librarian: ['Librarian', 'townsfolk', '📚', 'You start knowing that 1 of 2 players is a specific Outsider, or that zero are in play.'],
  investigator: ['Investigator', 'townsfolk', '🔍', 'You start knowing that 1 of 2 players is a specific Minion.'],
  chef: ['Chef', 'townsfolk', '🧑‍🍳', 'You start knowing how many pairs of evil players are sitting next to each other.'],
  empath: ['Empath', 'townsfolk', '👁️', 'Each night, you learn how many of your 2 alive neighbours are evil.'],
  fortuneteller: ['Fortune Teller', 'townsfolk', '🔮', 'Each night, choose 2 players: you learn if either is a Demon. 1 good player registers as a Demon.'],
  undertaker: ['Undertaker', 'townsfolk', '⚰️', 'Each night*, you learn which character died by execution today.'],
  monk: ['Monk', 'townsfolk', '🛡️', 'Each night*, choose a player (not yourself): they are safe from the Demon tonight.'],
  ravenkeeper: ['Ravenkeeper', 'townsfolk', '🦅', 'If you die at night, you are woken to choose a player: you learn their character.'],
  virgin: ['Virgin', 'townsfolk', '🕊️', 'The 1st time you are nominated, if the nominator is a Townsfolk, they are executed immediately.'],
  slayer: ['Slayer', 'townsfolk', '🏹', 'Once per game, during the day, publicly choose a player: if they are the Demon, they die.'],
  soldier: ['Soldier', 'townsfolk', '⚔️', 'You are safe from the Demon.'],
  mayor: ['Mayor', 'townsfolk', '🏛️', 'If only 3 players live & no execution occurs, your team wins. If you die at night, another player might die instead.'],
  butler: ['Butler', 'outsider', '🛎️', 'Each night, choose a master: you may only vote if they are voting too.'],
  drunk: ['Drunk', 'outsider', '🍺', 'You do not know you are the Drunk. You think you are a Townsfolk, but you are not.'],
  recluse: ['Recluse', 'outsider', '🦹', 'You might register as evil & as a Minion or Demon, even if dead.'],
  saint: ['Saint', 'outsider', '😇', 'If you die by execution, your team loses.'],
  poisoner: ['Poisoner', 'minion', '🧪', 'Each night, choose a player: they are poisoned tonight and tomorrow day.'],
  spy: ['Spy', 'minion', '🕵️', 'Each night, you see the Grimoire. You might register as good & as a Townsfolk or Outsider, even if dead.'],
  scarletwoman: ['Scarlet Woman', 'minion', '💃', 'If there are 5 or more players alive & the Demon dies, you become the Demon.'],
  baron: ['Baron', 'minion', '🎩', 'There are extra Outsiders in play. [+2 Outsiders]'],
  imp: ['Imp', 'demon', '😈', 'Each night*, choose a player: they die. If you kill yourself this way, a Minion becomes the Imp.'],
};

const TEAM_STYLES = {
  townsfolk: { label: 'Townsfolk', border: 'border-blue-500', bg: 'bg-blue-950/60', text: 'text-blue-300', badge: 'bg-blue-600' },
  outsider: { label: 'Outsiders', border: 'border-cyan-500', bg: 'bg-cyan-950/60', text: 'text-cyan-300', badge: 'bg-cyan-600' },
  minion: { label: 'Minions', border: 'border-orange-500', bg: 'bg-orange-950/60', text: 'text-orange-300', badge: 'bg-orange-600' },
  demon: { label: 'Demons', border: 'border-red-500', bg: 'bg-red-950/60', text: 'text-red-300', badge: 'bg-red-600' },
  unknown: { label: 'Custom / Other', border: 'border-zinc-500', bg: 'bg-zinc-900', text: 'text-zinc-300', badge: 'bg-zinc-600' },
};

const PLAYER_COUNT_TABLE = {
  5: { townsfolk: 3, outsider: 0, minion: 1, demon: 1, label: '5' },
  6: { townsfolk: 3, outsider: 1, minion: 1, demon: 1, label: '6' },
  7: { townsfolk: 5, outsider: 0, minion: 1, demon: 1, label: '7' },
  8: { townsfolk: 5, outsider: 1, minion: 1, demon: 1, label: '8' },
  9: { townsfolk: 5, outsider: 2, minion: 1, demon: 1, label: '9' },
  10: { townsfolk: 7, outsider: 0, minion: 2, demon: 1, label: '10' },
  11: { townsfolk: 7, outsider: 1, minion: 2, demon: 1, label: '11' },
  12: { townsfolk: 7, outsider: 2, minion: 2, demon: 1, label: '12' },
  13: { townsfolk: 9, outsider: 0, minion: 3, demon: 1, label: '13' },
  14: { townsfolk: 9, outsider: 1, minion: 3, demon: 1, label: '14' },
  15: { townsfolk: 9, outsider: 2, minion: 3, demon: 1, label: '15' },
};

const getRoleInfo = (id) => {
  const cleanId = String(id).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (ROLES_DB[cleanId]) {
    return {
      id: cleanId,
      name: ROLES_DB[cleanId][0],
      team: ROLES_DB[cleanId][1],
      icon: ROLES_DB[cleanId][2] || '✦',
      ability: ROLES_DB[cleanId][3] || '',
    };
  }
  return {
    id: cleanId,
    name: String(id).replace(/_/g, ' '),
    team: 'unknown',
    icon: '✦',
    ability: '',
  };
};

function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn(`Failed to read ${key} from localStorage`, e);
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Failed to write ${key} to localStorage`, e);
    }
  }, [key, value]);

  return [value, setValue];
}

export default function App() {
  const [activeTab, setActiveTab] = useLocalStorage('botc_active_tab', 'bag');
  const [playerCount, setPlayerCount] = useLocalStorage('botc_player_count', 8);
  const [scriptName, setScriptName] = useLocalStorage('botc_script_name', 'Trouble Brewing');
  const [scriptRoles, setScriptRoles] = useLocalStorage('botc_script_roles', Object.keys(ROLES_DB));
  const [bagRoles, setBagRoles] = useLocalStorage('botc_bag_roles', []);
  const [drunkDisguise, setDrunkDisguise] = useLocalStorage('botc_drunk_disguise', '');
  const [seats, setSeats] = useLocalStorage('botc_seats', []);
  const [fullscreenCard, setFullscreenCard] = useState(null);

  // Initialize or synchronize seats if table is empty
  useEffect(() => {
    if (seats.length === 0 && playerCount > 0) {
      setSeats(
        Array.from({ length: playerCount }, (_, i) => ({
          seat: i + 1,
          name: '',
          drawnToken: null,
          isDead: false,
        }))
      );
    }
  }, [playerCount, seats.length, setSeats]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target.result);
        if (!Array.isArray(json)) throw new Error();
        let name = file.name.replace('.json', '');
        const roles = [];
        json.forEach((item) => {
          if (typeof item === 'string') roles.push(item);
          else if (item?.id === '_meta' && item.name) name = item.name;
          else if (item?.id) roles.push(item.id);
        });
        if (roles.length) {
          setScriptName(name);
          setScriptRoles(roles);
          setBagRoles([]);
          setDrunkDisguise('');
        }
      } catch {
        alert('Invalid script JSON');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input to allow re-uploading same file
  };

  const toggleRoleInBag = (roleId) => {
    setBagRoles((prev) => {
      if (prev.includes(roleId)) {
        if (roleId === 'drunk') setDrunkDisguise('');
        return prev.filter((r) => r !== roleId);
      }
      if (drunkDisguise === roleId) setDrunkDisguise('');
      return [...prev, roleId];
    });
  };

  const isDrunkInBag = bagRoles.includes('drunk');

  const availableTownsfolkForDrunk = useMemo(
    () => scriptRoles.map(getRoleInfo).filter((r) => r.team === 'townsfolk' && !bagRoles.includes(r.id)),
    [scriptRoles, bagRoles]
  );

  const physicalTokensInBag = useMemo(
    () => bagRoles.map((r) => (r === 'drunk' ? drunkDisguise : r)).filter(Boolean),
    [bagRoles, drunkDisguise]
  );

  const handleAssignToken = (idx, token) => {
    setSeats((prev) => prev.map((s, i) => (i === idx ? { ...s, drawnToken: token } : s)));
  };

  const handleUpdateSeatName = (idx, name) => {
    setSeats((prev) => prev.map((s, i) => (i === idx ? { ...s, name } : s)));
  };

  const handleToggleDead = (idx) => {
    setSeats((prev) => prev.map((s, i) => (i === idx ? { ...s, isDead: !s.isDead } : s)));
  };

  const handleAddSeat = () => {
    setSeats((prev) => [
      ...prev,
      { seat: prev.length + 1, name: '', drawnToken: null, isDead: false },
    ]);
  };

  const handleRemoveSeat = (idx) => {
    setSeats((prev) => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, seat: i + 1 })));
  };

  const groupedScript = useMemo(() => {
    const g = { townsfolk: [], outsider: [], minion: [], demon: [], unknown: [] };
    scriptRoles.forEach((id) => {
      const info = getRoleInfo(id);
      g[info.team].push(info);
    });
    return g;
  }, [scriptRoles]);

  // Current bag counts
  const currentBagCounts = useMemo(() => {
    const counts = { townsfolk: 0, outsider: 0, minion: 0, demon: 0, unknown: 0 };
    bagRoles.forEach((id) => {
      const info = getRoleInfo(id);
      counts[info.team] = (counts[info.team] || 0) + 1;
    });
    return counts;
  }, [bagRoles]);

  const recommendedBalance = PLAYER_COUNT_TABLE[playerCount] || PLAYER_COUNT_TABLE[8];

  const handleResetGame = () => {
    if (window.confirm('Reset current game? This will clear all seats and selected bag roles.')) {
      setBagRoles([]);
      setDrunkDisguise('');
      setSeats(
        Array.from({ length: playerCount }, (_, i) => ({
          seat: i + 1,
          name: '',
          drawnToken: null,
          isDead: false,
        }))
      );
      setActiveTab('bag');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans select-none flex flex-col">
      <FullscreenFlashcard card={fullscreenCard} onClose={() => setFullscreenCard(null)} />

      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between shadow-md">
        <div>
          <h1 className="text-base font-bold text-amber-400">BotC Pocket Grimoire</h1>
          <p className="text-xs text-zinc-400">Script: <b className="text-zinc-200">{scriptName}</b></p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleResetGame}
            title="Reset current game and start fresh"
            className="text-xs text-zinc-400 hover:text-rose-400 border border-zinc-700 hover:border-rose-900/60 bg-zinc-800 px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            <span>↺</span>
            <span className="hidden sm:inline">Reset</span>
          </button>
          <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-zinc-700">
            Load JSON
            <input type="file" accept=".json,application/json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </header>

      {/* Tabs Navigation (No bottom bar!) */}
      <div className="grid grid-cols-3 bg-zinc-900 border-b border-zinc-800 text-xs sm:text-sm font-semibold sticky top-[57px] z-20">
        <button
          onClick={() => setActiveTab('bag')}
          className={`py-3 border-b-2 transition-all ${
            activeTab === 'bag'
              ? 'border-amber-400 text-amber-400 bg-zinc-800/40'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          1. Bag ({bagRoles.length})
        </button>
        <button
          onClick={() => setActiveTab('table')}
          className={`py-3 border-b-2 flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'table'
              ? 'border-amber-400 text-amber-400 bg-zinc-800/40'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span>2. Table Circle</span>
          <span>⭕</span>
        </button>
        <button
          onClick={() => setActiveTab('night')}
          className={`py-3 border-b-2 flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'night'
              ? 'border-amber-400 text-amber-400 bg-zinc-800/40'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span>3. Prompts</span>
          <span>🌙</span>
        </button>
      </div>

      {/* TAB 1: BAG SETUP */}
      {activeTab === 'bag' && (
        <main className="p-4 space-y-5 max-w-lg mx-auto w-full flex-1">
          {/* Step 1: Guest / Player Count Selector */}
          <section className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Number of Players:
              </span>
              <span className="text-xs font-black text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/30">
                {playerCount} Players
              </span>
            </div>

            {/* Quick Player Number Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setPlayerCount(num);
                    // Dynamically adjust seats count if empty or matched
                    if (seats.length === 0 || seats.every((s) => !s.drawnToken)) {
                      setSeats(
                        Array.from({ length: num }, (_, i) => ({
                          seat: i + 1,
                          name: seats[i]?.name || '',
                          drawnToken: null,
                          isDead: false,
                        }))
                      );
                    }
                  }}
                  className={`w-9 h-9 rounded-xl font-bold text-xs shrink-0 transition-all ${
                    playerCount === num
                      ? 'bg-amber-500 text-zinc-950 shadow-md scale-105'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Official Rulebook Balance Guide (Assistance, non-blocking) */}
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] space-y-1.5">
              <div className="text-zinc-400 font-medium">
                Official Rulebook Balance for <b className="text-zinc-200">{playerCount} players:</b>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="text-blue-400">
                  Townsfolk: {currentBagCounts.townsfolk}/{recommendedBalance.townsfolk}
                </span>
                <span className="text-cyan-400">
                  Outsiders: {currentBagCounts.outsider}/{recommendedBalance.outsider}
                </span>
                <span className="text-orange-400">
                  Minions: {currentBagCounts.minion}/{recommendedBalance.minion}
                </span>
                <span className="text-red-400">
                  Demons: {currentBagCounts.demon}/{recommendedBalance.demon}
                </span>
              </div>
            </div>
          </section>

          {/* Drunk Disguise Inline Card (if Drunk is picked) */}
          {isDrunkInBag && (
            <div className="bg-amber-950/40 border border-amber-500/50 rounded-2xl p-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                <span>🍺 Drunk Townsfolk Disguise:</span>
                <span className="text-[10px] text-zinc-400 font-normal">Physical token for bag</span>
              </div>
              <select
                value={drunkDisguise}
                onChange={(e) => setDrunkDisguise(e.target.value)}
                className="w-full bg-zinc-900 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
              >
                <option value="">-- Choose unused Townsfolk disguise --</option>
                {availableTownsfolkForDrunk.map((tf) => (
                  <option key={tf.id} value={tf.id}>
                    {tf.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Role Grid by Team */}
          {Object.entries(groupedScript).map(([teamKey, roles]) => {
            if (!roles.length) return null;
            const st = TEAM_STYLES[teamKey];
            return (
              <section key={teamKey} className="space-y-2">
                <h2 className={`text-xs font-bold uppercase ${st.text}`}>{st.label}</h2>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r) => {
                    const sel = bagRoles.includes(r.id);
                    const dis = drunkDisguise === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => toggleRoleInBag(r.id)}
                        className={`text-left px-3 py-2.5 rounded-xl border text-sm font-medium flex items-center justify-between transition-colors ${
                          sel
                            ? `${st.bg} ${st.border} text-white`
                            : dis
                            ? 'bg-amber-950/40 border-amber-500 text-amber-300'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <span className="truncate flex items-center gap-1.5">
                          <span>{r.icon}</span>
                          <span>{r.name}</span>
                        </span>
                        {sel && <span className={`w-2.5 h-2.5 rounded-full ${st.badge} shrink-0`} />}
                        {dis && (
                          <span className="text-[9px] font-black bg-amber-500 text-zinc-950 px-1 rounded shrink-0">
                            DRUNK
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </main>
      )}

      {/* TAB 2: GRIMOIRE TABLE CIRCLE */}
      {activeTab === 'table' && (
        <main className="p-4 max-w-lg mx-auto w-full flex-1">
          <GrimoireCircle
            seats={seats}
            drunkDisguise={drunkDisguise}
            physicalTokensInBag={physicalTokensInBag}
            getRoleInfo={getRoleInfo}
            TEAM_STYLES={TEAM_STYLES}
            onAssignToken={handleAssignToken}
            onUpdateSeatName={handleUpdateSeatName}
            onToggleDead={handleToggleDead}
            onAddSeat={handleAddSeat}
            onRemoveSeat={handleRemoveSeat}
            onShowToPlayer={(card) => setFullscreenCard(card)}
          />
        </main>
      )}

      {/* TAB 3: NIGHT FLASHCARDS */}
      {activeTab === 'night' && (
        <NightFlashcards
          scriptRoles={scriptRoles}
          bagRoles={bagRoles}
          getRoleInfo={getRoleInfo}
          onShowCard={(card) => setFullscreenCard(card)}
        />
      )}
    </div>
  );
}
