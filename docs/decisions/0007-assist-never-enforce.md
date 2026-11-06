# 0007: Assist, never enforce

**Status:** Accepted · **Date:** 2026-11-04 · **Decided by:** Product owner

## Context
The Storyteller runs the game and may legitimately break the "normal" rules. Examples are house rules, homebrew characters, unusual player counts, fixing a mistake mid-game, or deliberately changing setup for a better game. A tool that blocks these things gets in the way at the table.

## Decision
The app **MUST never restrict** the Storyteller from doing something, and **MUST never force** them to do something.

The app **may only highlight**:
- that something is not working or is inconsistent (e.g. "3 Minions selected, 2 expected for 10 players"),
- that something will not work (e.g. "This character has no night action"),
- that something should be done (e.g. "Baron in play: consider +2 Outsiders").

In practice:
- Validation produces **warnings, never errors that block**. Every warning can be ignored.
- **No mandatory steps or wizards.** Any step can be skipped, done out of order, or done again.
- **Automation is offered, not imposed.** For example, the app suggests applying a setup modifier, and the Storyteller can accept it, change it or ignore it.
- **Every state is editable at any time**: characters, seats, alive/dead, ghost vote, tokens, and game end.
- Confirmation dialogs are acceptable only for destructive actions (e.g. deleting a saved game). They exist to prevent accidents, not to forbid the action.

## Consequences
- The data model must tolerate "invalid" game states, e.g. two Demons, 4 players, or a character not on the script.
- UI needs one consistent, non-blocking way to show warnings.
- Less code goes on enforcing rules; more care goes on how hints are shown.

## Links
- [Vision: Principles](../vision.md#principles)
- Applies to all requirements.
