# 0004: Local storage with SQLite

**Status:** Proposed · **Date:** 2026-11-04 · **Decided by:** Architect (proposal, to be confirmed)

## Context
The app must keep multiple saved games, custom scripts and later a game history, entirely offline. Game state must survive the app being killed at any moment.

## Decision
- Use **SQLite** via `expo-sqlite` for saved games, custom scripts and game history.
- Save every change as it happens.
- Version the schema with migrations from the first release, so app updates never lose games.
- Bundled character data stays read-only in app assets, not in the database.

## Alternatives considered
- **A JSON file per game:** simple, but listing, querying history and making writes safe are all manual work.
- **AsyncStorage / MMKV:** fine for settings, but weak for structured history.

## Consequences
- Queries for lists and history are easy.
- Schema migrations need discipline from the start.

## Links
- Requirements: [R-001](../requirements/R-001-offline-first.md), [R-005](../requirements/R-005-saved-games.md), [R-010](../requirements/R-010-game-history.md)
