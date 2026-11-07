import React, { useState, useEffect, useMemo } from 'react';
import AppNavBar from './components/navigation/AppNavBar';
import HomeView from './views/HomeView';
import CompendiumView from './views/CompendiumView';
import ScriptsView from './views/ScriptsView';
import GamesView from './views/GamesView';
import MessagesView from './views/MessagesView';
import ScriptSelectorModal from './components/ScriptSelectorModal';
import GameStateModal from './components/GameStateModal';
import { FullscreenFlashcard } from './components/NightFlashcards';
import { resolveRoleInfo } from './data/roles';
import { SCRIPT_PRESETS } from './data/scripts';
import { DEFAULT_FAVORITE_IDS } from './data/messages';
import {
  APP_VERSION,
  GIT_HASH,
  BUILD_TIME,
  GITHUB_REPO,
  GITLAB_REPO,
  GITHUB_COMMIT_URL,
  RELEASE_HIGHLIGHTS,
} from './config/version';

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
  // Navigation State: 'home' | 'compendium' | 'scripts' | 'games'
  const [activeMainView, setActiveMainView] = useLocalStorage('botc_main_view', 'home');
  const [gamesInitialSubTab, setGamesInitialSubTab] = useState('live');
  const [gamesInitialLiveTab, setGamesInitialLiveTab] = useState('bag');

  // Game Engine State
  const [playerCount, setPlayerCount] = useLocalStorage('botc_player_count', 8);
  const [scriptName, setScriptName] = useLocalStorage('botc_script_name', 'Trouble Brewing');
  const [scriptRoles, setScriptRoles] = useLocalStorage('botc_script_roles', SCRIPT_PRESETS.trouble_brewing.roles);
  const [bagRoles, setBagRoles] = useLocalStorage('botc_bag_roles', []);
  const [drunkDisguise, setDrunkDisguise] = useLocalStorage('botc_drunk_disguise', '');
  const [seats, setSeats] = useLocalStorage('botc_seats', []);
  const [fullscreenCard, setFullscreenCard] = useState(null);

  // App-Wide Persistent Collections
  const [gameHistory, setGameHistory] = useLocalStorage('botc_game_history', []);
  const [customScripts, setCustomScripts] = useLocalStorage('botc_custom_scripts', []);
  const [favoriteMessageIds, setFavoriteMessageIds] = useLocalStorage('botc_favorite_messages', DEFAULT_FAVORITE_IDS);
  const [customMessages, setCustomMessages] = useLocalStorage('botc_custom_messages', []);

  // Modals
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);

  // Sanitize seats on load or count change
  useEffect(() => {
    setSeats((prev) => {
      if (!Array.isArray(prev) || prev.length === 0) {
        return sanitizeSeats([], playerCount);
      }
      const hasMissingFields = prev.some((s) => typeof s.isDrunk !== 'boolean' || !Array.isArray(s.reminders));
      if (hasMissingFields) {
        return sanitizeSeats(prev, prev.length);
      }
      return prev;
    });
  }, [playerCount, setSeats]);

  const hasActiveGame = useMemo(() => {
    return seats.some((s) => s.drawnToken || s.name) || bagRoles.length > 0;
  }, [seats, bagRoles]);

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

  const availableTownsfolkForDrunk = useMemo(
    () => scriptRoles.map(getRoleInfo).filter((r) => r && r.team === 'townsfolk' && !bagRoles.includes(r.id)),
    [scriptRoles, bagRoles]
  );

  const physicalTokensInBag = useMemo(
    () => bagRoles.map((r) => (r === 'drunk' ? drunkDisguise : r)).filter(Boolean),
    [bagRoles, drunkDisguise]
  );

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
  };

  const handleStartNewGame = () => {
    handleResetGame();
    setActiveMainView('games');
    setGamesInitialSubTab('live');
    setGamesInitialLiveTab('bag');
  };

  const handleSelectScript = (name, roles) => {
    setScriptName(name);
    setScriptRoles(roles);
    setBagRoles([]);
    setDrunkDisguise('');
    setShowScriptModal(false);
  };

  const handleSaveCustomScript = (script) => {
    setCustomScripts((prev) => {
      const filtered = Array.isArray(prev) ? prev.filter((s) => s.id !== script.id) : [];
      return [script, ...filtered];
    });
  };

  const handleDeleteCustomScript = (id) => {
    setCustomScripts((prev) => (Array.isArray(prev) ? prev.filter((s) => s.id !== id) : []));
  };

  const handleFinishGame = ({ winner, notes }) => {
    const finishedSession = {
      id: 'game_' + Date.now(),
      date: new Date().toISOString(),
      scriptName,
      playerCount: seats.length,
      winner,
      notes,
      seatsSnapshot: seats.map((s) => ({
        seat: s.seat,
        name: s.name,
        drawnToken: s.drawnToken,
        isDrunk: s.isDrunk,
        isDead: s.isDead,
        isTraveller: s.isTraveller,
        travellerAlignment: s.travellerAlignment,
        reminders: [...(s.reminders || [])],
      })),
      bagRoles: [...bagRoles],
    };
    setGameHistory((prev) => [finishedSession, ...(Array.isArray(prev) ? prev : [])]);
  };

  const handleDeleteHistoryItem = (id) => {
    setGameHistory((prev) => (Array.isArray(prev) ? prev.filter((g) => g.id !== id) : []));
  };

  const handleClearHistory = () => {
    setGameHistory([]);
  };

  const handleToggleFavoriteMessage = (msgId) => {
    setFavoriteMessageIds((prev) =>
      prev.includes(msgId) ? prev.filter((id) => id !== msgId) : [...prev, msgId]
    );
  };

  const handleCreateCustomMessage = (newMsg) => {
    setCustomMessages((prev) => [newMsg, ...(Array.isArray(prev) ? prev : [])]);
  };

  const handleDeleteCustomMessage = (msgId) => {
    setCustomMessages((prev) => (Array.isArray(prev) ? prev.filter((m) => m.id !== msgId) : []));
    setFavoriteMessageIds((prev) => (Array.isArray(prev) ? prev.filter((id) => id !== msgId) : []));
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

  // Quick navigation helper
  const handleNavigate = (view, subOrTab = 'live', optLiveTab) => {
    setActiveMainView(view);
    if (view === 'games') {
      if (subOrTab === 'history') {
        setGamesInitialSubTab('history');
      } else if (subOrTab === 'table' || subOrTab === 'night' || subOrTab === 'bag') {
        setGamesInitialSubTab('live');
        setGamesInitialLiveTab(subOrTab);
      } else {
        setGamesInitialSubTab('live');
        if (optLiveTab) setGamesInitialLiveTab(optLiveTab);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans select-none flex flex-col">
      {/* Fullscreen Flashcard Modal for player presentation */}
      <FullscreenFlashcard card={fullscreenCard} onClose={() => setFullscreenCard(null)} />

      {/* Script Selector Modal (Quick Switch) */}
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

      {/* About & Version Info Modal */}
      {showVersionModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowVersionModal(false)}
        >
          <div
            className="bg-zinc-900 border border-zinc-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scaleUp text-zinc-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🕯️</span>
                <div>
                  <h3 className="font-bold text-zinc-100 text-base leading-tight flex items-center gap-2">
                    <span>BotC Pocket Grimoire</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      v{APP_VERSION}
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400">Offline Storyteller Assistant</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVersionModal(false)}
                className="text-zinc-400 hover:text-zinc-100 text-lg p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Build Meta Grid */}
              <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800 font-mono">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Commit</span>
                  <a
                    href={GITHUB_COMMIT_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline font-bold text-xs inline-flex items-center gap-1"
                  >
                    <span>{GIT_HASH}</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">PWA Offline</span>
                  <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Cached / Ready
                  </span>
                </div>
                {BUILD_TIME && (
                  <div className="col-span-2 pt-2 border-t border-zinc-800/80">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Built At</span>
                    <span className="text-zinc-300 text-[11px] font-sans">
                      {new Date(BUILD_TIME).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* What's in this version */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>✨</span>
                  <span>Release Highlights (v{APP_VERSION}):</span>
                </span>
                <ul className="space-y-1.5 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800 text-zinc-300">
                  {RELEASE_HIGHLIGHTS.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 shrink-0 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Repositories */}
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-zinc-400">
                <span>Repositories:</span>
                <div className="flex items-center gap-3">
                  <a
                    href={GITHUB_REPO}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1"
                  >
                    <span>GitHub</span>
                    <span className="text-[9px]">↗</span>
                  </a>
                  <span>•</span>
                  <a
                    href={GITLAB_REPO}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1"
                  >
                    <span>GitLab</span>
                    <span className="text-[9px]">↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-zinc-950 border-t border-zinc-800 text-center">
              <button
                type="button"
                onClick={() => setShowVersionModal(false)}
                className="w-full py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 font-bold rounded-xl transition-colors text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Global Header */}
      <header className="sticky top-0 z-30 bg-zinc-900 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between shadow-md pt-[max(0.625rem,env(safe-area-inset-top))]">
        <div
          onClick={() => setActiveMainView('home')}
          className="cursor-pointer group flex items-center gap-2"
        >
          <span className="text-xl">🕯️</span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-amber-400 leading-tight group-hover:text-amber-300 transition-colors">
                BotC Pocket Grimoire
              </h1>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowVersionModal(true);
                }}
                title={`Version ${APP_VERSION} (${GIT_HASH}) - Click for build info`}
                className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-800/90 text-amber-400/90 border border-zinc-700 hover:border-amber-500/60 hover:text-amber-300 transition-colors cursor-pointer"
              >
                v{APP_VERSION}
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-zinc-400">Script:</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowScriptModal(true);
                }}
                title="Change edition or load custom script"
                className="inline-flex items-center gap-1 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-[11px] font-bold px-2 py-0.5 rounded border border-zinc-700 hover:border-amber-500/50 transition-colors"
              >
                <span>{scriptName}</span>
                <span className="text-[9px] text-amber-400">▾</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setShowBackupModal(true)}
            title="Backup, export, import or reset session"
            className="text-xs text-zinc-300 hover:text-zinc-100 border border-zinc-700 hover:border-zinc-600 bg-zinc-800 hover:bg-zinc-750 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <span>💾</span>
            <span className="hidden sm:inline">Backup & State</span>
          </button>
        </div>
      </header>

      {/* Global Navigation Bar (Mobile Bottom / Desktop Top) */}
      <AppNavBar
        activeView={activeMainView}
        onSelectView={setActiveMainView}
        hasActiveGame={hasActiveGame}
        activePlayerCount={seats.length}
      />

      {/* SECTION 1: HOME */}
      {activeMainView === 'home' && (
        <HomeView
          scriptName={scriptName}
          playerCount={playerCount}
          seats={seats}
          bagRoles={bagRoles}
          gameHistory={gameHistory}
          onNavigate={handleNavigate}
          onStartNewGame={handleStartNewGame}
        />
      )}

      {/* SECTION 2: COMPENDIUM */}
      {activeMainView === 'compendium' && (
        <CompendiumView
          onShowRoleFullscreen={(card) => setFullscreenCard(card)}
        />
      )}

      {/* SECTION 3: SCRIPTS */}
      {activeMainView === 'scripts' && (
        <ScriptsView
          currentScriptName={scriptName}
          onSelectScript={(name, roles) => {
            handleSelectScript(name, roles);
            setActiveMainView('games');
            setGamesInitialSubTab('live');
          }}
          customScripts={customScripts}
          onSaveCustomScript={handleSaveCustomScript}
          onDeleteCustomScript={handleDeleteCustomScript}
        />
      )}

      {/* SECTION 4: GAMES */}
      {activeMainView === 'games' && (
        <GamesView
          scriptName={scriptName}
          playerCount={playerCount}
          onSetPlayerCount={handleSetPlayerCount}
          scriptRoles={scriptRoles}
          bagRoles={bagRoles}
          onToggleRoleInBag={toggleRoleInBag}
          onSetBagRoles={setBagRoles}
          drunkDisguise={drunkDisguise}
          onSetDrunkDisguise={setDrunkDisguise}
          availableTownsfolkForDrunk={availableTownsfolkForDrunk}
          physicalTokensInBag={physicalTokensInBag}
          groupedScript={groupedScript}
          TEAM_STYLES={TEAM_STYLES}
          getRoleInfo={getRoleInfo}
          seats={seats}
          onAssignToken={handleAssignToken}
          onUpdateSeatName={handleUpdateSeatName}
          onToggleDead={handleToggleDead}
          onToggleDrunk={handleToggleDrunk}
          onToggleTraveller={handleToggleTraveller}
          onSetTravellerRole={handleSetTravellerRole}
          onSetTravellerAlignment={handleSetTravellerAlignment}
          onToggleReminder={handleToggleReminder}
          handleAddSeat={handleAddSeat}
          handleAddTraveller={handleAddTraveller}
          handleRemoveSeat={handleRemoveSeat}
          onShowToPlayer={(card) => setFullscreenCard(card)}
          onOpenScriptModal={() => setShowScriptModal(true)}
          onOpenMessages={() => setActiveMainView('messages')}
          gameHistory={gameHistory}
          onFinishGame={handleFinishGame}
          onDeleteHistoryItem={handleDeleteHistoryItem}
          onClearHistory={handleClearHistory}
          activeSubSection={gamesInitialSubTab}
          onSelectSubSection={setGamesInitialSubTab}
          activeLiveTab={gamesInitialLiveTab}
          onSelectLiveTab={setGamesInitialLiveTab}
        />
      )}

      {/* SECTION 5: MESSAGES & BIG TEXT */}
      {activeMainView === 'messages' && (
        <MessagesView
          favoriteMessageIds={favoriteMessageIds}
          onToggleFavorite={handleToggleFavoriteMessage}
          customMessages={customMessages}
          onCreateCustomMessage={handleCreateCustomMessage}
          onDeleteCustomMessage={handleDeleteCustomMessage}
        />
      )}
    </div>
  );
}
