# 0011: Digital Deal Randomiser and Off-Script Character Assignments

**Status:** Accepted · **Date:** 2026-11-07 · **Decided by:** Product owner & community feedback

## Context
1. **Setup Ergonomics:** Manually assigning tokens to every seat individually was identified as a major friction point on mobile screens (Galaxy S25 FE). In games played without physical tokens (travel, meetups, conventions), Storytellers require a fast, frictionless way to deal characters randomly and privately show them to players.
2. **Advanced Mechanics & Buffet Scripts:** Core Blood on the Clocktower roles such as Pit-Hag (*"choose a player & a character they become"*), Barber (*"Demon may choose 2 players to swap characters"*), Alchemist (*"gain a not-in-play Minion ability"*), and Atheist—as well as popular community formats like Sushi/Whale buffet scripts—regularly require assigning characters outside the current script. The seat token selector previously restricted assignment strictly to `physicalTokensInBag`, making these rulings impossible.
3. **Script Switching State Loss:** Switching or inspecting a script previously cleared `bagRoles` and `drunkDisguise`, inadvertently erasing the Storyteller's work during an active game session.

## Decision
1. **Digital Deal Randomiser (`🎲 Deal to Table`):**
   - Implemented a 1-tap randomisation function that shuffles all characters in the bag (Fisher-Yates) and distributes them sequentially across player seats.
   - Preserves player names entered at the table and existing Travellers.
   - Automatically handles the Drunk: assigns the Drunk token to a seat while selecting an out-of-play Townsfolk disguise.
   - Fully integrated with the 15-step `undoStack`, ensuring any deal can be rolled back or reshuffled with 1 tap of `↩ Undo`.
   - Accessible directly from both the Bag Setup view and the Grimoire Table toolbar.

2. **Off-Script Character Browser:**
   - Redesigned the seat role picker with a dual-tab interface: `🎒 Bag` vs `🌐 Off-Script`.
   - The Off-Script browser provides immediate access to the full character database (`ALL_ROLES_DB`) across all editions and experimental roles.
   - Includes real-time text search and team filters (`Townsfolk`, `Outsiders`, `Minions`, `Demons`, `Exp`).
   - Allows instant assignment of any character to any player seat at any moment during the game.

3. **Non-Destructive Script Switching:**
   - Modified script selection logic to preserve `bagRoles` and `drunkDisguise` by default. Storytellers can switch scripts or inspect compendiums without losing active table state.

## Consequences
- **Positive:** Reduces digital game setup time from minutes of tedious scrolling to a single 1-tap operation.
- **Positive:** Unlocks full compatibility for Pit-Hag, Barber, Alchemist, Atheist, and community buffet scripts.
- **Positive:** Adheres strictly to ADR-0007 ("Assist, never enforce"): Storyteller has complete autonomy over which characters sit at the table.
- **Neutral:** Adds a search and filtering layer in the role picker; kept responsive and performant via React `useMemo`.

## Links
- [0007: Assist, never enforce](0007-assist-never-enforce.md)
- [0008: PWA Web Architecture](0008-pwa-web-architecture.md)
- [0009: Ghost Vote Tracker and Non-Destructive Undo History](0009-ghost-votes-and-undo-history.md)
- [0010: Canonical Role Reminders and Cross-Script Travellers](0010-canonical-reminders-and-all-travellers.md)
