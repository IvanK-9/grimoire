import React, { useState } from 'react';

export default function GameStateModal({
  getGameState,
  onImportState,
  onResetGame,
  onClose,
}) {
  const [importText, setImportText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleExport = () => {
    const currentState = getGameState ? getGameState() : {};
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `botc_game_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setSuccessMessage('Game state exported to file!');
  };

  const handleFileImport = (e) => {
    setErrorMessage('');
    setSuccessMessage('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target.result);
        onImportState(json);
        setSuccessMessage('Game state successfully imported!');
        setTimeout(onClose, 800);
      } catch (err) {
        setErrorMessage('Failed to read JSON: ' + (err.message || 'Invalid format'));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleTextImport = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const json = JSON.parse(importText.trim());
      onImportState(json);
      setSuccessMessage('Game state successfully imported!');
      setTimeout(onClose, 800);
    } catch (err) {
      setErrorMessage('Invalid JSON text: ' + (err.message || 'Parse error'));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-750 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💾</span>
            <div>
              <h2 className="text-sm font-bold text-zinc-100">Session & Game Backup</h2>
              <p className="text-[11px] text-zinc-400">Save, restore, or reset the grimoire</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 text-sm font-bold px-2 py-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-600/50 text-rose-300 text-xs">
            ⚠️ {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-600/50 text-emerald-300 text-xs font-bold">
            ✓ {successMessage}
          </div>
        )}

        {/* Export Button */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-xs font-bold text-zinc-300 block">Export Game State</span>
          <p className="text-[11px] text-zinc-400">
            Downloads a JSON snapshot of current seats, assignments, dead status, and bag.
          </p>
          <button
            onClick={handleExport}
            className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <span>📥</span>
            <span>Download Backup (.json)</span>
          </button>
        </div>

        {/* Import Option */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5">
          <span className="text-xs font-bold text-zinc-300 block">Restore Game State</span>
          <label className="inline-flex items-center justify-center gap-2 cursor-pointer bg-zinc-800 hover:bg-zinc-750 text-xs font-bold text-zinc-100 px-4 py-2 rounded-xl border border-zinc-700 transition-colors w-full">
            <span>📁</span>
            <span>Upload Backup File</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
          <form onSubmit={handleTextImport} className="space-y-1.5 pt-1">
            <textarea
              rows={2}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Or paste JSON backup text..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-xs text-zinc-100 font-mono placeholder-zinc-600 focus:outline-none focus:border-amber-400"
            />
            {importText.trim() && (
              <button
                type="submit"
                className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow"
              >
                Restore from Text
              </button>
            )}
          </form>
        </div>

        {/* Reset Game Section */}
        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-400">Start new game?</span>
          <button
            onClick={() => {
              if (window.confirm('Reset current game? This will clear all seats and selected bag roles.')) {
                onResetGame();
                onClose();
              }
            }}
            className="text-xs text-rose-400 hover:text-rose-300 bg-rose-950/30 border border-rose-900/50 px-3 py-1.5 rounded-xl font-bold transition-colors"
          >
            ↺ Reset All Seats & Bag
          </button>
        </div>
      </div>
    </div>
  );
}
