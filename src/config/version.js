// Global build-time constants injected by Vite via `define` in vite.config.js
/* global __APP_VERSION__, __GIT_HASH__, __BUILD_TIME__ */

export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.3.1';
export const GIT_HASH = typeof __GIT_HASH__ !== 'undefined' ? __GIT_HASH__ : 'dev';
export const BUILD_TIME = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : '';

export const GITHUB_REPO = 'https://github.com/IvanK-9/grimoire';
export const GITLAB_REPO = 'https://gitlab.com/commi-union/botc/botc-pocket-grimoire';

export const GITHUB_COMMIT_URL =
  GIT_HASH && GIT_HASH !== 'dev'
    ? `${GITHUB_REPO}/commit/${GIT_HASH}`
    : `${GITHUB_REPO}/commits/development`;

export const RELEASE_HIGHLIGHTS = [
  'v0.3.1: Fixed Drunk token count bug & integrated Drunk Townsfolk disguise selector',
  'v0.3.1: Added 3 Demon Bluffs widget (auto-roll & fullscreen display for Demon/Spy)',
  'v0.3.1: Clickable empty bag slots (jump straight to team selection)',
  'v0.3.1: High-visibility fullscreen token card text for night storytelling',
  'v0.3.1: Cleaned up redundant bag alerts & streamlined mobile scrolling',
  '5 Top-Level Sections: Home, Compendium, Scripts, Games, Messages',
  'Compendium with Characters subsection (~130 roles, abilities & reminders)',
  'PWA offline ready with auto-updating Service Worker',
];
