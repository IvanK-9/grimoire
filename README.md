# 🧙‍♂️ Blood on the Clocktower — Pocket Grimoire

[![CI](https://github.com/IvanK-9/grimoire/actions/workflows/ci.yml/badge.svg)](https://github.com/IvanK-9/grimoire/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://ivank-9.github.io/grimoire/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-purple)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8)](https://tailwindcss.com/)
[![Oxlint](https://img.shields.io/badge/linter-oxlint-orange)](https://oxc.rs/)

> A mobile web app (PWA) that helps a Blood on the Clocktower Storyteller run games offline from a phone. Optimized for real in-person games in low-light environments.

🌐 **Live Demo (GitHub Pages):** [https://ivank-9.github.io/grimoire/](https://ivank-9.github.io/grimoire/)

---

## 📚 Project Architecture & Documentation

Official requirements, decisions, and domain modeling are tracked in the `docs/` tree:

| Where | What |
|---|---|
| [docs/vision.md](docs/vision.md) | Problem, users, goals, scope, delivery phases |
| [docs/glossary.md](docs/glossary.md) | BotC and project terms |
| [docs/requirements/](docs/requirements/README.md) | What the app must do, one file per requirement |
| [docs/decisions/](docs/decisions/README.md) | Architecture Decision Records (ADRs) |
| [docs/domain/](docs/domain/README.md) | How the game works, as the app models it |
| [docs/ux/](docs/ux/README.md) | Screen flows and wireframes |
| [human_input/](human_input/requirements.md) | ⚠️ Human-only specifications and decision notes (Read-only for AI) |

---

## ✨ Implemented Features (MVP)

- 📜 **Official JSON Script Loader:**
  - Built-in classic **Trouble Brewing** edition (22 roles).
  - One-click upload supporting official JSON script exports from [script.bloodontheclocktower.com](https://script.bloodontheclocktower.com/).
- 🎒 **1. The Bag (Setup):**
  - Quick role selection grouped by team (*Townsfolk, Outsider, Minion, Demon*).
  - **Drunk Disguise Pre-assignment:** Mandatory selection of an unused Townsfolk disguise before dealing physical tokens.
- 🪑 **2. Seating Chart (1-Tap):**
  - Dynamic seat generation based on bag count.
  - 1-tap token assignment from the physical bag. Player names are optional.
  - Storyteller sees the true role (Drunk disguise clearly tagged with **DRUNK**).
- 🌙 **3. Silent Night Flashcards (Big Text Mode):**
  - Fullscreen high-contrast flashcards on pitch-black (`#000000`) background for silent nighttime communication.
  - Official prompt presets (*"Choose a player"*, *"Point to 2 players"*, *"These are your Minions"*).
  - Quick large **YES** / **NO** and count numbers (**0, 1, 2, 3**).
  - 1-tap **👁️ Show** button directly in the seating list to flash a player's token in the dark.
  - Free-text custom message input.
- 📶 **Offline PWA & LocalStorage:**
  - Full offline support with Service Worker and Web App Manifest (`display: standalone`).
  - Automatic session auto-save in `localStorage` — page reloads or closed tabs never lose the game state.
  - Safe `↺ Reset` button in the header with confirmation modal.

---

## 🛠 Tech Stack

* **Frontend:** [React 19](https://react.dev/)
* **Bundler & Dev Server:** [Vite 8](https://vite.dev/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
* **Linter:** [Oxlint](https://oxc.rs/)
* **PWA:** `vite-plugin-pwa` (Service Worker, Offline caching)
* **CI/CD:** GitHub Actions + GitLab Pages

---

## 🚀 Quick Start

### Prerequisites
* [Node.js](https://nodejs.org/) v20+
* npm v10+

### Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run linter
npm run lint

# Build production bundle & PWA service worker
npm run build
```

---

## 👥 Branching Strategy (GitLab)

- `development` — Main active development branch (commits and PRs land here).
- `staging` — Stable release candidates for stakeholder testing.
- `master` — Production releases.
