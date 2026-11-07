# 0009: Ghost Vote Tracker and Non-Destructive Undo History

**Status:** Accepted · **Date:** 2026-11-07 · **Decided by:** Product owner

## Context
In *Blood on the Clocktower*, dead players remain active participants in the game. Under official rules:
1. Each dead player retains exactly **one ghost vote** for executions for the remainder of the game.
2. When a dead player casts their vote during a nomination, the Storyteller removes their white ghost vote token from the town square.
3. In physical games and on mobile screens, tracking which dead players have already voted across multiple days is a frequent source of human error and debate.
4. Furthermore, running a live game on mobile touchscreens in dim night/evening lighting creates high risk of accidental taps ("fat-finger" errors: marking the wrong player dead, mis-assigning a token, or clearing a reminder). Without an Undo function, reverting mistakes under time pressure causes disruption.

## Decision
1. **Canonical Ghost Vote Tracking:**
   - Every seat tracks `hasGhostVote: boolean`.
   - When a player is marked dead (`isDead: true`), their ghost vote defaults to available (`hasGhostVote: true`).
   - The Storyteller can toggle this token directly on the Grimoire circle with one tap: `👻 Vote` (available, bright) ➔ `👻 Spent` (faded, line-through).
   - The table header displays a live aggregate summary: `Ghost Votes: X of Y dead`, giving the Storyteller instant visibility into total remaining voting power.
   - If a dead player is revived (e.g. by Professor or Shabaloth), their living status is restored and ghost vote reset.

2. **Rolling In-Memory Undo Stack:**
   - The application maintains a rolling history stack (last 15 snapshots) of table seat states.
   - Any state-altering action on the table (assigning tokens, toggling death, toggling drunkenness, changing reminders, adding/removing seats, toggling ghost votes) automatically pushes the prior state onto the undo stack.
   - A dedicated `↩ Undo` button is available on the table interface, showing the count of reversible actions.
   - Clicking `↩ Undo` immediately restores the previous state without page reload or state corruption.
   - Starting a new game or resetting session clears the undo stack.

## Consequences
- **Positive:** Full adherence to official Pandemonium Institute / Steven Medway rules for dead player voting.
- **Positive:** Storytellers operate with complete psychological safety on mobile touchscreens, knowing any accidental click is reversible in 1 tap.
- **Neutral:** Adds a small in-memory state footprint for the 15-snapshot undo stack, negligible for performance (< 50 KB).

## Links
- [0007: Assist, never enforce](0007-assist-never-enforce.md)
- Official *Blood on the Clocktower* Rulebook: Nominations & Dead Votes
