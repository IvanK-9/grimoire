import React, { useState, useMemo } from 'react';
import { SCRIPT_PRESETS, parseScriptJson } from '../data/scripts';
import { getAllRoles, resolveRoleInfo } from '../data/roles';

export default function ScriptsView({
  currentScriptName,
  onSelectScript,
  customScripts = [],
  onSaveCustomScript,
  onDeleteCustomScript,
}) {
  const [activeSubTab, setActiveSubTab] = useState('presets'); // 'presets' | 'import' | 'builder' | 'saved'

  // Import State
  const [importUrl, setImportUrl] = useState('');
  const [importText, setImportText] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(null); // { name, author, roles }

  // Builder State
  const [builderName, setBuilderName] = useState('My Custom Script');
  const [builderAuthor, setBuilderAuthor] = useState('');
  const [builderSelectedRoles, setBuilderSelectedRoles] = useState([]);
  const [builderFilterTeam, setBuilderFilterTeam] = useState('all');

  const allAvailableRoles = useMemo(() => getAllRoles(), []);

  // Filter roles for builder
  const builderRolesByTeam = useMemo(() => {
    const teams = {
      townsfolk: [],
      outsider: [],
      minion: [],
      demon: [],
    };
    allAvailableRoles.forEach((r) => {
      if (teams[r.team]) teams[r.team].push(r);
    });
    return teams;
  }, [allAvailableRoles]);

  // Builder counts
  const builderCounts = useMemo(() => {
    const counts = { townsfolk: 0, outsider: 0, minion: 0, demon: 0 };
    builderSelectedRoles.forEach((id) => {
      const info = resolveRoleInfo(id);
      if (info && counts[info.team] !== undefined) {
        counts[info.team]++;
      }
    });
    return counts;
  }, [builderSelectedRoles]);

  const handleToggleBuilderRole = (roleId) => {
    setBuilderSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((r) => r !== roleId) : [...prev, roleId]
    );
  };

  // URL Import Handler
  const handleFetchUrl = async () => {
    if (!importUrl.trim()) return;
    setImportLoading(true);
    setImportError('');
    setImportSuccess(null);

    try {
      const trimmedUrl = importUrl.trim();
      const res = await fetch(trimmedUrl);
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}: ${res.statusText}`);
      }
      const text = await res.text();
      const parsed = parseScriptJson(text);
      if (parsed.error) {
        throw new Error(parsed.error);
      }
      setImportSuccess(parsed);
    } catch (err) {
      console.warn('URL Script fetch error:', err);
      setImportError(
        err.message?.includes('Failed to fetch')
          ? 'Network / CORS error: The server blocked direct in-browser download. Please open the link, copy its text, and paste it into the "Paste JSON" box below.'
          : err.message || 'Failed to download or parse script.'
      );
    } finally {
      setImportLoading(false);
    }
  };

  // File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError('');
    setImportSuccess(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        const parsed = parseScriptJson(text);
        if (parsed.error) throw new Error(parsed.error);
        setImportSuccess(parsed);
      } catch (err) {
        setImportError(err.message || 'Failed to parse JSON file');
      }
    };
    reader.onerror = () => setImportError('Failed to read file');
    reader.readAsText(file);
  };

  // Paste Text Parse Handler
  const handleParseText = () => {
    if (!importText.trim()) return;
    setImportError('');
    setImportSuccess(null);
    const parsed = parseScriptJson(importText.trim());
    if (parsed.error) {
      setImportError(parsed.error);
    } else {
      setImportSuccess(parsed);
    }
  };

  // Save imported or built script
  const handleSaveToCustom = (scriptToSave) => {
    if (!scriptToSave || !scriptToSave.roles.length) return;
    onSaveCustomScript(scriptToSave);
    setActiveSubTab('saved');
  };

  // Save builder script
  const handleSaveBuiltScript = () => {
    if (!builderName.trim()) {
      alert('Please enter a script name');
      return;
    }
    if (builderSelectedRoles.length < 5) {
      alert('Please select at least 5 roles for your script');
      return;
    }
    const newScript = {
      id: 'custom_' + Date.now(),
      name: builderName.trim(),
      author: builderAuthor.trim() || 'Custom Storyteller',
      roles: builderSelectedRoles,
      createdAt: new Date().toISOString(),
    };
    onSaveCustomScript(newScript);
    setActiveSubTab('saved');
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto w-full space-y-6 pb-24 md:pb-12 select-none animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-100 flex items-center gap-2">
            <span>📜</span>
            <span>Scripts & Editions</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Active: <strong className="text-amber-400">{currentScriptName}</strong>
          </p>
        </div>
      </div>

      {/* Sub-Tabs Nav */}
      <div className="grid grid-cols-4 gap-1 bg-zinc-900 p-1 rounded-2xl border border-zinc-800 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('presets')}
          className={`py-2 px-1 rounded-xl transition-all text-center truncate ${
            activeSubTab === 'presets'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          👑 Core Presets
        </button>
        <button
          onClick={() => setActiveSubTab('import')}
          className={`py-2 px-1 rounded-xl transition-all text-center truncate ${
            activeSubTab === 'import'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          🔗 Import
        </button>
        <button
          onClick={() => setActiveSubTab('builder')}
          className={`py-2 px-1 rounded-xl transition-all text-center truncate ${
            activeSubTab === 'builder'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          🛠️ Builder
        </button>
        <button
          onClick={() => setActiveSubTab('saved')}
          className={`py-2 px-1 rounded-xl transition-all text-center truncate ${
            activeSubTab === 'saved'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          📁 Saved ({customScripts.length})
        </button>
      </div>

      {/* 1. CORE PRESETS */}
      {activeSubTab === 'presets' && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-400">
            The three official foundational editions designed by Steven Medway.
          </p>
          <div className="space-y-3">
            {Object.entries(SCRIPT_PRESETS).map(([key, script]) => {
              const isCurrent = currentScriptName === script.name;
              return (
                <div
                  key={key}
                  className={`bg-zinc-900 border rounded-2xl p-4 transition-all space-y-3 ${
                    isCurrent
                      ? 'border-amber-500/60 ring-1 ring-amber-500/30'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-zinc-100">{script.name}</h2>
                        {isCurrent && (
                          <span className="text-[10px] font-bold bg-amber-500 text-zinc-950 px-2 py-0.5 rounded-full">
                            Active Script
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {script.description}
                      </p>
                    </div>
                  </div>

                  {/* Role tokens preview */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {script.roles.slice(0, 10).map((rId) => {
                      const r = resolveRoleInfo(rId);
                      return (
                        <span
                          key={rId}
                          className="text-[11px] bg-zinc-950 text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-800"
                        >
                          {r ? `${r.icon} ${r.name}` : rId}
                        </span>
                      );
                    })}
                    {script.roles.length > 10 && (
                      <span className="text-[11px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md">
                        +{script.roles.length - 10} more
                      </span>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-zinc-800/80">
                    <span className="text-xs text-zinc-400 font-medium">
                      {script.roles.length} total roles
                    </span>
                    <button
                      onClick={() => onSelectScript(script.name, script.roles)}
                      disabled={isCurrent}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                          : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md active:scale-95'
                      }`}
                    >
                      {isCurrent ? 'Currently Playing' : 'Play with this Script ➔'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. IMPORT (URL / FILE / PASTE) */}
      {activeSubTab === 'import' && (
        <div className="space-y-5">
          {/* Section A: Import from URL */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-base">🔗</span>
              <h2 className="text-sm font-bold text-zinc-100">Import from Web Link (URL)</h2>
            </div>
            <p className="text-xs text-zinc-400">
              Enter any direct URL to a script JSON (e.g. from GitHub or Blood on the Clocktower Script Tool).
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="https://.../script.json"
                className="flex-1 bg-zinc-950 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={handleFetchUrl}
                disabled={importLoading || !importUrl.trim()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl transition-all disabled:opacity-50 shrink-0"
              >
                {importLoading ? 'Fetching...' : 'Fetch Script'}
              </button>
            </div>
          </div>

          {/* Section B: File Upload & Paste JSON */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">📄</span>
                <h2 className="text-sm font-bold text-zinc-100">Load File or Paste JSON</h2>
              </div>
              <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors">
                <span>Upload .json</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='Paste script JSON here... e.g. [{"id": "_meta", "name": "My Script"}, "washerwoman", "librarian", ...]'
              rows={4}
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl p-3 text-xs font-mono text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-400"
            />
            {importText.trim() && (
              <button
                onClick={handleParseText}
                className="w-full py-2 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-200 font-bold rounded-xl text-xs transition-colors"
              >
                Parse Pasted JSON
              </button>
            )}
          </div>

          {/* Error Message */}
          {importError && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-300 leading-relaxed">
              ⚠️ {importError}
            </div>
          )}

          {/* Success / Parsed Preview */}
          {importSuccess && (
            <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-2xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-emerald-300">
                    ✓ Script Parsed: {importSuccess.name}
                  </h3>
                  {importSuccess.author && (
                    <p className="text-xs text-zinc-400">By {importSuccess.author}</p>
                  )}
                </div>
                <span className="text-xs font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {importSuccess.roles.length} Roles
                </span>
              </div>

              {/* Preview of recognized roles */}
              <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto p-2 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
                {importSuccess.roles.map((id) => {
                  const r = resolveRoleInfo(id);
                  return (
                    <span
                      key={id}
                      className="text-[11px] bg-zinc-900 text-zinc-300 px-2 py-0.5 rounded border border-zinc-800"
                    >
                      {r ? `${r.icon} ${r.name}` : id}
                    </span>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  onClick={() => onSelectScript(importSuccess.name, importSuccess.roles)}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-md text-center"
                >
                  Play with this Script Now ➔
                </button>
                <button
                  onClick={() =>
                    handleSaveToCustom({
                      id: 'custom_' + Date.now(),
                      name: importSuccess.name,
                      author: importSuccess.author || 'Imported Script',
                      roles: importSuccess.roles,
                      createdAt: new Date().toISOString(),
                    })
                  }
                  className="py-2.5 px-4 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-200 font-bold rounded-xl text-xs transition-colors"
                >
                  Save to My Scripts 💾
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. CUSTOM SCRIPT BUILDER */}
      {activeSubTab === 'builder' && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <span>🛠️</span>
              <span>Create New Script</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase">Script Name</label>
                <input
                  type="text"
                  value={builderName}
                  onChange={(e) => setBuilderName(e.target.value)}
                  placeholder="e.g. Midnight Chaos"
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase">Author (Optional)</label>
                <input
                  type="text"
                  value={builderAuthor}
                  onChange={(e) => setBuilderAuthor(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 mt-1"
                />
              </div>
            </div>

            {/* Live Balance Summary */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-zinc-800 text-center text-xs">
              <div className="bg-blue-950/40 p-2 rounded-xl border border-blue-600/30">
                <div className="font-black text-blue-400">{builderCounts.townsfolk} / 13</div>
                <div className="text-[10px] text-zinc-400 font-semibold uppercase">Townsfolk</div>
              </div>
              <div className="bg-cyan-950/40 p-2 rounded-xl border border-cyan-600/30">
                <div className="font-black text-cyan-400">{builderCounts.outsider} / 4</div>
                <div className="text-[10px] text-zinc-400 font-semibold uppercase">Outsiders</div>
              </div>
              <div className="bg-orange-950/40 p-2 rounded-xl border border-orange-600/30">
                <div className="font-black text-orange-400">{builderCounts.minion} / 4</div>
                <div className="text-[10px] text-zinc-400 font-semibold uppercase">Minions</div>
              </div>
              <div className="bg-red-950/40 p-2 rounded-xl border border-red-600/30">
                <div className="font-black text-red-400">{builderCounts.demon} / 1-4</div>
                <div className="text-[10px] text-zinc-400 font-semibold uppercase">Demons</div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSaveBuiltScript}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-md"
              >
                Save Custom Script ({builderSelectedRoles.length} roles) 💾
              </button>
              <button
                onClick={() => {
                  onSelectScript(builderName, builderSelectedRoles);
                }}
                disabled={builderSelectedRoles.length < 5}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-200 font-bold rounded-xl text-xs transition-colors disabled:opacity-50"
              >
                Play Now ➔
              </button>
            </div>
          </div>

          {/* Builder Filter Buttons */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'townsfolk', label: 'Townsfolk 🧺' },
              { id: 'outsider', label: 'Outsiders 🍺' },
              { id: 'minion', label: 'Minions 🧪' },
              { id: 'demon', label: 'Demons 😈' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setBuilderFilterTeam(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors border ${
                  builderFilterTeam === t.id
                    ? 'bg-zinc-100 text-zinc-950 font-bold border-zinc-200'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Role Checklist Grid */}
          <div className="space-y-4">
            {Object.entries(builderRolesByTeam).map(([teamKey, roles]) => {
              if (builderFilterTeam !== 'all' && builderFilterTeam !== teamKey) return null;
              return (
                <div key={teamKey} className="space-y-2">
                  <h3 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
                    {teamKey}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {roles.map((r) => {
                      const isSel = builderSelectedRoles.includes(r.id);
                      return (
                        <button
                          key={r.id}
                          onClick={() => handleToggleBuilderRole(r.id)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                            isSel
                              ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold shadow-sm'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <span className="truncate flex items-center gap-1.5">
                            <span>{r.icon}</span>
                            <span>{r.name}</span>
                          </span>
                          <span
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] shrink-0 border ${
                              isSel
                                ? 'bg-amber-500 text-zinc-950 border-amber-400'
                                : 'border-zinc-700'
                            }`}
                          >
                            {isSel ? '✓' : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. SAVED SCRIPTS */}
      {activeSubTab === 'saved' && (
        <div className="space-y-3">
          <p className="text-xs text-zinc-400">
            Your customized and imported scripts saved in browser memory.
          </p>

          {customScripts.length > 0 ? (
            customScripts.map((script) => {
              const isCurrent = currentScriptName === script.name;
              return (
                <div
                  key={script.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-zinc-100">{script.name}</h3>
                        {isCurrent && (
                          <span className="text-[10px] font-bold bg-amber-500 text-zinc-950 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {script.author ? `By ${script.author} • ` : ''}
                        {script.roles.length} roles
                        {script.createdAt ? ` • Created ${new Date(script.createdAt).toLocaleDateString()}` : ''}
                      </p>
                    </div>

                    <button
                      onClick={() => onDeleteCustomScript(script.id)}
                      className="text-zinc-500 hover:text-red-400 text-xs p-1"
                      title="Delete script"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Role tokens */}
                  <div className="flex flex-wrap gap-1">
                    {script.roles.slice(0, 8).map((rId) => {
                      const r = resolveRoleInfo(rId);
                      return (
                        <span
                          key={rId}
                          className="text-[11px] bg-zinc-950 text-zinc-300 px-2 py-0.5 rounded border border-zinc-800"
                        >
                          {r ? `${r.icon} ${r.name}` : rId}
                        </span>
                      );
                    })}
                    {script.roles.length > 8 && (
                      <span className="text-[11px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                        +{script.roles.length - 8} more
                      </span>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-zinc-800">
                    <button
                      onClick={() => {
                        const jsonStr = JSON.stringify(script, null, 2);
                        const blob = new Blob([jsonStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${script.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_script.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
                    >
                      <span>📥</span>
                      <span>Export JSON</span>
                    </button>

                    <button
                      onClick={() => onSelectScript(script.name, script.roles)}
                      disabled={isCurrent}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                          : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md'
                      }`}
                    >
                      {isCurrent ? 'Active' : 'Play with Script ➔'}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center space-y-2">
              <div className="text-3xl">📁</div>
              <p className="text-sm font-semibold text-zinc-300">No custom scripts yet</p>
              <p className="text-xs text-zinc-500">
                You can import a script from the web or build your own in the Builder tab.
              </p>
              <button
                onClick={() => setActiveSubTab('builder')}
                className="mt-2 px-4 py-2 bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs"
              >
                Open Script Builder 🛠️
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
