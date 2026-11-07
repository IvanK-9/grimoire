# 0008: PWA Web Architecture with React 19, Vite, and Offline Service Worker

**Status:** Accepted · **Date:** 2026-11-06 · **Decided by:** Team (Emanuel, Sergey, Ivan)

## Context
Initial ADRs (0002, 0004, 0006) proposed a native Expo/React Native Android app with SQLite. Following team discussions and discovery with Sergey and Emanuel, the primary needs crystallized:
- **Instant multi-platform access:** Must run seamlessly on any device (iOS, Android, desktop, tablets) without requiring store installs, app approvals, or sideloading `.apk` files.
- **True offline operation:** Must work 100% offline in basements, events, or retreats without internet (Sergey: *"Mobile is better in terms of offline, but web is accessible"*).
- **Zero accounts / Zero login:** Pure client-side state, no authentication or external backend server (Sergey requirement 3).
- **Fast iterations & instant updates:** Rapid deployment directly to GitHub Pages and GitLab CI.

## Decision
- Build as a **Progressive Web Application (PWA)** using **React 19 + Vite 8 + Tailwind CSS v4**.
- Application source code lives in `src/`.
- Offline capability provided by `vite-plugin-pwa` generating a standard Service Worker with precached assets (PWA installable as a standalone app on iOS Safari and Android Chrome).
- Client persistence managed via `localStorage` with versioned schema migrations and JSON snapshot export/import.
- This decision explicitly **supersedes ADR 0002** (Expo framework), **ADR 0004** (SQLite), and **ADR 0006** (EAS distribution).

## Alternatives considered
- **React Native / Expo (ADR 0002):** Required compiling platform builds, EAS credentials, manual APK sideloading or TestFlight invites, and had high friction for rapid playtesting.
- **Flutter:** Distinct language (Dart) with separate build pipelines.
- **Server-rendered web app (Next.js / Remix):** Requires server hosting, accounts, and fails in offline venues without network.

## Consequences
- **Positive:** Zero install barrier. A single web URL (`https://ivank-9.github.io/grimoire/`) works across iPhone, Android, iPad, and laptop.
- **Positive:** Fully functional offline once loaded (cached via Service Worker).
- **Positive:** Build and deploy time under 2 seconds.
- **Trade-off:** Push notifications and low-level Bluetooth are not native, but neither is required by the Blood on the Clocktower storyteller workflow.

## Links
- Supersedes: [ADR 0002](0002-app-framework.md), [ADR 0004](0004-local-storage.md), [ADR 0006](0006-distribution-and-delivery.md)
- Adheres to: [ADR 0007](0007-assist-never-enforce.md)
