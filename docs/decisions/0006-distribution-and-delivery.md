# 0006: Private sideload distribution, phased delivery

**Status:** Proposed · **Date:** 2026-11-04 · **Decided by:** Product owner

## Context
The first users are the product owner and a few friends. The goal is to get a usable app into their hands as early as possible.

## Decision
- Distribute as a **sideloaded Android APK** to a small private group. No store release.
- Deliver in **phases** (see [vision](../vision.md#delivery-phases)). Each phase must be usable at a real game.

## Consequences
- No store review, accounts or privacy policy are needed for now.
- The IP risk of bundling official data stays limited (see [ADR 0003](0003-character-data-source.md)).
- Updates are installed by hand. Consider EAS Update or an in-app version check later.
- A public release requires a new ADR.
