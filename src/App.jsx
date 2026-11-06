import React, { useState, useMemo } from 'react';
import NightFlashcards, { FullscreenFlashcard } from './components/NightFlashcards';

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

export default function App() {
  const [activeTab, setActiveTab] = useState('bag');
  const [scriptName, setScriptName] = useState('Trouble Brewing');
  const [scriptRoles, setScriptRoles] = useState(Object.keys(ROLES_DB));
  const [bagRoles, setBagRoles] = useState([]);
  const [drunkDisguise, setDrunkDisguise] = useState('');
  const [seats, setSeats] = useState([]);
  const [selectedSeatIndex, setSelectedSeatIndex] = useState(null);
  const [fullscreenCard, setFullscreenCard] = useState(null);

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
          setSeats([]);
        }
      } catch {
        alert('Invalid script JSON');
      }
    };
    reader.readAsText(file);
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

  const startSeating = () => {
    if (isDrunkInBag && !drunkDisguise) {
      alert('Pick a Townsfolk disguise for Drunk first!');
      return;
    }
    setSeats((prev) =>
      Array.from({ length: physicalTokensInBag.length }, (_, i) => ({
        seat: i + 1,
        name: prev[i]?.name || '',
        drawnToken: prev[i]?.drawnToken && physicalTokensInBag.includes(prev[i].drawnToken) ? prev[i].drawnToken : null,
      }))
    );
    setActiveTab('seating');
  };

  const unassignedTokens = useMemo(() => {
    const used = seats.map((s) => s.drawnToken).filter(Boolean);
    return physicalTokensInBag.filter((t) => !used.includes(t));
  }, [physicalTokensInBag, seats]);

  const assignToken = (idx, token) => {
    setSeats((prev) => prev.map((s, i) => (i === idx ? { ...s, drawnToken: token } : s)));
    setSelectedSeatIndex(null);
  };

  const groupedScript = useMemo(() => {
    const g = { townsfolk: [], outsider: [], minion: [], demon: [], unknown: [] };
    scriptRoles.forEach((id) => {
      const info = getRoleInfo(id);
      g[info.team].push(info);
    });
    return g;
  }, [scriptRoles]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-36 font-sans select-none">
      <FullscreenFlashcard card={fullscreenCard} onClose={() => setFullscreenCard(null)} />

      <header className="sticky top-0 z-20 bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-amber-400">BotC Pocket Grimoire</h1>
          <p className="text-xs text-zinc-400">Script: <b className="text-zinc-200">{scriptName}</b></p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('night')}
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-colors ${
              activeTab === 'night'
                ? 'bg-amber-500 text-zinc-950 border-amber-400'
                : 'bg-zinc-800 text-amber-400 border-zinc-700 hover:bg-zinc-700'
            }`}
          >
            <span>🌙</span>
            <span className="hidden sm:inline">Big Text</span>
          </button>
          <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-700">
            Load JSON
            <input type="file" accept=".json,application/json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </header>

      <div className="grid grid-cols-3 bg-zinc-900 border-b border-zinc-800 text-xs sm:text-sm font-medium">
        <button
          onClick={() => setActiveTab('bag')}
          className={`py-3 border-b-2 ${activeTab === 'bag' ? 'border-amber-400 text-amber-400 bg-zinc-800/40' : 'border-transparent text-zinc-400'}`}
        >
          1. Bag ({bagRoles.length})
        </button>
        <button
          onClick={startSeating}
          disabled={!bagRoles.length}
          className={`py-3 border-b-2 ${activeTab === 'seating' ? 'border-amber-400 text-amber-400 bg-zinc-800/40' : 'border-transparent text-zinc-400 disabled:opacity-40'}`}
        >
          2. Seats ({seats.filter((s) => s.drawnToken).length}/{bagRoles.length})
        </button>
        <button
          onClick={() => setActiveTab('night')}
          className={`py-3 border-b-2 flex items-center justify-center gap-1 ${activeTab === 'night' ? 'border-amber-400 text-amber-400 bg-zinc-800/40' : 'border-transparent text-zinc-400'}`}
        >
          <span>3. Prompts</span>
          <span className="text-xs">🌙</span>
        </button>
      </div>

      {activeTab === 'bag' && (
        <main className="p-4 space-y-5 max-w-lg mx-auto">
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
                        className={`text-left px-3 py-2.5 rounded-xl border text-sm font-medium flex items-center justify-between ${
                          sel ? `${st.bg} ${st.border} text-white` : dis ? 'bg-amber-950/40 border-amber-500 text-amber-300' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <span className="truncate flex items-center gap-1.5">
                          <span>{r.icon}</span>
                          <span>{r.name}</span>
                        </span>
                        {sel && <span className={`w-2.5 h-2.5 rounded-full ${st.badge} shrink-0`} />}
                        {dis && <span className="text-[10px] font-bold bg-amber-500 text-zinc-950 px-1.5 rounded shrink-0">DRUNK</span>}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {bagRoles.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 p-3 bg-zinc-900 border-t border-zinc-800 space-y-2 z-20">
              {isDrunkInBag && (
                <div className="max-w-lg mx-auto flex items-center gap-2 bg-amber-950/60 border border-amber-500/60 px-3 py-2 rounded-xl">
                  <span className="text-xs font-bold text-amber-300 shrink-0">Drunk token:</span>
                  <select
                    value={drunkDisguise}
                    onChange={(e) => setDrunkDisguise(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-100 w-full"
                  >
                    <option value="">-- Pick Townsfolk Disguise --</option>
                    {availableTownsfolkForDrunk.map((tf) => (
                      <option key={tf.id} value={tf.id}>{tf.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="max-w-lg mx-auto flex items-center justify-between">
                <div className="text-xs text-zinc-300">
                  Players: <b className="text-white">{bagRoles.length}</b> | Bag ready: {physicalTokensInBag.length}/{bagRoles.length}
                </div>
                <button onClick={startSeating} className="bg-amber-500 text-zinc-950 font-bold text-sm px-4 py-2 rounded-xl">
                  Confirm Bag
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {activeTab === 'seating' && (
        <main className="p-4 space-y-4 max-w-lg mx-auto">
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
            <div className="text-zinc-400 mb-1.5">Unassigned in bag ({unassignedTokens.length}):</div>
            <div className="flex flex-wrap gap-1.5">
              {unassignedTokens.length === 0 ? (
                <span className="text-emerald-400 font-bold">All tokens assigned!</span>
              ) : (
                unassignedTokens.map((id) => (
                  <span key={id} className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 flex items-center gap-1">
                    <span>{getRoleInfo(id).icon}</span>
                    <span>{getRoleInfo(id).name}</span>
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            {seats.map((s, idx) => {
              const drawn = s.drawnToken ? getRoleInfo(s.drawnToken) : null;
              const isDrunk = s.drawnToken && s.drawnToken === drunkDisguise;
              const actual = isDrunk ? getRoleInfo('drunk') : drawn;
              const st = actual ? TEAM_STYLES[actual.team] : null;

              return (
                <div key={s.seat} className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${drawn ? `${st.bg} ${st.border}` : 'bg-zinc-900 border-zinc-800'}`}>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs shrink-0">
                      #{s.seat}
                    </span>
                    <input
                      type="text"
                      placeholder="Player name (optional)"
                      value={s.name}
                      onChange={(e) => setSeats((p) => p.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)))}
                      className="bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none w-full truncate"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {drawn && (
                      <button
                        onClick={() =>
                          setFullscreenCard({
                            title: actual.name,
                            subtitle: s.name ? `Seat #${s.seat} • ${s.name}` : `Seat #${s.seat}`,
                            icon: actual.icon,
                            team: actual.team,
                            teamLabel: isDrunk ? 'OUTSIDER (DRUNK)' : actual.team.toUpperCase(),
                            description: actual.ability,
                          })
                        }
                        title="Show role to player in Big Text"
                        className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-2 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white"
                      >
                        👁️ Show
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedSeatIndex(idx)}
                      className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-400"
                    >
                      {drawn ? (
                        <span className="text-white">
                          {drawn.name} {isDrunk && <b className="bg-amber-500 text-zinc-950 px-1 rounded ml-1">DRUNK</b>}
                        </span>
                      ) : (
                        '+ Assign Role'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedSeatIndex !== null && (
            <div className="fixed inset-0 z-30 bg-black/75 flex items-end sm:items-center justify-center p-4" onClick={() => setSelectedSeatIndex(null)}>
              <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="font-bold text-sm">Seat #{seats[selectedSeatIndex].seat} — Select Drawn Token</span>
                  <button onClick={() => setSelectedSeatIndex(null)} className="text-zinc-400 px-2">✕</button>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {physicalTokensInBag.map((tid) => {
                    const info = getRoleInfo(tid);
                    const taken = seats.find((x) => x.drawnToken === tid);
                    const curr = seats[selectedSeatIndex].drawnToken === tid;
                    return (
                      <button
                        key={tid}
                        disabled={taken && !curr}
                        onClick={() => assignToken(selectedSeatIndex, tid)}
                        className={`p-2.5 rounded-xl border text-left text-xs ${
                          curr ? 'border-amber-400 bg-amber-500/20' : taken ? 'opacity-40 bg-zinc-950 border-zinc-800' : 'bg-zinc-800 border-zinc-700'
                        }`}
                      >
                        <div className="font-bold text-sm flex items-center gap-1.5">
                          <span>{info.icon}</span>
                          <span>{info.name}</span>
                        </div>
                        <div className="text-zinc-400">{taken ? `Seat #${taken.seat}` : 'In bag'}</div>
                      </button>
                    );
                  })}
                </div>
                {seats[selectedSeatIndex].drawnToken && (
                  <button onClick={() => assignToken(selectedSeatIndex, null)} className="w-full py-2 text-xs text-red-400 border border-red-900/40 rounded-lg">
                    Clear Seat
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      )}

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
