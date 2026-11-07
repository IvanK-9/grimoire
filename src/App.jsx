import React, { useState, useEffect, useMemo } from 'react';
import NightFlashcards, { FullscreenFlashcard } from './components/NightFlashcards';
import GrimoireCircle from './components/GrimoireCircle';
import RoleBalanceTracker from './components/RoleBalanceTracker';
import ScriptSelectorModal from './components/ScriptSelectorModal';
import GameStateModal from './components/GameStateModal';
import { resolveRoleInfo } from './data/roles';
import { SCRIPT_PRESETS } from './data/scripts';

const TEAM_STYLES = {
  townsfolk: { label: 'Townsfolk', border: 'border-blue-500', bg: 'bg-blue-950/60', text: 'text-blue-300', badge: 'bg-blue-600' },
  outsider: { label: 'Outsiders', border: 'border-cyan-500', bg: 'bg-cyan-950/60', text: 'text-cyan-300', badge: 'bg-cyan-600' },
  minion: { label: 'Minions', border: 'border-orange-500', bg: 'bg-orange-950/60', text: 'text-orange-300', badge: 'bg-orange-600' },
  demon: { label: 'Demons', border: 'border-red-500', bg: 'bg-red-950/60', text: 'text-red-300', badge: 'bg-red-600' },
  traveller: { label: 'Travellers', border: 'border-purple-500', bg: 'bg-purple-950/60', text: 'text-purple-300', badge: 'bg-purple-600' },
  unknown: { label: 'Custom / Other', border: 'border-zinc-500', bg: 'bg-zinc-900', text: 'text-zinc-300', badge: 'bg-zinc-600' },
};

const getRoleInfo = (id) => resolveRoleInfo(id);

