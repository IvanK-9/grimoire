# Requirements

One file per requirement: `R-NNN-short-name.md`. IDs are never reused.

**Status values:** Draft → Accepted → Done (or Dropped)
**Priority values:** Must / Should / Could (within its phase)

Every requirement follows [ADR 0007: Assist, never enforce](../decisions/0007-assist-never-enforce.md): no acceptance criterion may block or force the Storyteller. Use warnings and suggestions instead.

## Index

| ID | Title | Phase | Priority | Status |
|---|---|---|---|---|
| [R-001](R-001-offline-first.md) | Offline first | 1 | Must | Draft |
| [R-002](R-002-default-scripts.md) | Default scripts | 1 | Must | Draft |
| [R-003](R-003-game-setup.md) | Game setup helper | 1 | Must | Draft |
| [R-004](R-004-grimoire-board.md) | Minimal grimoire board | 1 | Must | Draft |
| [R-005](R-005-saved-games.md) | Multiple saved games | 1 | Must | Draft |
| [R-006](R-006-reminder-tokens.md) | Reminder tokens | 2 | Must | Draft |
| [R-007](R-007-character-artwork.md) | Character artwork | 2 | Should | Draft |
| [R-008](R-008-script-builder.md) | In-app script builder | 2 | Must | Draft |
| [R-009](R-009-localisation.md) | English, Russian, Swedish | 3 | Must | Draft |
| [R-010](R-010-game-history.md) | Game history | 3 | Should | Draft |
| [R-011](R-011-script-import-fetch.md) | Script import and fetch | Later | Could | Draft |
| [R-012](R-012-night-order-guide.md) | Night order guide | Later | Could | Draft |
| [R-013](R-013-show-to-player.md) | Show-to-player screens | Later | Could | Draft |

## Template

```markdown
# R-NNN: Title

**Phase:** 1 · **Priority:** Must · **Status:** Draft

## User story
As the Storyteller, I want … so that …

## Acceptance criteria
- [ ] …

## Notes / open questions

## Links
- ADR: …
```
