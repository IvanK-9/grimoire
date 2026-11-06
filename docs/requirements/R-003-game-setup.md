# R-003: Game setup helper

**Phase:** 1 · **Priority:** Must · **Status:** Draft

## User story
As the Storyteller, I want the app to help me pick the characters for a game so that setup is quick and correct.

## Acceptance criteria
- [ ] The Storyteller enters the player count and, optionally, player names. Any count is allowed; outside 5–15 the app shows a warning.
- [ ] The app shows the standard team counts for that player count, as guidance:

  | Players | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
  |---|---|---|---|---|---|---|---|---|---|---|---|
  | Townsfolk | 3 | 3 | 5 | 5 | 5 | 7 | 7 | 7 | 9 | 9 | 9 |
  | Outsiders | 0 | 1 | 0 | 1 | 2 | 0 | 1 | 2 | 0 | 1 | 2 |
  | Minions | 1 | 1 | 1 | 1 | 1 | 2 | 2 | 2 | 3 | 3 | 3 |
  | Demons | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |

- [ ] The Storyteller can pick characters by hand, or let the app draw a random set that matches the counts.
- [ ] The app warns when the selection doesn't match the counts, but never blocks it.
- [ ] When a setup modifier is in play (Baron, Godfather, Fang Gu…), the app suggests the adjusted counts. The Storyteller can accept the suggestion or ignore it.
- [ ] Characters are assigned to seats, either randomly or by hand.
- [ ] Every setup step is optional and can be skipped or revisited. The Storyteller can start the game at any point, including with an incomplete setup.

## Notes / open questions
- Can Travellers be added at setup?

## Links
- ADR: [0007 Assist, never enforce](../decisions/0007-assist-never-enforce.md)

## Links
- Requirement: [R-004](R-004-grimoire-board.md)
