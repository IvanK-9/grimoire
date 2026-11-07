// Global build-time constants injected by Vite via `define` in vite.config.js
/* global __APP_VERSION__, __GIT_HASH__, __BUILD_TIME__ */

export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.3.0';
export const GIT_HASH = typeof __GIT_HASH__ !== 'undefined' ? __GIT_HASH__ : 'dev';
export const BUILD_TIME = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : '';

export const GITHUB_REPO = 'https://github.com/IvanK-9/grimoire';
export const GITLAB_REPO = 'https://gitlab.com/commi-union/botc/botc-pocket-grimoire';

export const GITHUB_COMMIT_URL =
  GIT_HASH && GIT_HASH !== 'dev'
    ? `${GITHUB_REPO}/commit/${GIT_HASH}`
    : `${GITHUB_REPO}/commits/development`;

export const RELEASE_HIGHLIGHTS = [
  '5 Top-Level Sections: Home, Compendium, Scripts, Games, Messages',
  'Compendium with Characters subsection (~130 roles, teams, abilities & reminders)',
  'Bag Setup with Live Balance Diagnostics (+/- role discrepancies) & 1-Click Auto-Fill',
  'Storyteller-first Bag to Table Seating Tracker (unassigned token alerts)',
  'Messages & Big Text Communicator with favorites & presets',
  'PWA offline ready with auto-updating Service Worker',
];
