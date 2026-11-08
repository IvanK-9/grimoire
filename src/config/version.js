// Global build-time constants injected by Vite via `define` in vite.config.js
/* global __APP_VERSION__, __GIT_HASH__, __BUILD_TIME__ */

export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.3.5';
export const GIT_HASH = typeof __GIT_HASH__ !== 'undefined' ? __GIT_HASH__ : 'dev';
export const BUILD_TIME = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : '';

export const GITHUB_REPO = 'https://github.com/IvanK-9/grimoire';
export const GITLAB_REPO = 'https://gitlab.com/commi-union/botc/botc-pocket-grimoire';

export const GITHUB_COMMIT_URL =
  GIT_HASH && GIT_HASH !== 'dev'
    ? `${GITHUB_REPO}/commit/${GIT_HASH}`
    : `${GITHUB_REPO}/commits/development`;

export const RELEASE_HIGHLIGHTS = [
  'v0.3.5: Mobile-First UI/UX Refactoring & Visual De-cluttering',
  'v0.3.5: Lucide-React SVG icon migration (clean monochrome icons, zero system emojis in UI controls)',
  'v0.3.5: Strict 60-30-10 color hierarchy (amber reserved for single primary forward CTA, calm zinc surfaces for tabs & filters)',
  'v0.3.5: Mobile Bottom Navigation Bar with safe-area spacing and de-duplicated screen navigation',
  'v0.3.5: Customer Journey Sticky Stepper in Game Setup (Bag ➔ Table Circle forward action bridge)',
  'v0.3.5: Fixed Chef compound emoji overflow in token avatars (standardized to single glyph)',
  'v0.3.4: Digital Deal (1-tap random role distribution across seats without physical bag/tokens)',
  'v0.3.4: Off-Script Role Browser (assign any character from the entire BotC database for Pit-Hag, Barber, Alchemist & Buffet scripts)',
  'v0.3.4: Preserved table and bag state when switching scripts (no accidental bag wipe)',
  'v0.3.4: Documented design decisions in ADR-0011',
  'v0.3.3: Canonical Role Reminder Tokens for all active script roles (vital for Storyteller rulings & Spy Grimoire vision)',
  'v0.3.3: Live Reminder token badges and chips rendered on circle seat nodes',
  'v0.3.3: Added missing official Trouble Brewing Traveller: Scapegoat 🐐',
  'v0.3.3: Cross-script Travellers support with Script Travellers vs All Travellers toggle',
  'v0.3.3: Visual Exp badges on experimental Travellers (Orderly, Vodyanoi)',
  'v0.3.2: Ghost Vote Tracker (canonical 👻 vote token on dead seats with available/spent toggle)',
  'v0.3.2: Quick Undo button (15-step rolling history stack for all table actions)',
  'v0.3.1: Fixed Drunk token count bug & integrated Drunk Townsfolk disguise selector',
  'v0.3.1: Added 3 Demon Bluffs widget (auto-roll & fullscreen display for Demon/Spy)',
  '5 Top-Level Sections: Home, Compendium, Scripts, Games, Messages',
  'PWA offline ready with auto-updating Service Worker',
];
