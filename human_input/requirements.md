# Human Decisions & Product Requirements

> **CRITICAL RULE FOR ALL AI AGENTS & CODING ASSISTANTS:**
> This folder (`human_input/`) is strictly **HUMAN-ONLY**. 
> AI agents MUST NEVER modify, overwrite, truncate, or delete any files inside this folder.
> Access mode: **READ-ONLY**.

---

## 1. Initial Product Vision & Competitor Pain Points
*Source: Sergey (04.11.2026)*

- **Problem with https://botc.games/play:** Suboptimal UX. It requires naming a player from the top before assigning their role.
- **Problem with BOTCH (Google Play):** Unusable / poor visual design.
- **Goal:** Lightweight, responsive Pocket Grimoire web app optimized for mobile (Android-first).

---

## 2. MVP Scope Agreement
*Source: Decisions from Sergey & team (04.11 - 05.11.2026)*

1. **Custom Scripts Support:**
   - Must support importing scripts from the official script editor: https://script.bloodontheclocktower.com/ (official JSON format).
2. **Physical Token Distribution Workflow:**
   - Players draw real physical tokens from a physical bag.
   - The app records the bag contents and who drew which token, rather than doing digital random distribution.
3. **Drunk Disguise Pre-assignment (Key Feature):**
   - Ability to assign the Drunk to a fake Townsfolk disguise *before* dealing tokens.
   - The physical bag receives the fake Townsfolk token, while the Storyteller grimoire reflects that the player is actually the Drunk.
4. **1-Tap Seating:**
   - Fast token assignment without mandatory player names (names are optional and can be edited on the fly).
5. **No Reminder Tokens for MVP:**
   - In-game status tracking (poisoned, protected, alive/dead ghost votes) is explicitly excluded from the MVP.
6. **Delivery Target:**
   - Deliverable to phones via browser / PWA for quick team feedback and testing during actual gaming events.

---

## 3. Communication Log & Context
- Team platform: Mostly Android devices.
- Canonical repo discussion: https://gitlab.com/commi-union/botc/botc-pocket-grimoire

---

## 4. Extended Scope & Field Testing Feedback
*Source: Sergey & Emanuel (05.11 - 06.11.2026)*

1. **Official UI / UX Reference (botc.app):**
   - Reference the official online app (https://botc.app/). Matching standard terminology, token iconography, and familiar layout patterns will make the app instantly intuitive for experienced Storytellers.

2. **Web vs Mobile & Offline-First:**
   - Consensus: Web-first via **Progressive Web App (PWA)**.
   - Must be fully offline-capable (cached assets + service worker) because games frequently take place in basements, bars, and venues without reliable mobile reception.

3. **Data Privacy & Architecture (Sergey's Reqs):**
   - **Full Script Builder:** Ability to assemble custom scripts directly in the app choosing from the complete roster of all known BotC characters (Trouble Brewing, Bad Moon Rising, Sects & Violets, Experimental).
   - **Local History & Saved Scripts:** Persist custom scripts and past game session logs (rosters, seating, winners).
   - **Zero Account Obligation:** No login, registration, or third-party auth required for core features. All data must reside locally on the device (Local-first / IndexedDB / LocalStorage) with optional JSON export/import.

4. **Night Silent Communication / Big Text Mode (Emanuel & Sergey's Key Feature):**
   - *Problem:* Storytellers must remain completely silent during the night to avoid acoustic tells. Emanuel currently relies on a separate third-party "big text" app on his phone.
   - *Requirements:*
     - Fullscreen, high-contrast, large-font flashcard mode readable from 1–1.5m in the dark.
     - Built-in prompt presets matching official night communication ("Choose a player", "Choose a character", "These are your minions", "This player is...").
     - Free-text input on the fly for custom instructions.
     - Integration with character tokens: ability to display both the prompt text and the corresponding character token (e.g. showing a Washerwoman candidate).

