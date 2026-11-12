# 🧙‍♂️ Blood on the Clocktower — Pocket Grimoire

[![Staging](https://img.shields.io/badge/Demo-Staging%20(v0.3.5)-10b981?style=for-the-badge&logo=githubpages&logoColor=white)](https://ivank-9.github.io/grimoire/)
[![Dev Build](https://img.shields.io/badge/Demo-Dev%20Preview-f59e0b?style=for-the-badge&logo=githubpages&logoColor=white)](https://ivank-9.github.io/grimoire/dev/)

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PWA Offline](https://img.shields.io/badge/PWA-Offline--First-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Oxlint](https://img.shields.io/badge/oxlint-0_warnings_0_errors-10b981?logo=oxc&logoColor=white)](https://oxc.rs/)
[![ADRs](https://img.shields.io/badge/ADRs-12_Recorded-3b82f6)](docs/decisions/README.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **A high-performance, offline-first Progressive Web App (PWA) crafted as an in-person physical companion tool for Storytellers running *Blood on the Clocktower*.**  
> Engineered for dark, noisy pub environments and mobile single-hand thumb navigation. Validated and playtested in live in-person games in Stockholm.

---

## 🌐 Live Deployments

| Environment | Purpose | URL |
|---|---|---|
| **Staging (Stable)** | Official stable release candidate (`v0.3.5`) for live games | [https://ivank-9.github.io/grimoire/](https://ivank-9.github.io/grimoire/) |
| **Dev (Preview)** | Continuous integration build tracking active branch | [https://ivank-9.github.io/grimoire/dev/](https://ivank-9.github.io/grimoire/dev/) |

---

## 🎯 The Problem & Product Vision

*Blood on the Clocktower* is an acclaimed social deduction board game. In physical sessions (bars, board game meetups, community clubs), the Storyteller must carry a cumbersome 3kg wooden/leather book ("The Grimoire") packed with dozens of magnetic tokens, reminders, and reference sheets.

**Common pain points in physical play:**
- 🎒 **Heavy physical bulk:** Carrying the full wooden grimoire to pub meetups is tedious.
- 🌑 **Low-light readability:** Pubs and event spaces are dimly lit; reading small cardboard tokens or screen glare spoils secret alignments.
- 📶 **Spotty connectivity:** Cell reception in basement venues and crowded pubs is notoriously unstable; cloud-dependent tools fail when needed most.
- ⚠️ **Accidental slips in the dark:** Dropping a token or clicking the wrong button in a digital tool can ruin a 90-minute game.

**Pocket Grimoire** solves this as a lightweight, zero-latency, offline-first mobile web application that runs directly on the Storyteller's phone.

---

## ⚡ Engineering & Architecture Highlights

### 1. Offline-First PWA Architecture ([ADR-0008](docs/decisions/0008-pwa-web-architecture.md))
- Built with **React 19**, **Vite 8**, and `vite-plugin-pwa` powered by **Workbox**.
- **100% offline capability:** All core bundles, SVGs, character metadata, and fonts are precached during service worker installation (`precache 12 entries, ~512 KiB`).
- Zero API or network dependencies during gameplay; runs seamlessly in airplane mode or basement venues.
- `display: standalone` with full `viewport-fit=cover` and safe-area insets support.

### 2. Immutable Domain State & 15-Step Non-Destructive Undo ([ADR-0009](docs/decisions/0009-ghost-votes-and-undo-history.md))
- Pure functional state transitions with deep immutability.
- **15-step circular undo/redo history stack:** Every player assignment, status change (Alive/Dead), shroud toggle, ghost vote consumption, and reminder token placement is tracked in an undo buffer.
- Real-time `localStorage` synchronization with schema versioning ensures state survives sudden browser reloads or incoming phone calls.

### 3. Circular Trigonometric Seating Geometry
- Dynamic polar coordinate generator translating arbitrary player counts ($N \in [5, 15+]$) into responsive 2D seating coordinates ($x = r \cdot \cos\theta, y = r \cdot \sin\theta$).
- Preserves accurate physical neighbor relationships, nomination order, and spatial orientation matching the actual table layout in the room.

### 4. Canonical Game Mechanics & Asymmetric Disguise Engine ([ADR-0007](docs/decisions/0007-assist-never-enforce.md), [ADR-0011](docs/decisions/0011-digital-deal-and-offscript-roles.md))
- **The Drunk Disguise Matrix:** Enforces pre-assignment of an unused Townsfolk role before bag distribution. The Storyteller sees the true Outsider role with a clear disguise badge, while public screens only display the fake identity.
- **Ghost Vote Tracking:** Implements canonical dead player mechanics where each deceased player possesses exactly one ghost vote for the remainder of the game.
- **Off-Script & Traveller Support:** Dynamic character injector allows injecting characters (e.g. Beggar, Gunslinger, Bureaucrat) or off-script roles without breaking base script constraints.

### 5. Low-Light Mobile Ergonomics & 60-30-10 Design System ([ADR-0012](docs/decisions/0012-mobile-first-ui-ux-refactor.md))
- **AMOLED Dark Palette:** 60% deep pitch background (`#09090b` zinc-950) preserving the Storyteller's night vision; 30% elevated surface containers (`zinc-800/900`); 10% high-contrast amber accent (`amber-500`) strictly reserved for primary call-to-actions.
- **Zero OS-Dependent Emojis:** Complete migration to monochrome vector SVGs via `lucide-react`, ensuring consistent rendering across iOS, Android, and desktop browsers.
- **Thumb-Zone Navigation:** Fixed bottom navigation with dynamic `env(safe-area-inset-bottom)` padding to avoid home bar conflicts on modern gesture-based devices.

### 6. Rigorous Software Architecture Documentation
- Documented via **12 Architecture Decision Records (ADRs)** capturing trade-offs, discarded alternatives (e.g., pivot from React Native to PWA), and long-term architectural visions.
- Validated with modern linting tooling (`oxlint` passing with 0 errors and 0 warnings).

---

## 📱 Feature Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                        POCKET GRIMOIRE WORKFLOW                        │
└────────────────────────────────────────────────────────────────────────┘
     │
     ▼
┌──────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│  1. THE BAG  │ ──► │ 2. TABLE CIRCLE  │ ──► │  3. NIGHT FLASHCARDS │
│  Setup roles │     │ Manage seating,  │     │ High-contrast silent │
│  & Drunk fake│     │ life, reminders  │     │ night communication  │
└──────────────┘     └──────────────────┘     └──────────────────────┘
```

### 🎒 1. The Bag (Setup & Team Balancer)
- Quick role selection grouped by team (*Townsfolk, Outsider, Minion, Demon*).
- Dynamic team balance calculator following official player count rules (5 to 15+ players).
- **Mandatory Drunk Disguise:** Prompts the Storyteller to choose which Townsfolk role the Drunk thinks they are before dealing.
- **Deal Options:** Supports both physical token dealing (marking tokens as drawn from the physical bag) and digital randomizer deal.

### 🪑 2. The Living Grimoire (Circular & List Views)
- **Interactive Polar Seating Chart:** Tap any seat to reassign roles, toggle Alive/Dead states, or assign reminders.
- **Canonical Ghost Votes:** 1-tap ghost vote counter showing remaining dead votes.
- **Storyteller Reminders Drawer:** Quick-access token reminders (*Poisoned*, *Protected*, *Nominated*, *Custom Note*).
- **Dual View Modes:** Seamlessly switch between the spatial Table Circle and an accessible linear Seating List.

### 🌙 3. Silent Night Flashcards (Pitch-Black Mode)
- Fullscreen `#000000` AMOLED display designed for non-verbal night phase communication without whispered spoilers.
- **Preset Prompts:** *"Choose a player"*, *"Point to 2 players"*, *"These are your Minions"*, *"This player is the Demon"*.
- **Quick Hand Gesture Signals:** Oversized high-contrast **YES / NO** cards and finger-count numbers (**0, 1, 2, 3**).
- **Token Flash:** 1-tap **Show** button directly from the seating chart to show any player their role token in pitch darkness.

### 📜 4. Script Engine & Official JSON Support
- Pre-loaded with the official **Trouble Brewing** edition (22 roles).
- Full compatibility with the official [Blood on the Clocktower Script Tool](https://script.bloodontheclocktower.com/) — upload any custom `.json` script file in one click.
- Built-in search, filtering, and team-based grouping for fast lookups.

---

## 🏛 Architecture Decision Records (ADRs)

All major architectural and product decisions are tracked as formal ADRs in [`docs/decisions/`](docs/decisions/README.md):

| ADR | Title | Status | Impact / Core Takeaway |
|:---:|---|:---:|---|
| **0001** | [Record decisions as ADRs](docs/decisions/0001-record-decisions-as-adrs.md) | `Proposed` | Established ADR standard for technical governance. |
| **0002** | [App framework: Expo, Android first](docs/decisions/0002-app-framework.md) | `Superseded` | Initial native app exploration (superseded by PWA in ADR-0008). |
| **0003** | [Character data and artwork from official sources](docs/decisions/0003-character-data-source.md) | `Proposed` | Schema design for official BotC script JSON compatibility. |
| **0004** | [Local storage with SQLite](docs/decisions/0004-local-storage.md) | `Superseded` | SQLite evaluation (superseded by reactive LocalStorage in ADR-0008). |
| **0005** | [Localisation: en, ru, sv](docs/decisions/0005-localisation.md) | `Proposed` | Multi-language roadmap for Swedish and Russian communities. |
| **0006** | [Private sideload distribution](docs/decisions/0006-distribution-and-delivery.md) | `Superseded` | APK sideloading superseded by instant PWA web deployment. |
| **0007** | [Assist, never enforce](docs/decisions/0007-assist-never-enforce.md) | `Accepted` | Philosophy: software assists the Storyteller without restricting house rules. |
| **0008** | [PWA Web Architecture](docs/decisions/0008-pwa-web-architecture.md) | `Accepted` | React 19 + Vite + Tailwind CSS + Workbox Service Worker. |
| **0009** | [Ghost Votes & Undo History](docs/decisions/0009-ghost-votes-and-undo-history.md) | `Accepted` | 15-step immutable undo/redo history buffer and dead vote mechanics. |
| **0010** | [Canonical Reminders & Travellers](docs/decisions/0010-canonical-reminders-and-all-travellers.md) | `Accepted` | Canonical reminder token catalog and cross-script Travellers support. |
| **0011** | [Digital Deal & Off-Script Roles](docs/decisions/0011-digital-deal-and-offscript-roles.md) | `Accepted` | Digital deal randomizer and dynamic off-script role allocation. |
| **0012** | [Mobile-First UI/UX Refactoring](docs/decisions/0012-mobile-first-ui-ux-refactor.md) | `Accepted` | 60-30-10 color hierarchy, Lucide monochrome SVGs, mobile safe-area insets. |

---

## 🛠 Tech Stack & Tooling

| Layer | Technology | Rationale |
|---|---|---|
| **Core Framework** | [React 19](https://react.dev/) | Latest React release leveraging functional components and concurrent optimizations. |
| **Build & Dev Tooling** | [Vite 8](https://vite.dev/) | Sub-second HMR and optimized production bundling with Rollup/Rolldown. |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern zero-runtime engine via `@tailwindcss/vite` for rapid utility-first UI design. |
| **Iconography** | [Lucide React](https://lucide.dev/) | 100% vector SVG icons replacing volatile platform-dependent system emojis. |
| **PWA & Offline** | [Vite PWA Plugin](https://vite-pwa-org.netlify.app/) | Generates production Service Worker with Workbox precaching and offline fallback. |
| **Code Quality** | [Oxlint](https://oxc.rs/) | Rust-powered high-speed linter running 100+ rules in milliseconds. |
| **CI / CD** | GitHub Pages & GitHub Actions | Dual-target automated pipeline delivering stable Staging and Dev preview builds. |

---

## 📂 Project Structure

```text
grimoire/
├── docs/                      # Architectural and product documentation
│   ├── decisions/             # 12 Architecture Decision Records (ADRs)
│   ├── domain/                # Game rules, mechanics, and terminology specifications
│   ├── requirements/          # Functional and non-functional requirements
│   ├── ux/                    # UI flows, screen blueprints, and UX guidelines
│   └── vision.md              # Long-term product roadmap and vision
├── src/
│   ├── assets/                # Static assets, SVG artwork, and icons
│   ├── components/            # Reusable UI components
│   │   ├── BagSetup.jsx       # Bag builder and team balance calculator
│   │   ├── CircularGrimoire.jsx # Trigonometric circular seating chart
│   │   ├── NightSheet.jsx     # Silent night pitch-black flashcards
│   │   ├── SeatingChart.jsx   # Linear seating list view
│   │   ├── ScriptUpload.jsx   # Official BotC JSON script importer
│   │   └── ...
│   ├── data/
│   │   ├── roles.js           # Trouble Brewing role database and canonical metadata
│   │   └── reminders.js       # Canonical reminder token definitions
│   ├── hooks/                 # Custom hooks (e.g. useGrimoireState with undo/redo)
│   ├── App.jsx                # Root application layout, navigation & state manager
│   ├── main.jsx               # PWA registration and React DOM entry point
│   └── index.css              # Tailwind CSS v4 design tokens and theme rules
├── dist/                      # Production build output
├── package.json               # Dependencies and execution scripts
├── vite.config.js             # Vite 8 & PWA configuration with multi-base support
└── README.md                  # Executive portfolio overview
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20+ (recommended LTS)
- **Package Manager**: npm v10+

### Local Setup
```bash
# 1. Clone repository
git clone https://github.com/IvanK-9/grimoire.git
cd grimoire

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your mobile browser or desktop devtools (with mobile simulation enabled).

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts local development server with instant HMR. |
| `npm run lint` | Runs `oxlint` across all JavaScript/JSX source files (0 warnings, 0 errors). |
| `npm run build` | Compiles production bundle to `dist/` with PWA service worker. |
| `npm run build:dev` | Compiles development preview bundle to `dist/dev/` for GitHub Pages. |
| `npm run preview` | Spawns a local preview server for the built production assets. |
| `npm run deploy` | Deploys the built distribution to GitHub Pages. |

---

## 💼 Portfolio Highlights & Resume Bullets

### Key Architectural Strengths to Highlight in Interviews:
1. **Product Discipline & Real-World Validation:** Not a toy clone or generic to-do app. The project was conceived, iterated, and tested in live tabletop sessions with physical users in Stockholm, translating real user friction into rapid UX pivots.
2. **Offline-First Resilience:** Engineered to function reliably in harsh network conditions (underground pub cellars) with sub-550 KB precached asset footprints.
3. **Complex Domain State Management:** Handled non-trivial asymmetric game rules (Drunk disguise paradox, ghost votes, alive/dead transitions) coupled with an immutable 15-step undo history buffer.
4. **Architectural Governance:** Authored 12 formal Architecture Decision Records (ADRs) articulating trade-offs, pivot decisions (React Native to PWA), and maintainability guarantees.

---

## 📜 Disclaimer & License

*Blood on the Clocktower* is a trademark of Steven Medway and [The Pandemonium Institute](https://bloodontheclocktower.com/). This project is an unofficial community companion tool designed to assist Storytellers and is not affiliated with or endorsed by The Pandemonium Institute.

Source code is released under the [MIT License](LICENSE).
