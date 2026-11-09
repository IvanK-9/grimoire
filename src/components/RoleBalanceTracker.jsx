import React from 'react';

const PLAYER_COUNT_TABLE = {
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

export default function RoleBalanceTracker({
  playerCount = 8,
  bagRoles = [],
  getRoleInfo,
  onToggleRole,
  scriptRoles = [],
  onSetBagRoles,
  drunkDisguise = '',
  onSetDrunkDisguise,
  availableTownsfolkForDrunk = [],
  onSelectTeam,
}) {
  const numericCount = Number(playerCount) || 8;
  const base = PLAYER_COUNT_TABLE[numericCount] || PLAYER_COUNT_TABLE[8];
  const hasBaron = bagRoles.includes('baron');

  // Official Baron modifier: +2 Outsiders, -2 Townsfolk
  const targetOutsiders = base.outsider + (hasBaron ? 2 : 0);
  const targetTownsfolk = Math.max(0, base.townsfolk - (hasBaron ? 2 : 0));
  const targetMinions = base.minion;
  const targetDemons = base.demon;

  const targetGood = targetTownsfolk + targetOutsiders;
  const targetEvil = targetMinions + targetDemons;

  const rolesWithInfo = bagRoles.map(getRoleInfo).filter(Boolean);
  const selTownsfolk = rolesWithInfo.filter((r) => r.team === 'townsfolk');
  const selOutsiders = rolesWithInfo.filter((r) => r.team === 'outsider');
  const selMinions = rolesWithInfo.filter((r) => r.team === 'minion');
  const selDemons = rolesWithInfo.filter((r) => r.team === 'demon');
  const selUnknown = rolesWithInfo.filter((r) => r.team === 'unknown');

  const currentGood = selTownsfolk.length + selOutsiders.length;
  const currentEvil = selMinions.length + selDemons.length;
  const totalSelected = bagRoles.length;

  const isBalanced =
    totalSelected === numericCount &&
    selTownsfolk.length === targetTownsfolk &&
    selOutsiders.length === targetOutsiders &&
    selMinions.length === targetMinions &&
    selDemons.length === targetDemons;

  // Live balance discrepancies (diagnostics)
  const discrepancies = [];
  if (selTownsfolk.length < targetTownsfolk) {
    discrepancies.push({ label: `+${targetTownsfolk - selTownsfolk.length} Townsfolk`, type: 'need', color: 'bg-blue-950/80 text-blue-300 border-blue-500/50' });
  } else if (selTownsfolk.length > targetTownsfolk) {
    discrepancies.push({ label: `-${selTownsfolk.length - targetTownsfolk} Townsfolk`, type: 'excess', color: 'bg-rose-950/80 text-rose-300 border-rose-500/50' });
  }

  if (selOutsiders.length < targetOutsiders) {
    discrepancies.push({ label: `+${targetOutsiders - selOutsiders.length} Outsider`, type: 'need', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50' });
  } else if (selOutsiders.length > targetOutsiders) {
    discrepancies.push({ label: `-${selOutsiders.length - targetOutsiders} Outsider`, type: 'excess', color: 'bg-rose-950/80 text-rose-300 border-rose-500/50' });
  }

  if (selMinions.length < targetMinions) {
    discrepancies.push({ label: `+${targetMinions - selMinions.length} Minion`, type: 'need', color: 'bg-orange-950/80 text-orange-300 border-orange-500/50' });
  } else if (selMinions.length > targetMinions) {
    discrepancies.push({ label: `-${selMinions.length - targetMinions} Minion`, type: 'excess', color: 'bg-rose-950/80 text-rose-300 border-rose-500/50' });
  }

  if (selDemons.length < targetDemons) {
    discrepancies.push({ label: `+${targetDemons - selDemons.length} Demon`, type: 'need', color: 'bg-red-950/80 text-red-300 border-red-500/50' });
  } else if (selDemons.length > targetDemons) {
    discrepancies.push({ label: `-${selDemons.length - targetDemons} Demon`, type: 'excess', color: 'bg-rose-950/80 text-rose-300 border-rose-500/50' });
  }

  // 1-Click Auto-Fill Balanced Bag
  const handleAutoFillBag = () => {
    if (!scriptRoles?.length || !onSetBagRoles) return;
    const scriptInfo = scriptRoles.map(getRoleInfo).filter(Boolean);

    const tfPool = scriptInfo.filter((r) => r.team === 'townsfolk');
    const outPool = scriptInfo.filter((r) => r.team === 'outsider');
    const minPool = scriptInfo.filter((r) => r.team === 'minion');
    const demPool = scriptInfo.filter((r) => r.team === 'demon');

    const chosenTf = tfPool.slice(0, targetTownsfolk);
    const chosenOut = outPool.slice(0, targetOutsiders);
    const chosenMin = minPool.slice(0, targetMinions);
    const chosenDem = demPool.slice(0, targetDemons);

    const chosen = [
      ...chosenTf.map((r) => r.id),
      ...chosenOut.map((r) => r.id),
      ...chosenMin.map((r) => r.id),
      ...chosenDem.map((r) => r.id),
    ];
    onSetBagRoles(chosen);

    // If Drunk is in chosen Outsiders, automatically assign an unused Townsfolk disguise
    if (chosen.includes('drunk') && onSetDrunkDisguise) {
      const chosenTfIds = chosenTf.map((r) => r.id);
      const unusedTf = tfPool.find((tf) => !chosenTfIds.includes(tf.id));
      if (unusedTf) {
        onSetDrunkDisguise(unusedTf.id);
      }
    }
  };

  const handleClearBag = () => {
    if (onSetBagRoles) onSetBagRoles([]);
    if (onSetDrunkDisguise) onSetDrunkDisguise('');
  };

  const renderSlots = (selected, target, colors, label, teamKey) => {
    const slotCount = Math.max(target, selected.length);
    const slots = [];

    for (let i = 0; i < slotCount; i++) {
      const role = selected[i];
      if (role) {
        slots.push(
          <button
            key={role.id}
            type="button"
            onClick={() => onToggleRole(role.id)}
            title={`Remove ${role.name} from bag`}
            className={`group inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold shadow-sm transition-transform active:scale-95 border ${colors.badgeBg} ${colors.border} text-white`}
          >
            <span className="text-sm shrink-0">{role.icon}</span>
            <span className="truncate max-w-[80px] sm:max-w-[100px]">{role.name}</span>
            <span className="text-[10px] text-zinc-400 group-hover:text-rose-300 ml-0.5 font-bold">✕</span>
          </button>
        );
      } else {
        slots.push(
          <button
            key={`empty-${i}`}
            type="button"
            onClick={() => onSelectTeam && onSelectTeam(teamKey)}
            title={`Tap to jump to ${label} selection`}
            className={`inline-flex items-center justify-center px-2 py-1 rounded-lg text-[11px] border border-dashed ${colors.emptyBorder} ${colors.emptyBg} ${colors.emptyText} hover:brightness-125 cursor-pointer active:scale-95 transition-all`}
          >
            <span>+ {label}</span>
          </button>
        );
      }
    }
    return slots;
  };

  return (
    <section className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 space-y-3 shadow-lg">
      {/* Header with High-Level Formula and Status Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-zinc-800/80">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <span>Official Balance Breakdown:</span>
          </div>
          <div className="text-xs font-semibold text-zinc-200 mt-0.5">
            <span className="text-blue-400 font-bold">{targetGood} Good</span>
            <span className="text-zinc-500 mx-1.5">vs</span>
            <span className="text-red-400 font-bold">{targetEvil} Evil</span>
            <span className="text-zinc-400 text-[11px] ml-1.5">
              ({targetTownsfolk} TF + {targetOutsiders} Out / {targetMinions} Min + {targetDemons} Dem)
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {isBalanced ? (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 shadow-md flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>BALANCED</span>
            </span>
          ) : totalSelected === numericCount ? (
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-200">
              {totalSelected}/{numericCount} (Custom)
            </span>
          ) : totalSelected > numericCount ? (
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-300">
              {totalSelected}/{numericCount} (+{totalSelected - numericCount} over)
            </span>
          ) : (
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300">
              {totalSelected}/{numericCount}
            </span>
          )}
        </div>
      </div>

      {/* Discrepancies Diagnostic Alert if not balanced */}
      {!isBalanced && (
        <div className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-2.5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              {totalSelected === 0 ? 'How to balance bag:' : 'Adjust bag to balance:'}
            </span>
            {scriptRoles?.length > 0 && onSetBagRoles && (
              <button
                type="button"
                onClick={handleAutoFillBag}
                className="text-[11px] font-medium text-zinc-400 hover:text-zinc-200 hover:underline flex items-center gap-1"
                title="Automatically select recommended roles for this player count"
              >
                <span>Auto-fill bag</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 items-center">
            {discrepancies.length > 0 ? (
              discrepancies.map((d, i) => (
                <span
                  key={i}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${d.color}`}
                >
                  {d.label}
                </span>
              ))
            ) : (
              <span className="text-zinc-500 text-[11px]">
                Select roles below to fill your bag slots.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Quick Action Bar (Auto-fill / Clear) */}
      <div className="flex items-center justify-between text-xs pt-0.5">
        <span className="text-zinc-500 text-[11px]">
          Tap roles below to add or remove from bag.
        </span>
        <div className="flex items-center gap-2">
          {scriptRoles?.length > 0 && onSetBagRoles && (
            <button
              type="button"
              onClick={handleAutoFillBag}
              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 font-medium border border-zinc-700 text-[11px] transition-colors flex items-center gap-1 shadow-sm"
            >
              <span>Auto-Fill Bag</span>
            </button>
          )}
          {bagRoles.length > 0 && onSetBagRoles && (
            <button
              type="button"
              onClick={handleClearBag}
              className="text-[11px] text-zinc-500 hover:text-rose-400 px-1.5 py-1 transition-colors"
              title="Clear all roles from bag"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Baron Active Alert Badge */}
      {hasBaron && (
        <div className="bg-gradient-to-r from-amber-950/60 to-purple-950/40 border border-amber-500/50 rounded-xl px-3 py-2 text-xs flex items-center justify-between text-amber-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-base">🎩</span>
            <div>
              <span className="font-bold text-amber-300">Baron Setup Modifier Active:</span>{' '}
              <span className="text-zinc-200">Replaced 2 Townsfolk with <b>+2 Outsiders</b></span>
            </div>
          </div>
          <span className="text-[10px] font-black bg-amber-500 text-zinc-950 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ml-2">
            +2 OUT
          </span>
        </div>
      )}

      {/* Drunk Disguise Banner */}
      {bagRoles.includes('drunk') && (
        <div
          className={`rounded-xl p-3 border transition-colors ${
            drunkDisguise
              ? 'bg-zinc-950/80 border-zinc-800'
              : 'bg-rose-950/20 border-rose-800/60'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-lg w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">🍺</span>
              <div>
                <div className="font-bold text-zinc-200 text-xs flex items-center gap-1.5 flex-wrap">
                  <span>Drunk Townsfolk Disguise:</span>
                  {drunkDisguise ? (
                    <span className="text-zinc-100 bg-zinc-800 px-2 py-0.5 rounded-lg border border-zinc-700 font-medium">
                      {getRoleInfo(drunkDisguise)?.name || drunkDisguise}
                    </span>
                  ) : (
                    <span className="text-rose-300 font-medium bg-rose-950/60 px-2 py-0.5 rounded-lg border border-rose-800/60">
                      Disguise needed for bag
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  The Drunk thinks they are this Townsfolk. This token physically goes into the bag.
                </p>
              </div>
            </div>
            {onSetDrunkDisguise && (
              <select
                value={drunkDisguise}
                onChange={(e) => onSetDrunkDisguise(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-zinc-100 font-medium focus:outline-none focus:border-zinc-500 shrink-0"
              >
                <option value="">-- Select Townsfolk --</option>
                {availableTownsfolkForDrunk.map((tf) => (
                  <option key={tf.id} value={tf.id}>
                    {tf.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}

      {/* Two Team Cards: Good vs Evil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* GOOD TEAM CARD */}
        <div className="bg-blue-950/10 border border-blue-900/30 rounded-xl p-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-blue-300 uppercase tracking-wider text-[11px]">
              GOOD TEAM
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                currentGood === targetGood
                  ? 'bg-blue-900/40 text-blue-200 border border-blue-800/40'
                  : 'bg-zinc-800/80 text-zinc-400'
              }`}
            >
              {currentGood} / {targetGood}
            </span>
          </div>

          {/* Townsfolk Slots */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span className="text-blue-400 font-medium">Townsfolk:</span>
              <span>
                {selTownsfolk.length}/{targetTownsfolk}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[30px] items-center">
              {renderSlots(
                selTownsfolk,
                targetTownsfolk,
                {
                  badgeBg: 'bg-blue-950 hover:bg-blue-900/90',
                  border: 'border-blue-500/70',
                  emptyBorder: 'border-blue-700/50',
                  emptyBg: 'bg-blue-950/20',
                  emptyText: 'text-blue-400/50',
                },
                'Townsfolk',
                'townsfolk'
              )}
            </div>
          </div>

          {/* Outsiders Slots */}
          <div className="space-y-1 pt-1 border-t border-blue-950/60">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span className="text-cyan-400 font-medium">Outsiders:</span>
              <span>
                {selOutsiders.length}/{targetOutsiders}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[30px] items-center">
              {renderSlots(
                selOutsiders,
                targetOutsiders,
                {
                  badgeBg: 'bg-cyan-950 hover:bg-cyan-900/90',
                  border: 'border-cyan-500/70',
                  emptyBorder: 'border-cyan-700/50',
                  emptyBg: 'bg-cyan-950/20',
                  emptyText: 'text-cyan-400/50',
                },
                'Outsider',
                'outsider'
              )}
            </div>
          </div>
        </div>

        {/* EVIL TEAM CARD */}
        <div className="bg-rose-950/10 border border-rose-900/30 rounded-xl p-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-rose-300 uppercase tracking-wider text-[11px]">
              EVIL TEAM
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                currentEvil === targetEvil
                  ? 'bg-rose-900/40 text-rose-200 border border-rose-800/40'
                  : 'bg-zinc-800/80 text-zinc-400'
              }`}
            >
              {currentEvil} / {targetEvil}
            </span>
          </div>

          {/* Minions Slots */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span className="text-orange-400 font-medium">Minions:</span>
              <span>
                {selMinions.length}/{targetMinions}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[30px] items-center">
              {renderSlots(
                selMinions,
                targetMinions,
                {
                  badgeBg: 'bg-orange-950 hover:bg-orange-900/90',
                  border: 'border-orange-500/70',
                  emptyBorder: 'border-orange-700/50',
                  emptyBg: 'bg-orange-950/20',
                  emptyText: 'text-orange-400/50',
                },
                'Minion',
                'minion'
              )}
            </div>
          </div>

          {/* Demons Slots */}
          <div className="space-y-1 pt-1 border-t border-red-950/60">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span className="text-red-400 font-medium">Demons:</span>
              <span>
                {selDemons.length}/{targetDemons}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[30px] items-center">
              {renderSlots(
                selDemons,
                targetDemons,
                {
                  badgeBg: 'bg-red-950 hover:bg-red-900/90',
                  border: 'border-red-500/70',
                  emptyBorder: 'border-red-700/50',
                  emptyBg: 'bg-red-950/20',
                  emptyText: 'text-red-400/50',
                },
                'Demon',
                'demon'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom / Travellers if present */}
      {selUnknown.length > 0 && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase">
            <span>Custom / Travellers</span>
            <span>{selUnknown.length}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            {renderSlots(
              selUnknown,
              selUnknown.length,
              {
                badgeBg: 'bg-zinc-800 hover:bg-zinc-700',
                border: 'border-zinc-600',
                emptyBorder: 'border-zinc-700',
                emptyBg: 'bg-zinc-900',
                emptyText: 'text-zinc-500',
              },
              'Custom'
            )}
          </div>
        </div>
      )}
    </section>
  );
}
