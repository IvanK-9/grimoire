import React, { useState, useMemo } from 'react';

export default function GrimoireCircle({
  seats,
  drunkDisguise,
  physicalTokensInBag,
  getRoleInfo,
  TEAM_STYLES,
  onAssignToken,
  onUpdateSeatName,
  onToggleDead,
  onAddSeat,
  onRemoveSeat,
  onShowToPlayer,
}) {
  const [selectedSeatIdx, setSelectedSeatIdx] = useState(null);
  const [showTokenPicker, setShowTokenPicker] = useState(false);

  const seatCount = seats.length;

  // Oval geometry dimensions
  const containerW = 340;
  const containerH = 430;
  const centerX = containerW / 2;
  const centerY = containerH / 2;
  const rx = 125;
  const ry = 160;

  // Calculate coordinates for each seat
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

  // Find living neighbours for the selected seat
  const livingNeighbours = useMemo(() => {
    if (selectedSeatIdx === null || seatCount < 3) return { left: null, right: null };

    // Search clockwise (right) for living player
    let right = null;
    for (let step = 1; step < seatCount; step++) {
      const idx = (selectedSeatIdx + step) % seatCount;
      if (!seats[idx].isDead) {
        right = idx;
        break;
      }
    }

    // Search counter-clockwise (left) for living player
    let left = null;
    for (let step = 1; step < seatCount; step++) {
      const idx = (selectedSeatIdx - step + seatCount) % seatCount;
      if (!seats[idx].isDead) {
        left = idx;
        break;
      }
    }

    return { left, right };
  }, [selectedSeatIdx, seats, seatCount]);

  const selectedSeat = selectedSeatIdx !== null ? seats[selectedSeatIdx] : null;

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
          
          {selectedSeatIdx !== null && (
            <div className="mt-2 text-[10px] text-amber-300/90 bg-zinc-900/90 px-2 py-1 rounded-lg border border-amber-500/30">
              {livingNeighbours.left !== null && livingNeighbours.right !== null ? (
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

          const drawn = s.drawnToken ? getRoleInfo(s.drawnToken) : null;
          const isDrunk = s.drawnToken && s.drawnToken === drunkDisguise;
          const actual = isDrunk ? getRoleInfo('drunk') : drawn;
          const st = actual ? TEAM_STYLES[actual.team] : null;

          const isSelected = selectedSeatIdx === idx;
          const isNeighbour = livingNeighbours.left === idx || livingNeighbours.right === idx;

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
                    : drawn
                    ? `${st.bg} ${st.border}`
                    : 'bg-zinc-800 border-dashed border-zinc-600'
                }`}
              >
                {drawn ? (
                  <span>{actual.icon}</span>
                ) : (
                  <span className="text-xs text-zinc-500 font-bold">?</span>
                )}

                {/* Seat Number Badge */}
                <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-zinc-950 border border-zinc-700 text-[10px] font-bold flex items-center justify-center text-zinc-300">
                  {s.seat}
                </span>

                {/* Drunk Indicator (ST-only) */}
                {isDrunk && (
                  <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-amber-500 text-zinc-950 px-1 rounded-sm">
                    D
                  </span>
                )}

                {/* Dead Shroud Skull */}
                {s.isDead && (
                  <span className="absolute inset-0 flex items-center justify-center text-sm opacity-90">
                    💀
                  </span>
                )}
              </div>

              {/* Player Name / Short Label */}
              <div className="max-w-[70px] mt-1 text-center">
                <div className="text-[11px] font-bold text-zinc-200 truncate leading-tight">
                  {s.name || `#${s.seat}`}
                </div>
                {drawn && (
                  <div className="text-[9px] text-zinc-400 truncate leading-tight">
                    {drawn.name}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Seat Bar Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onAddSeat}
          className="bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-amber-400 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
        >
          <span>+ Add Seat #{seatCount + 1}</span>
        </button>
        {selectedSeatIdx !== null && (
          <button
            onClick={() => setSelectedSeatIdx(null)}
            className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* Selected Seat Inspector Drawer / Bottom Card */}
      {selectedSeat && (
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-750 rounded-2xl p-4 space-y-3 shadow-xl">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-amber-400">
                #{selectedSeat.seat}
              </span>
              <span className="font-bold text-sm text-zinc-100">
                {selectedSeat.name || `Seat #${selectedSeat.seat}`}
              </span>
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
              placeholder="Enter name (e.g. Patrick, Sergey)..."
              value={selectedSeat.name || ''}
              onChange={(e) => onUpdateSeatName(selectedSeatIdx, e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Assigned Token Info & Actions */}
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="flex items-center gap-2.5 min-w-0">
              {selectedSeat.drawnToken ? (
                <>
                  <span className="text-2xl">{getRoleInfo(selectedSeat.drawnToken).icon}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-zinc-100 truncate">
                      {getRoleInfo(selectedSeat.drawnToken).name}
                      {selectedSeat.drawnToken === drunkDisguise && (
                        <span className="ml-1.5 text-[9px] bg-amber-500 text-zinc-950 px-1 py-0.5 rounded font-black">
                          DRUNK
                        </span>
                      )}
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
              onClick={() => setShowTokenPicker(true)}
              className="shrink-0 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-lg"
            >
              {selectedSeat.drawnToken ? 'Change Role' : '+ Assign'}
            </button>
          </div>

          {/* Actions: Show to Player, Dead/Alive, Remove */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {selectedSeat.drawnToken && (
              <button
                onClick={() => {
                  // Critical: ALWAYS show Townsfolk disguise to player if Drunk! Never leak Drunk role.
                  const isDrunk = selectedSeat.drawnToken === drunkDisguise;
                  const shownRole = isDrunk && drunkDisguise ? getRoleInfo(drunkDisguise) : getRoleInfo(selectedSeat.drawnToken);

                  onShowToPlayer({
                    title: shownRole.name,
                    subtitle: selectedSeat.name ? `Seat #${selectedSeat.seat} • ${selectedSeat.name}` : `Seat #${selectedSeat.seat}`,
                    icon: shownRole.icon,
                    team: shownRole.team,
                    teamLabel: shownRole.team.toUpperCase(),
                    description: shownRole.ability,
                  });
                }}
                className="py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow"
              >
                <span>👁️</span>
                <span>Show to Player</span>
              </button>
            )}

            <button
              onClick={() => onToggleDead(selectedSeatIdx)}
              className={`py-2.5 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border ${
                selectedSeat.isDead
                  ? 'bg-emerald-950/50 border-emerald-600/60 text-emerald-300'
                  : 'bg-zinc-800 hover:bg-zinc-750 border-zinc-700 text-zinc-300'
              }`}
            >
              <span>{selectedSeat.isDead ? '❤️ Revive' : '💀 Mark Dead'}</span>
            </button>

            {seatCount > 5 && (
              <button
                onClick={() => {
                  onRemoveSeat(selectedSeatIdx);
                  setSelectedSeatIdx(null);
                }}
                className="col-span-2 py-2 text-[11px] text-rose-400 hover:text-rose-300 border border-rose-900/40 rounded-xl"
              >
                Remove Seat #{selectedSeat.seat}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal: Token Selector from Bag */}
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
                Seat #{seats[selectedSeatIdx].seat} — Pick Drawn Token
              </span>
              <button
                onClick={() => setShowTokenPicker(false)}
                className="text-zinc-400 px-2 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
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