function sanitizeSeats(rawSeats, count) {
  const targetLen = typeof count === 'number' && count > 0 ? count : (Array.isArray(rawSeats) ? rawSeats.length : 8);
  const safeList = Array.isArray(rawSeats) ? rawSeats : [];
  return Array.from({ length: targetLen }, (_, i) => {
    const s = safeList[i];
    return {
      seat: i + 1,
      name: typeof s?.name === 'string' ? s.name : '',
      drawnToken: s?.drawnToken || null,
      isDrunk: Boolean(s?.isDrunk),
      isTraveller: Boolean(s?.isTraveller),
      travellerAlignment: s?.travellerAlignment === 'evil' ? 'evil' : 'good',
      reminders: Array.isArray(s?.reminders) ? s.reminders.filter(Boolean) : [],
      isDead: Boolean(s?.isDead),
    };
  });
}

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
  const [scriptRoles, setScriptRoles] = useLocalStorage('botc_script_roles', SCRIPT_PRESETS.trouble_brewing.roles);
  const [bagRoles, setBagRoles] = useLocalStorage('botc_bag_roles', []);
  const [drunkDisguise, setDrunkDisguise] = useLocalStorage('botc_drunk_disguise', '');
  const [seats, setSeats] = useLocalStorage('botc_seats', []);
  const [fullscreenCard, setFullscreenCard] = useState(null);

  // Modals
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);

  // Initialize or sanitize seats on load or count change
  useEffect(() => {
    setSeats((prev) => {
      if (!Array.isArray(prev) || prev.length === 0) {
        return sanitizeSeats([], playerCount);
      }
      // Migrate missing fields on existing seats
      const hasMissingFields = prev.some((s) => typeof s.isDrunk !== 'boolean' || !Array.isArray(s.reminders));
      if (hasMissingFields) {
        return sanitizeSeats(prev, prev.length);
      }
      return prev;
    });
  }, [playerCount, setSeats]);

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
    () => scriptRoles.map(getRoleInfo).filter((r) => r && r.team === 'townsfolk' && !bagRoles.includes(r.id)),
    [scriptRoles, bagRoles]
  );

  const physicalTokensInBag = useMemo(
    () => bagRoles.map((r) => (r === 'drunk' ? drunkDisguise : r)).filter(Boolean),
    [bagRoles, drunkDisguise]
  );

  // Non-sticky token assignment
  const handleAssignToken = (idx, token) => {
    setSeats((prev) =>
      prev.map((s, i) => {
        if (i !== idx) return s;
        const isDrunkToken = Boolean(drunkDisguise && token === drunkDisguise);
        return {
          ...s,
          drawnToken: token,
          isDrunk: isDrunkToken,
        };
      })
    );
  };

  // Safe Drunk toggle without hardcoded fallback
  const handleToggleDrunk = (idx) => {
    setSeats((prev) =>
      prev.map((s, i) => {
        if (i !== idx) return s;
        const willBeDrunk = !s.isDrunk;
        if (!willBeDrunk) {
          return { ...s, isDrunk: false };
        }
        let disguise = s.drawnToken;
        const currentRole = disguise ? getRoleInfo(disguise) : null;
        if (!currentRole || currentRole.team !== 'townsfolk') {
          disguise = availableTownsfolkForDrunk[0]?.id || null;
        }
        return {
          ...s,
          isDrunk: true,
          drawnToken: disguise,
        };
      })
    );
  };

  const handleToggleTraveller = (idx) => {
    setSeats((prev) =>
      prev.map((s, i) => {
        if (i !== idx) return s;
        const nextTrav = !s.isTraveller;
        return {
          ...s,
          isTraveller: nextTrav,
          drawnToken: nextTrav ? (s.drawnToken || 'gunslinger') : s.drawnToken,
          travellerAlignment: s.travellerAlignment || 'good',
        };
      })
    );
  };

  const handleSetTravellerRole = (idx, roleId) => {
    setSeats((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, drawnToken: roleId, isTraveller: true } : s))
    );
  };

  const handleSetTravellerAlignment = (idx, alignment) => {
    setSeats((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, travellerAlignment: alignment } : s))
    );
  };

  const handleToggleReminder = (idx, reminder) => {
    setSeats((prev) =>
      prev.map((s, i) => {
        if (i !== idx) return s;
        const currentReminders = s.reminders || [];
        const nextReminders = currentReminders.includes(reminder)
          ? currentReminders.filter((r) => r !== reminder)
          : [...currentReminders, reminder];
        return { ...s, reminders: nextReminders };
      })
    );
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
      {
        seat: prev.length + 1,
        name: '',
        drawnToken: null,
        isDrunk: false,
        isTraveller: false,
        travellerAlignment: 'good',
        reminders: [],
        isDead: false,
      },
    ]);
  };

  const handleAddTraveller = () => {
    setSeats((prev) => [
      ...prev,
      {
        seat: prev.length + 1,
        name: '',
        drawnToken: 'gunslinger',
        isDrunk: false,
        isTraveller: true,
        travellerAlignment: 'good',
        reminders: [],
        isDead: false,
      },
    ]);
  };

  const handleRemoveSeat = (idx) => {
    setSeats((prev) => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, seat: i + 1 })));
  };

  const groupedScript = useMemo(() => {
    const g = { townsfolk: [], outsider: [], minion: [], demon: [], unknown: [] };
    scriptRoles.forEach((id) => {
      const info = getRoleInfo(id);
      if (info && g[info.team]) {
        g[info.team].push(info);
      } else if (info) {
        g.unknown.push(info);
      }
    });
    return g;
  }, [scriptRoles]);

  const handleSetPlayerCount = (num) => {
    setPlayerCount(num);
    setSeats((prev) => {
      if (prev.length === num) return prev;
      if (prev.length < num) {
        const next = [...prev];
        for (let i = prev.length; i < num; i++) {
          next.push({
            seat: i + 1,
            name: '',
            drawnToken: null,
            isDrunk: false,
            isTraveller: false,
            travellerAlignment: 'good',
            reminders: [],
            isDead: false,
          });
        }
        return next;
      }
      const canSafelyShrink = prev.slice(num).every((s) => !s.drawnToken && !s.name && !s.isTraveller);
      if (canSafelyShrink) {
        return prev.slice(0, num);
      }
      return prev;
    });
  };

  const handleResetGame = () => {
    setBagRoles([]);
    setDrunkDisguise('');
    setSeats(sanitizeSeats([], playerCount));
    setActiveTab('bag');
  };

  const handleSelectScript = (name, roles) => {
    setScriptName(name);
    setScriptRoles(roles);
    setBagRoles([]);
    setDrunkDisguise('');
  };

  const getGameStateSnapshot = () => ({
    schemaVersion: 2,
    timestamp: new Date().toISOString(),
    scriptName,
    scriptRoles,
    playerCount,
    bagRoles,
    drunkDisguise,
    seats,
  });

  const handleImportGameState = (json) => {
    if (!json || typeof json !== 'object') throw new Error('Invalid game state');
    if (json.scriptName) setScriptName(json.scriptName);
    if (Array.isArray(json.scriptRoles)) setScriptRoles(json.scriptRoles);
    if (typeof json.playerCount === 'number') setPlayerCount(json.playerCount);
    if (Array.isArray(json.bagRoles)) setBagRoles(json.bagRoles);
    if (typeof json.drunkDisguise === 'string') setDrunkDisguise(json.drunkDisguise);
    if (Array.isArray(json.seats)) {
      setSeats(sanitizeSeats(json.seats, json.playerCount || json.seats.length));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans select-none flex flex-col">
      <FullscreenFlashcard card={fullscreenCard} onClose={() => setFullscreenCard(null)} />

      {/* Script Selector Modal */}
      {showScriptModal && (
        <ScriptSelectorModal
          currentScriptName={scriptName}
          onSelectScript={handleSelectScript}
          onClose={() => setShowScriptModal(false)}
        />
      )}

      {/* Game State & Session Backup Modal */}
      {showBackupModal && (
        <GameStateModal
          getGameState={getGameStateSnapshot}
          onImportState={handleImportGameState}
          onResetGame={handleResetGame}
          onClose={() => setShowBackupModal(false)}
        />
      )}

      {/* Sticky Header with Script & Backup Controls */}
      <header className="sticky top-0 z-30 bg-zinc-900 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between shadow-md pt-[max(0.625rem,env(safe-area-inset-top))]">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-amber-400 leading-tight">
            BotC Pocket Grimoire
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] text-zinc-400">Script:</span>
            <button
              onClick={() => setShowScriptModal(true)}
              title="Change edition or load custom script"
              className="inline-flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-bold px-2 py-0.5 rounded border border-zinc-700 hover:border-amber-500/50 transition-colors"
            >
              <span>{scriptName}</span>
              <span className="text-[9px] text-amber-400">▾</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setShowBackupModal(true)}
            title="Backup, export, import or reset session"
            className="text-xs text-zinc-300 hover:text-zinc-100 border border-zinc-700 hover:border-zinc-600 bg-zinc-800 hover:bg-zinc-750 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>💾</span>
            <span className="hidden sm:inline">Backup & Reset</span>
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="grid grid-cols-3 bg-zinc-900 border-b border-zinc-800 text-xs sm:text-sm font-semibold sticky top-[53px] z-20">
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
                  onClick={() => handleSetPlayerCount(num)}
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
          </section>

          {/* Step 2: Good vs Evil Formula & Interactive Role Slots */}
          <RoleBalanceTracker
            playerCount={playerCount}
            bagRoles={bagRoles}
            getRoleInfo={getRoleInfo}
            onToggleRole={toggleRoleInBag}
          />

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
            const st = TEAM_STYLES[teamKey] || TEAM_STYLES.unknown;
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
            availableTownsfolk={availableTownsfolkForDrunk}
            getRoleInfo={getRoleInfo}
            TEAM_STYLES={TEAM_STYLES}
            onAssignToken={handleAssignToken}
            onUpdateSeatName={handleUpdateSeatName}
            onToggleDead={handleToggleDead}
            onToggleDrunk={handleToggleDrunk}
            onToggleTraveller={handleToggleTraveller}
            onSetTravellerRole={handleSetTravellerRole}
            onSetTravellerAlignment={handleSetTravellerAlignment}
            onToggleReminder={handleToggleReminder}
            onAddSeat={handleAddSeat}
            onAddTraveller={handleAddTraveller}
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
          drunkDisguise={drunkDisguise}
          getRoleInfo={getRoleInfo}
          onShowCard={(card) => setFullscreenCard(card)}
        />
      )}
    </div>
  );
}
