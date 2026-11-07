import React, { useState, useMemo } from 'react';
import { getScriptTravellers, getAllTravellers } from '../data/travellers';
import { ROLE_REMINDERS_DB, getAvailableReminders, resolveReminderInfo } from '../data/reminders';

export default function GrimoireCircle({
  seats,
  drunkDisguise,
  physicalTokensInBag,
  availableTownsfolk = [],
  scriptRoles = [],
  scriptName = '',
  getRoleInfo,
  TEAM_STYLES,
  onAssignToken,
  onUpdateSeatName,
  onToggleDead,
  onToggleGhostVote,
  onToggleDrunk,
  onToggleTraveller,
  onSetTravellerRole,
  onSetTravellerAlignment,
  onToggleReminder,
  onAddSeat,
  onAddTraveller,
  onRemoveSeat,
  onShowToPlayer,
}) {
  const [selectedSeatIdx, setSelectedSeatIdx] = useState(null);
  const [showTokenPicker, setShowTokenPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('bag'); // 'bag' | 'traveller' | 'drunkDisguise'
  const [travellerFilter, setTravellerFilter] = useState('script'); // 'script' | 'all'
  const [reminderTab, setReminderTab] = useState('in_play'); // 'in_play' | 'all'
  const [customReminderInput, setCustomReminderInput] = useState('');

  const seatCount = seats.length;

  // Oval geometry dimensions
  const containerW = 340;
  const containerH = 430;
  const centerX = containerW / 2;
  const centerY = containerH / 2;
  const rx = 125;
  const ry = 160;

  // Coordinates for each seat around the oval
  const seatPositions = useMemo(() => {
    if (seatCount === 0) return [];
    return seats.map((_, i) => {
      // Start from top (-90 deg) and move clockwise
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / seatCount;
      const x = centerX + rx * Math.cos(angle);
      const y = centerY + ry * Math.sin(angle);
      return { x, y, angle };
    });
  }, [seatCount, centerX, centerY, rx, ry, seats]);

  // Find living neighbours for the selected seat (skips dead AND Travellers per official BotC rules)
  const livingNeighbours = useMemo(() => {
    if (selectedSeatIdx === null || seatCount < 3) return { left: null, right: null };

    // Search clockwise (right) for living, non-traveller player
    let right = null;
    for (let step = 1; step < seatCount; step++) {
      const idx = (selectedSeatIdx + step) % seatCount;
      if (!seats[idx].isDead && !seats[idx].isTraveller) {
        right = idx;
        break;
      }
    }

    // Search counter-clockwise (left) for living, non-traveller player
    let left = null;
    for (let step = 1; step < seatCount; step++) {
      const idx = (selectedSeatIdx - step + seatCount) % seatCount;
      if (!seats[idx].isDead && !seats[idx].isTraveller) {
        left = idx;
        break;
      }
    }

    return { left, right };
  }, [selectedSeatIdx, seats, seatCount]);

  const selectedSeat = selectedSeatIdx !== null ? seats[selectedSeatIdx] : null;

  // Calculate role info for selected seat
  const selectedSeatInfo = useMemo(() => {
    if (!selectedSeat) return null;
    const isDrunk = Boolean(selectedSeat.isDrunk);
    const isTraveller = Boolean(selectedSeat.isTraveller);

    let actualRole = null;
    let shownRole = null;

    if (isDrunk) {
      actualRole = getRoleInfo('drunk');
      const disguiseId = selectedSeat.drawnToken || drunkDisguise || (availableTownsfolk[0]?.id || null);
      shownRole = disguiseId ? getRoleInfo(disguiseId) : null;
    } else if (isTraveller) {
      actualRole = getRoleInfo(selectedSeat.drawnToken || 'gunslinger');
      shownRole = actualRole;
    } else if (selectedSeat.drawnToken) {
      actualRole = getRoleInfo(selectedSeat.drawnToken);
      shownRole = actualRole;
    }

    return { isDrunk, isTraveller, actualRole, shownRole };
  }, [selectedSeat, drunkDisguise, availableTownsfolk, getRoleInfo]);

  // Collect active role IDs (from script roles + seated tokens)
  const activeRoleIds = useMemo(() => {
    const set = new Set();
    if (Array.isArray(scriptRoles)) {
      scriptRoles.forEach((r) => {
        const id = typeof r === 'string' ? r : r?.id;
        if (id) set.add(id);
      });
    }
    seats.forEach((s) => {
      if (s.drawnToken) set.add(s.drawnToken);
    });
    return Array.from(set);
  }, [scriptRoles, seats]);

  // Reminders for active roles in game + generic
  const inPlayReminders = useMemo(() => {
    return getAvailableReminders(activeRoleIds);
  }, [activeRoleIds]);

  // All reminders across all canonical roles in database
  const allRemindersList = useMemo(() => {
    return getAvailableReminders(Object.keys(ROLE_REMINDERS_DB));
  }, []);

  // Travellers list filtered by script or showing all
  const displayedTravellers = useMemo(() => {
    if (travellerFilter === 'all') {
      return getAllTravellers();
    }
    const list = getScriptTravellers(scriptName);
    return list.length > 0 ? list : getAllTravellers();
  }, [travellerFilter, scriptName]);

  // Show to Player action — strictly protects Drunk secrecy
  const handleShowToPlayer = () => {
    if (!selectedSeat || !selectedSeatInfo) return;

    if (selectedSeatInfo.isDrunk) {
      const disguise = selectedSeatInfo.shownRole || (availableTownsfolk[0] ? getRoleInfo(availableTownsfolk[0].id) : null);
      if (!disguise) return;
      onShowToPlayer({
        title: disguise.name,
        subtitle: selectedSeat.name ? `Seat #${selectedSeat.seat} • ${selectedSeat.name}` : `Seat #${selectedSeat.seat}`,
        icon: disguise.icon,
        team: 'townsfolk',
        teamLabel: 'TOWNSFOLK',
        description: disguise.ability,
      });
      return;
    }

    if (selectedSeatInfo.isTraveller) {
      const trav = selectedSeatInfo.actualRole || { name: 'Traveller', icon: '🧳', ability: 'Traveller character' };
      const alignLabel = selectedSeat.travellerAlignment === 'evil' ? 'EVIL TRAVELLER' : 'GOOD TRAVELLER';
      onShowToPlayer({
        title: trav.name,
        subtitle: selectedSeat.name ? `Seat #${selectedSeat.seat} • ${selectedSeat.name}` : `Seat #${selectedSeat.seat}`,
        icon: trav.icon,
        team: selectedSeat.travellerAlignment === 'evil' ? 'demon' : 'townsfolk',
        teamLabel: alignLabel,
        description: trav.ability,
      });
      return;
    }

    if (selectedSeat.drawnToken) {
      const role = getRoleInfo(selectedSeat.drawnToken);
      onShowToPlayer({
        title: role.name,
        subtitle: selectedSeat.name ? `Seat #${selectedSeat.seat} • ${selectedSeat.name}` : `Seat #${selectedSeat.seat}`,
        icon: role.icon,
        team: role.team,
        teamLabel: role.team.toUpperCase(),
        description: role.ability,
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 pb-20 select-none">
      {/* Table Canvas */}
      <div className="relative w-[340px] h-[430px] my-2 bg-radial from-zinc-900/90 to-zinc-950 rounded-full border-2 border-dashed border-amber-500/20 shadow-2xl flex items-center justify-center">
        {/* Center of the Grimoire */}
        <div className="text-center pointer-events-none z-0 p-4">
          <div className="text-[10px] tracking-widest font-black uppercase text-amber-500/70">
            Grimoire Table
          </div>
          <div className="text-2xl font-black text-zinc-100 tracking-tight">
            {seats.filter((s) => !s.isDead).length} / {seats.length}
          </div>
          <div className="text-[11px] text-zinc-400 font-medium">Alive Players</div>

          {/* Ghost Vote Total */}
          {seats.some((s) => s.isDead) && (
            <div className="mt-1 text-[11px] font-bold text-zinc-300 flex items-center justify-center gap-1">
              <span>👻</span>
              <span>
                {seats.filter((s) => s.isDead && s.hasGhostVote !== false).length} / {seats.filter((s) => s.isDead).length}
              </span>
              <span className="text-[10px] text-zinc-400 font-normal">ghost votes</span>
            </div>
          )}

          {selectedSeatIdx !== null && (
            <div className="mt-2 text-[10px] text-amber-300/90 bg-zinc-900/90 px-2 py-1 rounded-lg border border-amber-500/30">
              {selectedSeat?.isTraveller ? (
                <span>🧳 Traveller (Abilities skip Travellers)</span>
              ) : livingNeighbours.left !== null && livingNeighbours.right !== null ? (
                <>
                  Neighbours: #{seats[livingNeighbours.left].seat} & #{seats[livingNeighbours.right].seat}
                </>
              ) : (
                'No living neighbours'
              )}
            </div>
          )}
        </div>

        {/* Circular Seat Nodes */}
        {seats.map((s, idx) => {
          const pos = seatPositions[idx];
          if (!pos) return null;

          const isDrunk = Boolean(s.isDrunk);
          const isTraveller = Boolean(s.isTraveller);
          const drawn = s.drawnToken ? getRoleInfo(s.drawnToken) : null;
          const actual = isDrunk ? getRoleInfo('drunk') : drawn;
          const shown = isDrunk && s.drawnToken ? getRoleInfo(s.drawnToken) : drawn;
          const st = actual ? TEAM_STYLES[actual.team] || TEAM_STYLES.unknown : null;

          const isSelected = selectedSeatIdx === idx;
          const isNeighbour = livingNeighbours.left === idx || livingNeighbours.right === idx;
          const reminders = s.reminders || [];

          return (
            <div
              key={s.seat}
              onClick={() => setSelectedSeatIdx(idx)}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute cursor-pointer transition-all duration-200 z-10 flex flex-col items-center ${
                isSelected
                  ? 'scale-115 z-20'
                  : isNeighbour
                  ? 'scale-105 ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-950'
                  : 'hover:scale-105'
              }`}
            >
              {/* Token Avatar */}
              <div
                className={`relative w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg border-2 ${
                  s.isDead
                    ? 'bg-zinc-900 border-zinc-700 opacity-60 grayscale'
                    : isTraveller
                    ? 'bg-purple-950/80 border-purple-500 shadow-purple-950'
                    : shown
                    ? `${st?.bg} ${st?.border}`
                    : 'bg-zinc-800 border-dashed border-zinc-600'
                }`}
              >
                {shown ? (
                  <span>{shown.icon}</span>
                ) : (
                  <span className="text-xs text-zinc-500 font-bold">?</span>
                )}

                {/* Seat Number Badge */}
                <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-zinc-950 border border-zinc-700 text-[10px] font-bold flex items-center justify-center text-zinc-300">
                  {s.seat}
                </span>

                {/* Drunk Indicator (ST-only secret badge) */}
                {isDrunk && (
                  <span
                    title="Drunk: Secretly thinks they are Townsfolk"
                    className="absolute -bottom-1 -right-1 text-[9px] font-black bg-amber-500 text-zinc-950 px-1 rounded-sm shadow-md"
                  >
                    🍺
                  </span>
                )}

                {/* Traveller Badge */}
                {isTraveller && !isDrunk && (
                  <span
                    title="Traveller"
                    className="absolute -bottom-1 -right-1 text-[9px] font-black bg-purple-600 text-white px-1 rounded-sm shadow-md"
                  >
                    🧳
                  </span>
                )}

                {/* Canonical Reminder Badge on Avatar (ST & Spy) */}
                {reminders.length > 0 && (
                  <div
                    title={`Reminders: ${reminders.map((r) => resolveReminderInfo(r).label).join(', ')}`}
                    className="absolute -top-1.5 -right-1.5 flex items-center bg-zinc-950 border border-amber-500/70 rounded-full px-1 py-0.2 shadow-md z-20"
                  >
                    <span className="text-[10px] leading-none">{resolveReminderInfo(reminders[0]).icon}</span>
                    {reminders.length > 1 && (
                      <span className="text-[8px] font-black text-amber-300 ml-0.5 leading-none">
                        +{reminders.length - 1}
                      </span>
                    )}
                  </div>
                )}

                {/* Dead Shroud Skull */}
                {s.isDead && (
                  <span className="absolute inset-0 flex items-center justify-center text-sm opacity-90">
                    💀
                  </span>
                )}
              </div>

              {/* Ghost Vote Badge for Dead Players */}
              {s.isDead && (
                <div className="mt-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleGhostVote) onToggleGhostVote(idx);
                    }}
                    title={s.hasGhostVote !== false ? 'Ghost Vote Available (Click to mark spent)' : 'Ghost Vote Spent (Click to restore)'}
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border transition-all ${
                      s.hasGhostVote !== false
                        ? 'bg-zinc-800 text-zinc-100 border-zinc-400 shadow-sm animate-pulse hover:bg-zinc-700'
                        : 'bg-zinc-950/80 text-zinc-600 border-zinc-800 line-through opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span>👻</span>
                    <span>{s.hasGhostVote !== false ? 'Vote' : 'Spent'}</span>
                  </button>
                </div>
              )}

              {/* Player Name / Short Label */}
              <div className="max-w-[76px] mt-1 text-center">
                <div className="text-[11px] font-bold text-zinc-200 truncate leading-tight">
                  {s.name || `#${s.seat}`}
                </div>
                {shown && (
                  <div className="text-[9px] text-zinc-400 truncate leading-tight">
                    {isDrunk ? `${shown.name}*` : shown.name}
                  </div>
                )}

                {/* Canonical Reminder Tokens on Seat (Vital for ST & Spy) */}
                {reminders.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-0.5 max-w-[84px] mt-0.5">
                    {reminders.map((remId) => {
                      const info = resolveReminderInfo(remId);
                      return (
                        <span
                          key={remId}
                          title={info.label}
                          className="inline-flex items-center gap-0.5 text-[8px] bg-zinc-950/90 text-amber-300 border border-amber-500/40 rounded px-1 py-0.2 leading-tight shadow-sm"
                        >
                          <span className="text-[8px]">{info.icon}</span>
                          <span className="truncate max-w-[48px] font-medium">{info.label}</span>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Seat Bar Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={onAddSeat}
          className="bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-amber-400 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
        >
          <span>+ Add Seat #{seatCount + 1}</span>
        </button>

        <button
          onClick={onAddTraveller}
          className="bg-purple-950/70 hover:bg-purple-900 border border-purple-500/50 text-purple-300 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
        >
          <span>+ Add Traveller 🧳</span>
        </button>

        {selectedSeatIdx !== null && (
          <button
            onClick={() => setSelectedSeatIdx(null)}
            className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl hover:text-zinc-200"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* Selected Seat Inspector Drawer / Bottom Card */}
      {selectedSeat && selectedSeatInfo && (
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-750 rounded-2xl p-4 space-y-3.5 shadow-xl">
          {/* Header: Seat Number & Name */}
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-amber-400">
                #{selectedSeat.seat}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-zinc-100">
                  {selectedSeat.name || `Seat #${selectedSeat.seat}`}
                </span>
                {selectedSeatInfo.isTraveller && (
                  <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-600/40 px-1.5 py-0.5 rounded font-bold">
                    🧳 Traveller
                  </span>
                )}
                {selectedSeatInfo.isDrunk && (
                  <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-600/40 px-1.5 py-0.5 rounded font-bold">
                    🍺 Drunk
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedSeatIdx(null)}
              className="text-zinc-400 hover:text-zinc-200 text-xs px-2"
            >
              ✕ Close
            </button>
          </div>

          {/* Player Name Input */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Player Name
            </label>
            <input
              type="text"
              placeholder="Enter player name (e.g. Patrick, Sergey)..."
              value={selectedSeat.name || ''}
              onChange={(e) => onUpdateSeatName(selectedSeatIdx, e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Model { shown, actual } — Drunk / Traveller / Normal Identity Card */}
          {selectedSeatInfo.isDrunk ? (
            /* DRUNK SPECIAL CARD */
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🍺</span>
                  <div>
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span>The Drunk (Outsider)</span>
                      <span className="text-[9px] bg-amber-500 text-zinc-950 px-1 rounded font-black">
                        SECRET
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-300 mt-0.5">
                      Thinks they are: <b className="text-amber-200">{selectedSeatInfo.shownRole?.name}</b>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPickerMode('drunkDisguise');
                    setShowTokenPicker(true);
                  }}
                  className="text-xs bg-amber-900/60 hover:bg-amber-800/80 border border-amber-500/50 text-amber-200 px-2.5 py-1 rounded-lg font-semibold"
                >
                  Change Disguise
                </button>
              </div>

              <div className="text-[11px] text-amber-400/80 bg-zinc-950/60 p-2 rounded-lg border border-amber-500/20">
                🔒 <b>Anti-leak:</b> Pressing <i>Show to Player</i> will only show the Townsfolk card ({selectedSeatInfo.shownRole?.name}). The player will never know they are The Drunk!
              </div>
            </div>
          ) : selectedSeatInfo.isTraveller ? (
            /* TRAVELLER CARD */
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedSeatInfo.actualRole?.icon || '🧳'}</span>
                  <div>
                    <div className="text-xs font-bold text-purple-200">
                      {selectedSeatInfo.actualRole?.name || 'Traveller'}
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Official Traveller • Does not count in bag balance
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPickerMode('traveller');
                    setShowTokenPicker(true);
                  }}
                  className="text-xs bg-purple-900/70 hover:bg-purple-800 border border-purple-500/50 text-purple-200 px-2.5 py-1 rounded-lg font-semibold"
                >
                  Change Character
                </button>
              </div>

              {/* Storyteller Alignment Choice for Traveller */}
              <div className="flex items-center justify-between pt-1 border-t border-purple-900/60 text-xs">
                <span className="text-zinc-400 font-medium">Traveller Alignment:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSetTravellerAlignment(selectedSeatIdx, 'good')}
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border transition-colors ${
                      selectedSeat.travellerAlignment !== 'evil'
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    😇 Good
                  </button>
                  <button
                    onClick={() => onSetTravellerAlignment(selectedSeatIdx, 'evil')}
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border transition-colors ${
                      selectedSeat.travellerAlignment === 'evil'
                        ? 'bg-red-600 border-red-400 text-white'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    😈 Evil
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* STANDARD ROLE CARD */
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center gap-2.5 min-w-0">
                {selectedSeat.drawnToken ? (
                  <>
                    <span className="text-2xl">{getRoleInfo(selectedSeat.drawnToken).icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-100 truncate">
                        {getRoleInfo(selectedSeat.drawnToken).name}
                      </div>
                      <div className="text-[10px] uppercase text-zinc-400">
                        {getRoleInfo(selectedSeat.drawnToken).team}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-zinc-500 italic">No token assigned yet</div>
                )}
              </div>

              <button
                onClick={() => {
                  setPickerMode('bag');
                  setShowTokenPicker(true);
                }}
                className="shrink-0 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-lg"
              >
                {selectedSeat.drawnToken ? 'Change Role' : '+ Assign'}
              </button>
            </div>
          )}

          {/* Quick Identity Toggles: Make Drunk / Make Traveller */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => onToggleDrunk(selectedSeatIdx)}
              className={`flex-1 py-1.5 px-2 rounded-xl border font-semibold flex items-center justify-center gap-1 transition-colors ${
                selectedSeatInfo.isDrunk
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <span>🍺</span>
              <span>{selectedSeatInfo.isDrunk ? 'Remove Drunk' : 'Is The Drunk'}</span>
            </button>

            <button
              onClick={() => onToggleTraveller(selectedSeatIdx)}
              className={`flex-1 py-1.5 px-2 rounded-xl border font-semibold flex items-center justify-center gap-1 transition-colors ${
                selectedSeatInfo.isTraveller
                  ? 'bg-purple-950/80 border-purple-500 text-purple-300'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <span>🧳</span>
              <span>{selectedSeatInfo.isTraveller ? 'Townsperson' : 'Mark Traveller'}</span>
            </button>
          </div>

          {/* Canonical Role Reminder Tokens (Essential for ST & Spy) */}
          <div className="space-y-2 pt-1 border-t border-zinc-800">
            {/* Active tokens currently placed on this seat */}
            {selectedSeat.reminders && selectedSeat.reminders.length > 0 && (
              <div className="p-2 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                  <span>Tokens on this seat ({selectedSeat.reminders.length}):</span>
                  <span className="text-[9px] text-zinc-500 font-normal">Tap to remove</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSeat.reminders.map((remId) => {
                    const info = resolveReminderInfo(remId);
                    return (
                      <button
                        key={remId}
                        type="button"
                        onClick={() => onToggleReminder(selectedSeatIdx, remId)}
                        className="text-xs font-semibold px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-rose-950/40 border border-amber-500/70 hover:border-rose-500 text-amber-200 hover:text-rose-200 transition-all flex items-center gap-1 shadow-sm"
                        title="Click to remove token from seat"
                      >
                        <span>{info.icon}</span>
                        <span>{info.label}</span>
                        <span className="text-[10px] text-rose-400 font-bold ml-0.5">✕</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reminder Tokens Picker */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Add Reminder Token:
                </div>
                <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setReminderTab('in_play')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                      reminderTab === 'in_play'
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Script ({inPlayReminders.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setReminderTab('all')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                      reminderTab === 'all'
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    All Roles ({allRemindersList.length})
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {(reminderTab === 'in_play' ? inPlayReminders : allRemindersList).map((rem) => {
                  const active = (selectedSeat.reminders || []).includes(rem.id);
                  return (
                    <button
                      key={rem.id}
                      type="button"
                      onClick={() => onToggleReminder(selectedSeatIdx, rem.id)}
                      className={`text-[11px] font-semibold px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                        active
                          ? 'bg-amber-500/25 border-amber-400 text-amber-100 shadow-sm'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <span>{rem.icon}</span>
                      <span>{rem.label}</span>
                      {active && <span className="text-[10px] text-amber-400 font-black ml-0.5">✓</span>}
                    </button>
                  );
                })}
              </div>

              {/* Custom Quick Token Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (customReminderInput.trim()) {
                    onToggleReminder(selectedSeatIdx, customReminderInput.trim());
                    setCustomReminderInput('');
                  }
                }}
                className="flex items-center gap-1.5 pt-1"
              >
                <input
                  type="text"
                  placeholder="Custom token label..."
                  value={customReminderInput}
                  onChange={(e) => setCustomReminderInput(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/60"
                />
                <button
                  type="submit"
                  disabled={!customReminderInput.trim()}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-750 disabled:opacity-40 text-amber-300 text-xs font-bold rounded-lg border border-zinc-700 transition-colors"
                >
                  + Add
                </button>
              </form>
            </div>
          </div>

          {/* Primary Action: Show Character to Player */}
          {(selectedSeat.drawnToken || selectedSeatInfo.isDrunk || selectedSeatInfo.isTraveller) && (
            <div>
              <button
                onClick={handleShowToPlayer}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow"
              >
                <span>👁️</span>
                <span>Show Character to Player</span>
              </button>
              <div className="text-[10px] text-zinc-400 text-center mt-1">
                {selectedSeatInfo.isDrunk
                  ? `🔒 Safe: Displays only ${selectedSeatInfo.shownRole?.name} card.`
                  : 'Displays high-contrast fullscreen card.'}
              </div>
            </div>
          )}

          {/* Ghost Vote Toggle for Dead Player */}
          {selectedSeat.isDead && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => onToggleGhostVote && onToggleGhostVote(selectedSeatIdx)}
                className={`w-full py-2 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border transition-all ${
                  selectedSeat.hasGhostVote !== false
                    ? 'bg-zinc-800 hover:bg-zinc-750 border-zinc-500 text-zinc-100 shadow-sm'
                    : 'bg-zinc-950 hover:bg-zinc-900 border-zinc-800 text-zinc-500 line-through'
                }`}
              >
                <span>👻</span>
                <span>
                  Ghost Vote: {selectedSeat.hasGhostVote !== false ? 'Available (1 vote ready)' : 'Spent (0 votes left)'}
                </span>
                <span className="text-[10px] text-zinc-400 font-normal">
                  ({selectedSeat.hasGhostVote !== false ? 'tap to spend' : 'tap to restore'})
                </span>
              </button>
            </div>
          )}

          {/* Mark Dead & Remove Seat Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800">
            <button
              onClick={() => onToggleDead(selectedSeatIdx)}
              className={`py-2 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border ${
                selectedSeat.isDead
                  ? 'bg-emerald-950/50 border-emerald-600/60 text-emerald-300'
                  : 'bg-zinc-800 hover:bg-zinc-750 border-zinc-700 text-zinc-300'
              }`}
            >
              <span>{selectedSeat.isDead ? '❤️ Revive Player' : '💀 Mark Dead'}</span>
            </button>

            <button
              onClick={() => {
                onRemoveSeat(selectedSeatIdx);
                setSelectedSeatIdx(null);
              }}
              className="py-2 text-[11px] text-rose-400 hover:text-rose-300 border border-rose-900/40 rounded-xl hover:bg-rose-950/20"
            >
              Remove Seat #{selectedSeat.seat}
            </button>
          </div>
        </div>
      )}

      {/* Modal: Token Selector (Bag / Traveller / Drunk Disguise) */}
      {showTokenPicker && selectedSeatIdx !== null && (
        <div
          className="fixed inset-0 z-40 bg-black/80 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowTokenPicker(false)}
        >
          <div
            className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <span className="font-bold text-sm text-zinc-100">
                {pickerMode === 'traveller'
                  ? `Seat #${seats[selectedSeatIdx].seat} — Pick Traveller`
                  : pickerMode === 'drunkDisguise'
                  ? `Seat #${seats[selectedSeatIdx].seat} — Pick Townsfolk Disguise`
                  : `Seat #${seats[selectedSeatIdx].seat} — Pick Token from Bag`}
              </span>
              <button
                onClick={() => setShowTokenPicker(false)}
                className="text-zinc-400 px-2 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Content for TRAVELLERS */}
            {pickerMode === 'traveller' && (
              <div className="space-y-2.5">
                {/* Script vs All Travellers Toggle */}
                <div className="flex items-center justify-between gap-1 pb-1 border-b border-zinc-800 text-xs">
                  <div className="text-[11px] text-zinc-400 font-medium">
                    Filter Travellers:
                  </div>
                  <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setTravellerFilter('script')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                        travellerFilter === 'script'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      ⭐ Script ({getScriptTravellers(scriptName).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setTravellerFilter('all')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                        travellerFilter === 'all'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      🌐 All ({getAllTravellers().length})
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-0.5">
                  {displayedTravellers.map((t) => {
                    const isCurrent = seats[selectedSeatIdx].drawnToken === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          onSetTravellerRole(selectedSeatIdx, t.id);
                          setShowTokenPicker(false);
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-colors flex flex-col justify-between ${
                          isCurrent
                            ? 'border-purple-400 bg-purple-500/20'
                            : 'bg-zinc-800 hover:bg-zinc-750 border-zinc-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm flex items-center justify-between gap-1 text-zinc-100">
                            <span className="flex items-center gap-1.5 truncate">
                              <span>{t.icon}</span>
                              <span className="truncate">{t.name}</span>
                            </span>
                            {t.isExperimental ? (
                              <span className="shrink-0 text-[8px] uppercase font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 py-0.2 rounded">
                                Exp
                              </span>
                            ) : (
                              <span className="shrink-0 text-[8px] uppercase font-bold text-purple-300/80 bg-purple-950/60 px-1 py-0.2 rounded border border-purple-800/40">
                                {t.edition.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-1 line-clamp-3 leading-relaxed">
                            {t.ability}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Content for DRUNK DISGUISE */}
            {pickerMode === 'drunkDisguise' && (
              <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
                {availableTownsfolk.map((tf) => {
                  const isCurrent = seats[selectedSeatIdx].drawnToken === tf.id;
                  return (
                    <button
                      key={tf.id}
                      onClick={() => {
                        onAssignToken(selectedSeatIdx, tf.id);
                        setShowTokenPicker(false);
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                        isCurrent
                          ? 'border-amber-400 bg-amber-500/20'
                          : 'bg-zinc-800 hover:bg-zinc-750 border-zinc-700'
                      }`}
                    >
                      <div className="font-bold text-sm flex items-center gap-1.5 text-zinc-100">
                        <span>{tf.icon}</span>
                        <span className="truncate">{tf.name}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Townsfolk disguise</div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Content for REGULAR TOKENS FROM BAG */}
            {pickerMode === 'bag' && (
              <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
                {physicalTokensInBag.map((tid) => {
                  const info = getRoleInfo(tid);
                  const taken = seats.find((x) => x.drawnToken === tid);
                  const isCurrent = seats[selectedSeatIdx].drawnToken === tid;

                  return (
                    <button
                      key={tid}
                      disabled={taken && !isCurrent}
                      onClick={() => {
                        onAssignToken(selectedSeatIdx, tid);
                        setShowTokenPicker(false);
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                        isCurrent
                          ? 'border-amber-400 bg-amber-500/20'
                          : taken
                          ? 'opacity-40 bg-zinc-950 border-zinc-800 cursor-not-allowed'
                          : 'bg-zinc-800 hover:bg-zinc-750 border-zinc-700'
                      }`}
                    >
                      <div className="font-bold text-sm flex items-center gap-1.5 text-zinc-100">
                        <span>{info.icon}</span>
                        <span className="truncate">{info.name}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">
                        {taken ? `Seat #${taken.seat}` : 'In bag'}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {seats[selectedSeatIdx].drawnToken && (
              <button
                onClick={() => {
                  onAssignToken(selectedSeatIdx, null);
                  setShowTokenPicker(false);
                }}
                className="w-full py-2 text-xs text-rose-400 border border-rose-900/40 rounded-xl hover:bg-rose-950/20"
              >
                Clear Token from Seat
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
