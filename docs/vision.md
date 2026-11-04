# Vision

**Status:** Draft, 2026-11-04

## Problem

Running a game of Blood on the Clocktower means the Storyteller has to track every player's character, alive/dead state, ghost vote and reminders, usually with a physical grimoire. Physical grimoires are bulky and slow to set up. The existing digital tools are mostly built for online play or need a network connection.

## Target user

The **Storyteller** running an in-person game, holding a phone in portrait orientation, possibly without a network connection.

## Goals

- Run a full in-person game from a phone, fully offline.
- Set up a game faster than with a physical grimoire.
- Never lose game state, even if the app is killed mid-game.
- Support English, Russian and Swedish.

## Principles

1. **Assist, never enforce.** The app MUST NOT stop the Storyteller from doing something, or force them to do something. It may only point out that something isn't working, won't work, or should be done, through warnings, hints and suggestions. The Storyteller always has the final say, because house rules, homebrew, mistakes being fixed and deliberate rule-bending are all a normal part of the game. See [ADR 0007](decisions/0007-assist-never-enforce.md).

## Non-goals (for now)

- Online play, or players connecting with their own devices.
- Public store release. See [ADR 0006](decisions/0006-distribution-and-delivery.md).
- Rules enforcement or automatic resolution of abilities. The Storyteller stays in control (see [Principles](#principles)).

## Delivery phases

The MVP is delivered in phases: ship early, then iterate.

| Phase | Content |
|---|---|
| 1. Minimal board | Default scripts, game setup, grimoire board (seats, alive/dead, ghost vote), multiple saved games. English, text only. |
| 2. Richer grimoire | Reminder tokens, character artwork, in-app script builder. |
| 3. Localisation & history | Russian and Swedish, history of finished games. |
| Later | Script import and fetch, night order guide, show-to-player screens. |

See [requirements](requirements/README.md) for the detail.

## Stakeholders

| Role | Who |
|---|---|
| Stakeholder (Storyteller), product owner, architect | Project owner |
