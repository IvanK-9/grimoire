# 0002: App framework: Expo, Android first

**Status:** Proposed · **Date:** 2026-11-04 · **Decided by:** Product owner / architect

## Context
We need a mobile app that ships quickly, works offline, and could reach iOS later. The first users are on Android.

## Decision
- Build with **React Native + Expo**, in **TypeScript**.
- Develop and test on **Android first**. Don't break iOS, but don't test it routinely before a later decision.
- Design for **phone, portrait orientation** only.
- The app lives in `app/`.

## Alternatives considered
- **Flutter:** strong custom drawing, but a different language and ecosystem.
- **Native Android (Kotlin):** no path to iOS without a rewrite.

## Consequences
- One codebase. iOS support later is mostly testing and building.
- Expo modules cover storage, files and localisation without native code.
- Tablet and landscape layouts are out of scope until a new decision.

## Links
- Requirement: [R-004](../requirements/R-004-grimoire-board.md)
