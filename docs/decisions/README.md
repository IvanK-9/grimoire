# Architecture Decision Records

One decision per file: `NNNN-short-name.md`. See [ADR 0001](0001-record-decisions-as-adrs.md).

**Status values:** Proposed → Accepted → Superseded by NNNN (or Rejected)

## Index

| ADR | Title | Status |
|---|---|---|
| [0001](0001-record-decisions-as-adrs.md) | Record decisions as ADRs | Proposed |
| [0002](0002-app-framework.md) | App framework: Expo, Android first | Superseded by 0008 |
| [0003](0003-character-data-source.md) | Character data and artwork from official sources | Proposed |
| [0004](0004-local-storage.md) | Local storage with SQLite | Superseded by 0008 |
| [0005](0005-localisation.md) | Localisation: en, ru, sv | Proposed |
| [0006](0006-distribution-and-delivery.md) | Private sideload distribution, phased delivery | Superseded by 0008 |
| [0007](0007-assist-never-enforce.md) | Assist, never enforce | Accepted |
| [0008](0008-pwa-web-architecture.md) | PWA Web Architecture with React 19, Vite, and Offline Service Worker | Accepted |

## Template

```markdown
# NNNN: Title

**Status:** Proposed · **Date:** YYYY-MM-DD · **Decided by:** …

## Context
What problem or force makes this decision necessary?

## Decision
What we will do.

## Alternatives considered
- …

## Consequences
What becomes easier or harder, and what risks we accept.

## Links
```
