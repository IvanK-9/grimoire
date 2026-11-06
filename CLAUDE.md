# CLAUDE.md

Instructions for AI agents working in this repo.

## Project

An offline mobile assistant for the Blood on the Clocktower Storyteller. Start with [docs/vision.md](docs/vision.md).

## Core principle: assist, never enforce

The app MUST NOT stop the Storyteller from doing something, or force them to do something. It may only highlight that something isn't working, won't work, or should be done. Validation means non-blocking warnings, automation is offered and never imposed, and every state can be edited at any time. Every requirement, design and piece of code must follow this. See [ADR 0007](docs/decisions/0007-assist-never-enforce.md).

## Documentation rules

- **Requirements** (`docs/requirements/`) describe *what* the app does. Use one file per requirement, named `R-NNN-short-name.md`. IDs are never reused. Keep the index in `docs/requirements/README.md` up to date.
- **Decisions** (`docs/decisions/`) describe *why*, as ADRs named `NNNN-short-name.md`. An accepted ADR is not rewritten: write a new ADR that supersedes it and set the old one's status to `Superseded by NNNN`. Keep the index in `docs/decisions/README.md` up to date.
- Link requirements and ADRs to each other in both directions.
- Use the terms in [docs/glossary.md](docs/glossary.md) exactly. Add any new terms there.
- Before changing or adding a decision, check with the product owner. Don't record assumptions as accepted.

## Code

- The app lives in `app/` (Expo, TypeScript). See [ADR 0002](docs/decisions/0002-app-framework.md).
- Character and script data lives in `data/`. See [ADR 0003](docs/decisions/0003-character-data-source.md).
