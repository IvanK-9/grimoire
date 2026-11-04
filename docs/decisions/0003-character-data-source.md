# 0003: Character data and artwork from official sources

**Status:** Proposed · **Date:** 2026-11-04 · **Decided by:** Product owner

## Context
The setup helper, the board and the script builder need a character database: name, team, ability, reminders, night order and artwork. Blood on the Clocktower characters, texts and artwork are the intellectual property of The Pandemonium Institute.

## Decision
- Copy character data and artwork from official sources and bundle them in `data/` for offline use.
- Record where each data set came from (URL, date) in `data/README.md`.
- Keep the data separate from app code so that it can be replaced.

## Alternatives considered
- **Text only, our own placeholder icons:** lower IP exposure, but weaker recognition at the table.
- **The user imports the data/artwork:** lowest IP exposure, but more setup effort.

## Consequences
- Best experience for the Storyteller, at no design cost.
- **Known risk:** this is acceptable only while distribution is private (see [ADR 0006](0006-distribution-and-delivery.md)). A public release requires a new ADR: either permission from The Pandemonium Institute, or switching to user-imported data.

## Links
- Requirements: [R-002](../requirements/R-002-default-scripts.md), [R-007](../requirements/R-007-character-artwork.md), [R-008](../requirements/R-008-script-builder.md)
