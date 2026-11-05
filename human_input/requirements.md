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
