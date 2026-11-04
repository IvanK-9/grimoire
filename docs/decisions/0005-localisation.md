# 0005: Localisation: en, ru, sv

**Status:** Proposed · **Date:** 2026-11-04 · **Decided by:** Product owner

## Context
The app's groups play in English, Russian and Swedish. Translations ship in Phase 3, but retrofitting i18n later would be costly.

## Decision
- Support **English, Russian and Swedish**.
- Externalise all UI strings from Phase 1, with English only at first.
- Character data has a field per language, or a translation file per language, keyed by character ID.
- The i18n library is to be decided at implementation time, e.g. `i18next` + `expo-localization`.

## Open questions
- Where do the Russian and Swedish character texts come from: official or community translations, or our own?

## Consequences
- Phase 1 has a small extra cost; Phase 3 becomes mostly translation work.
- Russian plural rules require an i18n library with plural support.

## Links
- Requirement: [R-009](../requirements/R-009-localisation.md)
