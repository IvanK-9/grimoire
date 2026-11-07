# 0010: Canonical Role Reminders for Storyteller and Spy, and Cross-Script Travellers

**Status:** Accepted · **Date:** 2026-11-07 · **Decided by:** Product owner & community feedback

## Context
1. In *Blood on the Clocktower*, reminder tokens (markers placed in the Grimoire alongside character tokens) are a foundational component of the physical game. They track night state and rulings: who is the Fortune Teller's *Red herring*, which two players are the Investigator's *Minion* and *Wrong* choices, who is the Butler's *Master*, who was protected as *Safe* by the Monk, and who is currently *Poisoned*.
2. The Spy's ability states: *"Each night, you see the Grimoire."* Crucially, the Spy sees not just character tokens, but the entire physical Grimoire—including all reminder tokens and bluffs. Without canonical reminder tokens, the Spy cannot function as designed by official rules.
3. Previously, the application only offered 4 generic text labels (`Poisoned`, `Safe`, `Mad`, `Ghost Vote Used`), making nuanced scripts and the Spy ability unplayable in competitive games.
4. Regarding Travellers: Official rules allow Storytellers to introduce any Traveller character into any edition or script to accommodate late-joining players. The app was missing the canonical Trouble Brewing Traveller *Scapegoat* (`🐐`), locked Travellers to hardcoded presets without a cross-script browser, and lacked clear visual differentiation for experimental Travellers (*Orderly*, *Vodyanoi*).

## Decision
1. **Canonical Reminder Database (`src/data/reminders.js`):**
   - Implemented a complete database of official reminder tokens across all core editions (Trouble Brewing, Bad Moon Rising, Sects & Violets) and Travellers, alongside generic status markers.
   - Dynamic Context Filtering: The seat editor highlights reminder tokens belonging to characters currently seated or present on the active script, with an instant toggle to browse the full database across all editions.
   - Arbitrary Custom Input: Storytellers can type and append bespoke reminder tokens at any time (adhering to ADR-0007).
   - Live Grimoire Visibility: Reminder badges and readable text chips are rendered directly on seat nodes on the table circle, allowing the Storyteller and the Spy to see town state at a glance without opening modals.

2. **Traveller Improvements & Cross-Script Toggle:**
   - Added official Trouble Brewing Traveller: **Scapegoat** (`🐐`, *"If a player of your alignment is executed, you might be executed instead."*).
   - Implemented a toggle in the Traveller picker: `⭐ Script Travellers` vs `🌐 All Travellers`, permitting any Traveller to be added to any game.
   - Marked experimental/homebrew Travellers (*Orderly*, *Vodyanoi*) with distinct `Exp` badges to maintain clarity between core official and experimental rules.

## Consequences
- **Positive:** Enables authentic Spy gameplay and accurate night-phase storytelling rulings.
- **Positive:** Full adherence to official Pandemonium Institute Traveller rules.
- **Positive:** Clear visual distinction between official core and experimental content.
- **Neutral:** Expands available reminder tokens; organized into tabbed views (`Script` vs `All Roles`) to ensure quick one-tap operation on mobile touchscreens without scrolling fatigue.

## Links
- [0007: Assist, never enforce](0007-assist-never-enforce.md)
- [0008: PWA Web Architecture](0008-pwa-web-architecture.md)
- Official *Blood on the Clocktower* Rulebook: The Spy & Reminder Tokens; Travellers Guide
