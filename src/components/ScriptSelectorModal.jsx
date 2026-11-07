import React, { useState } from 'react';
import { SCRIPT_PRESETS, parseScriptJson } from '../data/scripts';

export default function ScriptSelectorModal({
  currentScriptName,
  onSelectScript,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState('official'); // 'official' | 'custom'
  const [pastedJson, setPastedJson] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleApplyPreset = (presetKey) => {
    const preset = SCRIPT_PRESETS[presetKey];
    if (!preset) return;
    onSelectScript(preset.name, preset.roles);
    onClose();
  };

  const handleFileUpload = (e) => {
    setErrorMessage('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const res = parseScriptJson(ev.target.result);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        onSelectScript(res.name || file.name.replace('.json', ''), res.roles);
        onClose();
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePasteSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!pastedJson.trim()) {
      setErrorMessage('Please paste script JSON first.');
      return;
    }

    const res = parseScriptJson(pastedJson.trim());
    if (res.error) {
      setErrorMessage(res.error);
    } else {
      onSelectScript(res.name, res.roles);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-750 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <div>
              <h2 className="text-sm font-bold text-zinc-100">Select Script / Edition</h2>
              <p className="text-[11px] text-zinc-400">
                Current: <b className="text-amber-300">{currentScriptName}</b>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 text-sm font-bold px-2 py-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher: Official vs Custom */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('official');
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'official'
                ? 'bg-zinc-800 text-amber-400 shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Official Editions (3)
          </button>
          <button
            onClick={() => {
              setActiveTab('custom');
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'custom'
                ? 'bg-zinc-800 text-amber-400 shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Custom Script (JSON)
          </button>
        </div>

        {/* Error message alert */}
        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-600/50 text-rose-300 text-xs">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Tab 1: Official Editions */}
        {activeTab === 'official' && (
          <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
            {Object.entries(SCRIPT_PRESETS).map(([key, preset]) => {
              const isCurrent = currentScriptName === preset.name;
              const borderColor =
                preset.color === 'crimson'
                  ? 'border-red-600/50 hover:border-red-500'
                  : preset.color === 'amber'
                  ? 'border-amber-600/50 hover:border-amber-500'
                  : 'border-purple-600/50 hover:border-purple-500';

              const headerBg =
                preset.color === 'crimson'
                  ? 'text-red-400'
                  : preset.color === 'amber'
                  ? 'text-amber-400'
                  : 'text-purple-400';

              return (
                <button
                  key={key}
                  onClick={() => handleApplyPreset(key)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-zinc-800/90 border-amber-400 ring-1 ring-amber-400/40'
                      : `bg-zinc-950 ${borderColor}`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-zinc-100">{preset.name}</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                        {preset.roles.length} roles
                      </span>
                    </div>
                    {isCurrent ? (
                      <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/40">
                        ✓ In Play
                      </span>
                    ) : (
                      <span className={`text-xs font-semibold ${headerBg}`}>Select ➔</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-snug">{preset.description}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Tab 2: Custom Script (File or Paste JSON) */}
        {activeTab === 'custom' && (
          <div className="space-y-3.5 overflow-y-auto pr-1 flex-1">
            {/* File Upload Option */}
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-zinc-300 block">
                Option 1: Upload Script JSON file
              </span>
              <p className="text-[11px] text-zinc-400">
                Compatible with official botc.app, script generator, and bloodontheclocktower.com exports.
              </p>
              <label className="inline-flex items-center justify-center gap-2 cursor-pointer bg-zinc-800 hover:bg-zinc-750 text-xs font-bold text-zinc-100 px-4 py-2.5 rounded-xl border border-zinc-700 transition-colors w-full">
                <span>📁</span>
                <span>Choose .json File</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Paste JSON Option */}
            <form onSubmit={handlePasteSubmit} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-zinc-300 block">
                Option 2: Paste Script JSON text
              </span>
              <textarea
                rows={4}
                value={pastedJson}
                onChange={(e) => setPastedJson(e.target.value)}
                placeholder='[{"id":"_meta","name":"My Script"}, "washerwoman", "monk", ...]'
                className="w-full bg-zinc-900 border border-zinc-750 rounded-xl p-2.5 text-xs text-zinc-100 font-mono placeholder-zinc-600 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={!pastedJson.trim()}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-zinc-950 font-bold text-xs rounded-xl shadow transition-colors"
              >
                Load Pasted Script
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
