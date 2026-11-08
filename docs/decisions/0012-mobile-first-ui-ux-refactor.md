# 0012: Mobile-First UI/UX Refactoring, Lucide Monochrome Icons, and 60-30-10 Color Hierarchy

**Status:** Accepted · **Date:** 2026-11-08 · **Decided by:** Storyteller Pair Programming Team

## Context

BotC Pocket Grimoire is primarily used by Storytellers on mobile smartphones in dim, candlelit, or darkened rooms during in-person social deduction sessions.

Prior versions accumulated visual friction:
1. **"Amber Overload" & Broken Visual Hierarchy:** Solid `amber-500` was applied indiscriminately to active navigation tabs, sub-tabs, filter pills, player count pickers, role badges, and action buttons. When everything is highlighted in amber, nothing stands out, causing cognitive fatigue and visual blindness for Storytellers looking for the next primary step.
2. **System Emoji Clutter & Cross-Platform Inconsistency:** Top and bottom navigation bars, filter buttons, status chips, and modal controls used colorful OS system emojis. These rendered inconsistently across iOS, Android, and desktop browsers, clashing with the dark Grimoire aesthetic. Furthermore, complex Zero-Width-Joiner (ZWJ) compound emojis (notably Chef `🧑‍🍳`) broke out of circular avatar boundaries on certain mobile WebViews.
3. **Redundant Navigation Paths:** The Home screen presented a grid of 5 "App Section" shortcut cards that duplicated the permanent navigation bar immediately below or above them. The Games view header displayed two redundant Script dropdown selectors.
4. **Customer Journey (CJ) Friction in Game Setup:** In the `1. Bag` tab, Storytellers lacked an obvious forward action button once all roles were picked, leaving ambiguity regarding how to proceed to seat allocation in `2. Table Circle`.

## Decision

1. **Monochromatic SVG Icons (`lucide-react`):**
   - Installed `lucide-react` and replaced all system emojis in UI controls (navigation, filter pills, toolbars, modal headers, action buttons) with clean, monochromatic SVG icons (`Home`, `BookOpen`, `ScrollText`, `Dices`, `History`, `CircleDot`, `Moon`, `RotateCcw`, `Flag`, `Eye`, `Trophy`, `Download`, `Trash2`, `X`, `Check`, `ArrowRight`).
   - Character role glyphs are preserved in tokens/avatars for thematic flavor, but compound emojis (like Chef `🧑‍🍳`) are standardized to clean single glyphs (`🍳`) with `overflow-hidden shrink-0 flex items-center justify-center` containers.

2. **Strict 60-30-10 Color Hierarchy:**
   - **60% Dominant Canvas:** Deep dark room backgrounds (`bg-zinc-950`).
   - **30% Elevated Structural Surfaces:** Calm elevated dark surfaces (`bg-zinc-900`, `bg-zinc-800`, with subtle `border-zinc-700` and `text-zinc-100`) for active navigation pills, sub-tabs, team filter pills, and selected player counts.
   - **10% Accent / Primary CTA:** Solid `bg-amber-500 text-zinc-950 font-semibold` is strictly reserved for **at most ONE primary forward-action button per screen** (e.g., `Resume Grimoire Table` on Home, or `Continue to Table Circle →` in Bag Setup).
   - Softened team containers and compendium badges to low-opacity backgrounds (`bg-blue-950/50 text-blue-300 border-blue-900/50` for Good; `bg-rose-950/50 text-rose-300 border-rose-900/50` for Evil).

3. **Ergonomic Mobile Bottom Navigation & De-duplication:**
   - On mobile viewports (`< md`), navigation stays anchored to the bottom thumb zone with iOS safe-area support (`env(safe-area-inset-bottom)`), while the main container maintains bottom padding (`pb-20 md:pb-0`) to eliminate viewport clipping.
   - De-duplicated Home screen: when a live game is active, redundant App Section cards are removed to keep immediate focus on the live game card.
   - De-duplicated Games view header: removed the secondary redundant script selector in favor of the canonical global header.

4. **Sticky Customer Journey Stepper in Setup (`1. Bag` ➔ `2. Table Circle`):**
   - Added a bottom-anchored sticky status bar in Tab 1 (`Bag`):
     - While `bagRoles.length < playerCount`: shows a calm, informative progress indicator (`Select X more roles to fill bag`) with an optional `Skip to Table →` bridge.
     - Once `bagRoles.length === playerCount`: illuminates the screen's singular amber CTA: `Continue to Table Circle (X/X) →`, automatically advancing the active tab to `2. Table Circle`.

## Consequences

- **Positive:**
  - Dramatically cleaner, calm visual experience in dark rooms.
  - Clear, unambiguous next-step guidance for Storytellers during setup and live running.
  - Zero regressions in game state, undo history, LocalStorage persistence, or Drunk disguise calculations.
  - Perfect consistency across all devices, operating systems, and screen densities.
- **Negative:**
  - Adds `lucide-react` (~115 KB gzip bundle impact offset by tree-shaking and pre-cached PWA service worker).

## Links

- [ADR 0007: Assist, never enforce](0007-assist-never-enforce.md)
- [ADR 0008: PWA Web Architecture](0008-pwa-web-architecture.md)
- [ADR 0011: Digital Deal and Off-Script Roles](0011-digital-deal-and-offscript-roles.md)
