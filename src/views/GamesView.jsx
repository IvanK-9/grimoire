import React, { useState, useMemo } from 'react';
import {
  History,
  RotateCcw,
  Flag,
  MessageSquare,
  ArrowRight,
  CircleDot,
  Moon,
  Dices,
  Sparkles,
  Trophy,
  Download,
  Trash2,
  X,
  Eye,
  ScrollText,
  Check,
} from 'lucide-react';
import GrimoireCircle from '../components/GrimoireCircle';
import RoleBalanceTracker from '../components/RoleBalanceTracker';
import NightFlashcards from '../components/NightFlashcards';

export default function GamesView({
  // Game State
  scriptName,
  playerCount,
  onSetPlayerCount,
  scriptRoles,
  bagRoles,
  onToggleRoleInBag,
  onSetBagRoles,
  drunkDisguise,
  onSetDrunkDisguise,
  demonBluffs = [],
  onSetDemonBluffs,
  availableTownsfolkForDrunk,
  physicalTokensInBag,
  groupedScript,
  TEAM_STYLES,
  getRoleInfo,
  seats,
  onAssignToken,
  onUpdateSeatName,
  onToggleDead,
  onToggleGhostVote,
  onUndo,
  canUndo = false,
  undoCount = 0,
  onDigitalDeal,
  onToggleDrunk,
  onToggleTraveller,
  onSetTravellerRole,
  onSetTravellerAlignment,
  onToggleReminder,
  handleAddSeat,
  handleAddTraveller,
  handleRemoveSeat,
  onShowToPlayer,
  _onOpenScriptModal,
  onOpenMessages,
  // History State
  gameHistory = [],
  onFinishGame,
  onDeleteHistoryItem,
  onClearHistory,
  activeSubSection: controlledSubSection,
  onSelectSubSection,
  activeLiveTab: controlledLiveTab,
  onSelectLiveTab,
}) {
  const [localSubSection, setLocalSubSection] = useState('live');
  const [localLiveTab, setLocalLiveTab] = useState('bag');

  const currentSubSection = controlledSubSection !== undefined ? controlledSubSection : localSubSection;
  const setSubSection = onSelectSubSection || setLocalSubSection;

  const currentLiveTab = controlledLiveTab !== undefined ? controlledLiveTab : localLiveTab;
  const setLiveTab = onSelectLiveTab || setLocalLiveTab;

  // Finish Game Modal State
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [finishWinner, setFinishWinner] = useState('good'); // 'good' | 'evil' | 'draw'
  const [finishNotes, setFinishNotes] = useState('');

  // Snapshot Viewer Modal
  const [viewingSnapshot, setViewingSnapshot] = useState(null);

  // Demon Bluffs Modal State
  const [showBluffsModal, setShowBluffsModal] = useState(false);

  // Available good roles not in bag for demon bluffs
  const availableGoodRolesForBluffs = useMemo(() => {
    return scriptRoles
      .map(getRoleInfo)
      .filter((r) => r && (r.team === 'townsfolk' || r.team === 'outsider') && !bagRoles.includes(r.id));
  }, [scriptRoles, bagRoles, getRoleInfo]);

  const handleAutoPickBluffs = () => {
    if (!availableGoodRolesForBluffs.length || !onSetDemonBluffs) return;
    const shuffled = [...availableGoodRolesForBluffs].sort(() => 0.5 - Math.random());
    onSetDemonBluffs(shuffled.slice(0, 3).map((r) => r.id));
  };

  const handleSelectTeam = (teamKey) => {
    const el = document.getElementById(`team-section-${teamKey}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Track unassigned tokens between bag and seats
  const usedTokens = useMemo(() => {
    return seats.map((s) => s.drawnToken).filter(Boolean);
  }, [seats]);

  const unassignedTokens = useMemo(() => {
    return physicalTokensInBag.filter((t) => !usedTokens.includes(t));
  }, [physicalTokensInBag, usedTokens]);

  // Check overall balance status
  const isBalanced = useMemo(() => {
    const rolesWithInfo = bagRoles.map(getRoleInfo).filter(Boolean);
    const selTF = rolesWithInfo.filter((r) => r.team === 'townsfolk').length;
    const selOut = rolesWithInfo.filter((r) => r.team === 'outsider').length;
    const selMin = rolesWithInfo.filter((r) => r.team === 'minion').length;
    const selDem = rolesWithInfo.filter((r) => r.team === 'demon').length;

    const baseTable = {
      5: { townsfolk: 3, outsider: 0, minion: 1, demon: 1 },
      6: { townsfolk: 3, outsider: 1, minion: 1, demon: 1 },
      7: { townsfolk: 5, outsider: 0, minion: 1, demon: 1 },
      8: { townsfolk: 5, outsider: 1, minion: 1, demon: 1 },
      9: { townsfolk: 5, outsider: 2, minion: 1, demon: 1 },
      10: { townsfolk: 7, outsider: 0, minion: 2, demon: 1 },
      11: { townsfolk: 7, outsider: 1, minion: 2, demon: 1 },
      12: { townsfolk: 7, outsider: 2, minion: 2, demon: 1 },
      13: { townsfolk: 9, outsider: 0, minion: 3, demon: 1 },
      14: { townsfolk: 9, outsider: 1, minion: 3, demon: 1 },
      15: { townsfolk: 9, outsider: 2, minion: 3, demon: 1 },
    };
    const b = baseTable[playerCount] || baseTable[8];
    const hasBaron = bagRoles.includes('baron');
    const targetOut = b.outsider + (hasBaron ? 2 : 0);
    const targetTF = Math.max(0, b.townsfolk - (hasBaron ? 2 : 0));
    return (
      bagRoles.length === Number(playerCount) &&
      selTF === targetTF &&
      selOut === targetOut &&
      selMin === b.minion &&
      selDem === b.demon
    );
  }, [bagRoles, playerCount, getRoleInfo]);

  const handleConfirmFinish = () => {
    onFinishGame({
      winner: finishWinner,
      notes: finishNotes.trim(),
    });
    setShowFinishModal(false);
    setFinishNotes('');
    setSubSection('history');
  };

  const handleExportHistory = () => {
    const jsonStr = JSON.stringify(gameHistory, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `botc_games_history_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col select-none animate-fadeIn pb-20 md:pb-8">
      {/* Top Mode Bar: Live Grimoire vs History */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center justify-between sticky top-[53px] md:top-[89px] z-20">
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => setSubSection('live')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              currentSubSection === 'live'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Live Grimoire</span>
          </button>
          <button
            onClick={() => setSubSection('history')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              currentSubSection === 'history'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History ({gameHistory.length})</span>
          </button>
        </div>

        {currentSubSection === 'live' && (
          <div className="flex items-center gap-1.5">
            {onOpenMessages && (
              <button
                onClick={onOpenMessages}
                title="Open Big Text Communicator"
                className="text-xs bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700 font-medium px-2 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-sm active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Big Text</span>
              </button>
            )}
            <button
              onClick={() => setShowFinishModal(true)}
              className="text-xs bg-rose-950/60 hover:bg-rose-900/70 text-rose-200 border border-rose-800/60 font-medium px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-sm active:scale-95"
              title="Archive game to history and declare winner"
            >
              <Flag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Finish Game</span>
            </button>
          </div>
        )}
      </div>

      {/* MODE 1: LIVE GRIMOIRE */}
      {currentSubSection === 'live' && (
        <div className="flex-1 flex flex-col">
          {/* Sub-Tabs: 1. Bag | 2. Table Circle | 3. Prompts */}
          <div className="grid grid-cols-3 bg-zinc-900/90 border-b border-zinc-800 text-xs sm:text-sm font-medium sticky top-[95px] md:top-[131px] z-10 backdrop-blur-sm">
            <button
              onClick={() => setLiveTab('bag')}
              className={`py-2.5 border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                currentLiveTab === 'bag'
                  ? 'border-zinc-200 text-zinc-100 bg-zinc-800/40'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>1. Bag</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isBalanced
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/40'
                    : 'bg-zinc-800 text-zinc-300'
                }`}
              >
                {bagRoles.length}/{playerCount}
              </span>
            </button>

            <button
              onClick={() => setLiveTab('table')}
              className={`py-2.5 border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
                currentLiveTab === 'table'
                  ? 'border-zinc-200 text-zinc-100 bg-zinc-800/40'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>2. Table Circle</span>
              {physicalTokensInBag.length > 0 && (
                <span className="text-[9px] px-1 rounded font-bold bg-zinc-800 text-zinc-300">
                  {usedTokens.length}/{physicalTokensInBag.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setLiveTab('night')}
              className={`py-2.5 border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
                currentLiveTab === 'night'
                  ? 'border-zinc-200 text-zinc-100 bg-zinc-800/40'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>3. Prompts</span>
            </button>
          </div>

          {/* TAB 1: BAG SETUP */}
          {currentLiveTab === 'bag' && (
            <main className="p-4 space-y-5 max-w-lg mx-auto w-full flex-1">
              {/* Player Count */}
              <section className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 shadow-md space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Player Count:
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    5 to 15 players
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                  {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => onSetPlayerCount(num)}
                      className={`w-9 h-9 rounded-xl text-xs shrink-0 transition-colors border cursor-pointer ${
                        playerCount === num
                          ? 'bg-zinc-800 text-zinc-100 border-zinc-500 font-bold shadow-sm'
                          : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </section>

              {/* Good vs Evil Balance Formula & Diagnostic Feedback */}
              <RoleBalanceTracker
                playerCount={playerCount}
                bagRoles={bagRoles}
                getRoleInfo={getRoleInfo}
                onToggleRole={onToggleRoleInBag}
                scriptRoles={scriptRoles}
                onSetBagRoles={onSetBagRoles}
                drunkDisguise={drunkDisguise}
                onSetDrunkDisguise={onSetDrunkDisguise}
                availableTownsfolkForDrunk={availableTownsfolkForDrunk}
                onSelectTeam={handleSelectTeam}
              />

              {/* Quick Digital Deal Action Banner */}
              {bagRoles.length > 0 && onDigitalDeal && (
                <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-md">
                  <div>
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span>🎲</span>
                      <span>Digital Deal Ready ({bagRoles.length} roles in bag)</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">
                      Randomly deal characters to all seats in 1 tap without physical bag tokens.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onDigitalDeal();
                      setCurrentLiveTab('circle');
                    }}
                    className="shrink-0 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold px-3 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <span>Deal to Table</span>
                    <span>➔</span>
                  </button>
                </div>
              )}

              {/* Script Roles Grid */}
              {Object.entries(groupedScript).map(([teamKey, roles]) => {
                if (!roles.length) return null;
                const st = TEAM_STYLES[teamKey] || TEAM_STYLES.unknown;
                return (
                  <section key={teamKey} id={`team-section-${teamKey}`} className="space-y-2 scroll-mt-28">
                    <h2 className={`text-xs font-bold uppercase ${st.text}`}>{st.label}</h2>
                    <div className="grid grid-cols-2 gap-2">
                      {roles.map((r) => {
                        const sel = bagRoles.includes(r.id);
                        const dis = drunkDisguise === r.id;
                        return (
                          <button
                            key={r.id}
                            onClick={() => onToggleRoleInBag(r.id)}
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

              {/* Sticky Customer Journey Action Bar */}
              <div className="sticky bottom-16 md:bottom-4 z-20 pt-4 pb-2">
                {bagRoles.length === Number(playerCount) ? (
                  <button
                    type="button"
                    onClick={() => setLiveTab('table')}
                    className="w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-950/40 cursor-pointer"
                  >
                    <span>Continue to Table Circle</span>
                    <ArrowRight className="w-4 h-4 text-zinc-950" />
                  </button>
                ) : (
                  <div className="w-full py-2.5 px-4 rounded-xl bg-zinc-900/90 border border-zinc-800 backdrop-blur text-xs flex items-center justify-between text-zinc-400 shadow-lg">
                    <span>
                      {bagRoles.length < Number(playerCount)
                        ? `Select ${Number(playerCount) - bagRoles.length} more role${Number(playerCount) - bagRoles.length === 1 ? '' : 's'} to fill bag (${bagRoles.length}/${playerCount})`
                        : `Bag has ${bagRoles.length - Number(playerCount)} too many roles (${bagRoles.length}/${playerCount})`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLiveTab('table')}
                      className="text-xs text-zinc-400 hover:text-zinc-200 underline font-medium px-2 py-1 cursor-pointer"
                    >
                      Skip to Table →
                    </button>
                  </div>
                )}
              </div>
            </main>
          )}

          {/* TAB 2: TABLE CIRCLE */}
          {currentLiveTab === 'table' && (
            <main className="p-4 max-w-lg mx-auto w-full flex-1">
              {/* Town Square Toolbar with Undo */}
              <div className="flex items-center justify-between gap-2 mb-3 bg-zinc-900/70 border border-zinc-800 rounded-xl px-3 py-1.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <CircleDot className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-bold text-zinc-200">Table Circle</span>
                </div>
                {onUndo && (
                  <button
                    type="button"
                    onClick={onUndo}
                    disabled={!canUndo}
                    title={canUndo ? `Undo last change (${undoCount} in history)` : 'No actions to undo'}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                      canUndo
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-amber-300 border-zinc-600 active:scale-95 cursor-pointer'
                        : 'bg-zinc-950/60 text-zinc-600 border-zinc-800/60 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-current" />
                    <span>Undo</span>
                    {undoCount > 0 && (
                      <span className="text-[10px] bg-zinc-900 text-amber-400 font-mono px-1.5 py-0.2 rounded-full border border-amber-500/30">
                        {undoCount}
                      </span>
                    )}
                  </button>
                )}
              </div>

              {/* Unassigned Tokens in Bag Helper Banner (Only visible while seats need assignment) */}
              {unassignedTokens.length > 0 && (
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 mb-3 text-xs shadow-md">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Dices className="w-4 h-4 text-zinc-400" />
                      <span className="font-bold text-zinc-200">
                        Bag Seating: <strong className="text-amber-400">{usedTokens.length}</strong> of {physicalTokensInBag.length} seated
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/40">
                        {unassignedTokens.length} unassigned
                      </span>
                      {unassignedTokens.length > 0 && onDigitalDeal && (
                        <button
                          type="button"
                          onClick={onDigitalDeal}
                          className="text-[10px] font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 px-2 py-0.5 rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                          title="Randomly deal bag characters across empty seats"
                        >
                          <Dices className="w-3 h-3 text-zinc-950" />
                          <span>Deal</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {unassignedTokens.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-zinc-800/80 items-center">
                      <span className="text-[10px] text-zinc-400 uppercase font-semibold">Still in bag:</span>
                      {unassignedTokens.map((tid) => {
                        const rInfo = getRoleInfo(tid);
                        return (
                          <span
                            key={tid}
                            className="text-[11px] bg-zinc-950 text-zinc-200 px-2 py-0.5 rounded-lg border border-zinc-700 flex items-center gap-1 shadow-sm"
                          >
                            <span>{rInfo?.icon || '✦'}</span>
                            <span>{rInfo?.name || tid}</span>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Demon Bluffs Banner */}
              <div className="bg-gradient-to-r from-red-950/40 to-zinc-900 border border-red-950/80 rounded-2xl p-3 mb-3 text-xs shadow-md">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-red-300">
                    <Sparkles className="w-4 h-4 text-rose-400" />
                    <span>Demon Bluffs (3 not-in-play Good roles):</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {availableGoodRolesForBluffs.length >= 3 && onSetDemonBluffs && (
                      <button
                        type="button"
                        onClick={handleAutoPickBluffs}
                        className="text-[10px] font-bold bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-700/60 px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                        title="Randomly pick 3 out-of-play Good roles"
                      >
                        <Dices className="w-3 h-3" />
                        <span>Auto-Roll</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowBluffsModal(true)}
                      className="text-[10px] font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                    >
                      {demonBluffs.length === 3 ? 'Edit ▾' : '+ Select 3'}
                    </button>
                  </div>
                </div>

                {demonBluffs.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-zinc-800/80 items-center justify-between">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {demonBluffs.map((bid) => {
                        const r = getRoleInfo(bid);
                        if (!r) return null;
                        return (
                          <button
                            key={bid}
                            type="button"
                            onClick={() =>
                              onShowToPlayer &&
                              onShowToPlayer({
                                title: r.name,
                                subtitle: 'Demon Bluff (Not in play)',
                                icon: r.icon,
                                description: r.ability,
                                teamLabel: r.team,
                                color: r.team === 'outsider' ? 'cyan' : 'townsfolk',
                              })
                            }
                            title="Click to show role card in fullscreen"
                            className="text-[11px] font-bold bg-zinc-950 hover:bg-zinc-900 text-zinc-100 px-2.5 py-1 rounded-lg border border-red-900/60 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                          >
                            <span>{r.icon}</span>
                            <span>{r.name}</span>
                            <span className="text-[9px] text-zinc-500">↗</span>
                          </button>
                        );
                      })}
                    </div>
                    {demonBluffs.length === 3 && onShowToPlayer && (
                      <button
                        type="button"
                        onClick={() => {
                          const bluffNames = demonBluffs.map((id) => getRoleInfo(id)?.name || id).join(' • ');
                          onShowToPlayer({
                            title: 'DEMON BLUFFS',
                            subtitle: 'These roles are NOT in play',
                            description: bluffNames,
                            color: 'red',
                          });
                        }}
                        className="text-[10px] font-bold text-red-300 hover:text-red-200 hover:underline px-1 py-0.5"
                      >
                        Show All 3 ➔
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-400 mt-1.5 pt-1.5 border-t border-zinc-800/80">
                    No bluffs chosen yet. Tap <strong>Auto-Roll</strong> to pick 3 good characters not in play for the Demon & Spy.
                  </p>
                )}
              </div>

              <GrimoireCircle
                seats={seats}
                drunkDisguise={drunkDisguise}
                physicalTokensInBag={physicalTokensInBag}
                availableTownsfolk={availableTownsfolkForDrunk}
                scriptRoles={scriptRoles}
                scriptName={scriptName}
                getRoleInfo={getRoleInfo}
                TEAM_STYLES={TEAM_STYLES}
                onAssignToken={onAssignToken}
                onUpdateSeatName={onUpdateSeatName}
                onToggleDead={onToggleDead}
                onToggleGhostVote={onToggleGhostVote}
                onToggleDrunk={onToggleDrunk}
                onToggleTraveller={onToggleTraveller}
                onSetTravellerRole={onSetTravellerRole}
                onSetTravellerAlignment={onSetTravellerAlignment}
                onToggleReminder={onToggleReminder}
                onAddSeat={handleAddSeat}
                onAddTraveller={handleAddTraveller}
                onRemoveSeat={handleRemoveSeat}
                onShowToPlayer={onShowToPlayer}
              />
            </main>
          )}

          {/* TAB 3: PROMPTS */}
          {currentLiveTab === 'night' && (
            <NightFlashcards
              scriptRoles={scriptRoles}
              bagRoles={bagRoles}
              drunkDisguise={drunkDisguise}
              demonBluffs={demonBluffs}
              getRoleInfo={getRoleInfo}
              onShowCard={onShowToPlayer}
            />
          )}
        </div>
      )}

      {/* MODE 2: HISTORY OF GAMES */}
      {currentSubSection === 'history' && (
        <main className="p-4 sm:p-6 max-w-2xl mx-auto w-full space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Past Games Archive</span>
              </h2>
              <p className="text-xs text-zinc-400">
                {gameHistory.length} recorded session{gameHistory.length === 1 ? '' : 's'}
              </p>
            </div>

            {gameHistory.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportHistory}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Clear all game history? This cannot be undone.')) {
                      onClearHistory();
                    }
                  }}
                  className="text-xs text-zinc-400 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                  title="Clear history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {gameHistory.length > 0 ? (
            <div className="space-y-3">
              {gameHistory.map((game) => (
                <div
                  key={game.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3 transition-colors hover:border-zinc-700"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-100">{game.scriptName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            game.winner === 'good'
                              ? 'bg-blue-950/50 text-blue-300 border-blue-900/50'
                              : game.winner === 'evil'
                              ? 'bg-rose-950/50 text-rose-300 border-rose-900/50'
                              : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                          }`}
                        >
                          {game.winner === 'good'
                            ? 'Good Wins'
                            : game.winner === 'evil'
                            ? 'Evil Wins'
                            : 'Draw / Abandoned'}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {new Date(game.date).toLocaleDateString()} at{' '}
                        {new Date(game.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                        {game.playerCount} players
                      </p>
                    </div>

                    <button
                      onClick={() => onDeleteHistoryItem(game.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                      title="Delete entry"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {game.notes && (
                    <div className="bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80 text-xs text-zinc-300 italic">
                      "{game.notes}"
                    </div>
                  )}

                  {/* Seat count summary & view snapshot */}
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80 text-xs">
                    <span className="text-zinc-400">
                      {game.seatsSnapshot?.filter((s) => !s.isDead).length || 0} alive at end
                    </span>
                    <button
                      onClick={() => setViewingSnapshot(game)}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 hover:text-zinc-100 border border-zinc-700 rounded-xl font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-zinc-400" />
                      <span>View Final Table</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center space-y-3">
              <ScrollText className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm font-semibold text-zinc-300">No finished games yet</p>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                When you finish a game in the Live Grimoire, tap "Finish Game" to log the winning team, final table layout, and notes here.
              </p>
              <button
                onClick={() => setSubSection('live')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-md active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Go to Live Grimoire</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
              </button>
            </div>
          )}
        </main>
      )}

      {/* FINISH GAME MODAL */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Flag className="w-4 h-4 text-rose-400" />
                <span>Finish & Archive Game</span>
              </h3>
              <button
                onClick={() => setShowFinishModal(false)}
                className="text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Record this game's outcome and final table state into history.
            </p>

            {/* Winner Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase">Who won?</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFinishWinner('good')}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    finishWinner === 'good'
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-750'
                  }`}
                >
                  Good Wins
                </button>
                <button
                  type="button"
                  onClick={() => setFinishWinner('evil')}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    finishWinner === 'evil'
                      ? 'bg-rose-600 text-white border-rose-400 shadow-md'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-750'
                  }`}
                >
                  Evil Wins
                </button>
                <button
                  type="button"
                  onClick={() => setFinishWinner('draw')}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    finishWinner === 'draw'
                      ? 'bg-zinc-700 text-white border-zinc-500 shadow-md'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-750'
                  }`}
                >
                  Draw / Other
                </button>
              </div>
            </div>

            {/* Notes Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase">
                Storyteller Notes (Optional)
              </label>
              <textarea
                value={finishNotes}
                onChange={(e) => setFinishNotes(e.target.value)}
                placeholder="e.g. Slayer shot the Virgin on Day 1. Imp starpassed to Baron on Night 3..."
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowFinishModal(false)}
                className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-semibold rounded-xl text-xs border border-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmFinish}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-md"
              >
                Save to History & Finish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SNAPSHOT VIEWER MODAL */}
      {viewingSnapshot && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-5 space-y-4 max-h-[85vh] flex flex-col shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-2">
                  <span>Table Snapshot:</span>
                  <span className="text-amber-400">{viewingSnapshot.scriptName}</span>
                </h3>
                <p className="text-[11px] text-zinc-400">
                  {new Date(viewingSnapshot.date).toLocaleDateString()} • Result:{' '}
                  <strong className="text-zinc-200 uppercase">{viewingSnapshot.winner}</strong>
                </p>
              </div>
              <button
                onClick={() => setViewingSnapshot(null)}
                className="text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {viewingSnapshot.notes && (
              <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-xs text-zinc-300 italic">
                "{viewingSnapshot.notes}"
              </div>
            )}

            {/* List of seats */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {viewingSnapshot.seatsSnapshot?.map((s) => {
                const roleInfo = s.drawnToken ? getRoleInfo(s.drawnToken) : null;
                return (
                  <div
                    key={s.seat}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      s.isDead
                        ? 'bg-zinc-950/80 border-zinc-800/80 text-zinc-500'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 font-bold flex items-center justify-center text-[10px]">
                        {s.seat}
                      </span>
                      <div>
                        <div className="font-semibold flex items-center gap-1.5">
                          <span>{s.name || `Player ${s.seat}`}</span>
                          {s.isDead && (
                            <span className="text-[10px] text-zinc-500 font-bold">DEAD</span>
                          )}
                        </div>
                        {roleInfo && (
                          <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                            <span>{roleInfo.icon}</span>
                            <span>{roleInfo.name}</span>
                            {s.isDrunk && (
                              <span className="text-[9px] bg-amber-500 text-zinc-950 font-bold px-1 rounded">
                                DRUNK
                              </span>
                            )}
                            {s.isTraveller && (
                              <span className="text-[9px] bg-purple-500 text-white font-bold px-1 rounded">
                                TRAVELLER ({s.travellerAlignment})
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setViewingSnapshot(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 font-bold rounded-xl text-xs cursor-pointer"
              >
                Close Snapshot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEMON BLUFFS SELECTOR MODAL */}
      {showBluffsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowBluffsModal(false)}
        >
          <div
            className="bg-zinc-900 border border-zinc-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scaleUp text-zinc-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-400" />
                <div>
                  <h3 className="font-bold text-zinc-100 text-sm">Select 3 Demon Bluffs</h3>
                  <p className="text-[11px] text-zinc-400">
                    Good roles from this script NOT in play ({demonBluffs.length}/3 chosen)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBluffsModal(false)}
                className="text-zinc-400 hover:text-zinc-100 p-1 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
              {availableGoodRolesForBluffs.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-400">
                  All good roles from the script are already in the bag!
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {availableGoodRolesForBluffs.map((r) => {
                    const isSelected = demonBluffs.includes(r.id);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          if (!onSetDemonBluffs) return;
                          if (isSelected) {
                            onSetDemonBluffs(demonBluffs.filter((id) => id !== r.id));
                          } else {
                            if (demonBluffs.length < 3) {
                              onSetDemonBluffs([...demonBluffs, r.id]);
                            } else {
                              // Replace first and add new
                              onSetDemonBluffs([...demonBluffs.slice(1), r.id]);
                            }
                          }
                        }}
                        className={`text-left p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all active:scale-95 cursor-pointer ${
                          isSelected
                            ? 'bg-rose-950/80 border-rose-500 text-rose-100 shadow-sm'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span>{r.icon}</span>
                          <span className="truncate">{r.name}</span>
                        </div>
                        {isSelected ? (
                          <span className="w-4 h-4 rounded-full bg-rose-500 text-zinc-950 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-zinc-950 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="text-[9px] text-zinc-500 capitalize shrink-0">{r.team}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between gap-2">
              {availableGoodRolesForBluffs.length >= 3 && onSetDemonBluffs && (
                <button
                  type="button"
                  onClick={handleAutoPickBluffs}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 hover:text-zinc-100 font-medium text-xs flex items-center gap-1.5 border border-zinc-700 cursor-pointer"
                >
                  <Dices className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Auto-Roll 3</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowBluffsModal(false)}
                className="ml-auto px-5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
