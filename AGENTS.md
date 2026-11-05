# AI Agent Guidelines

## Strict Directory Boundaries
- `human_input/`: Contains human-authored specifications, decisions, and meeting notes.
- **RULE**: AI agents and automated tools MUST NEVER edit, modify, overwrite, or delete any file in `human_input/`. This directory is strictly read-only for all AI assistants (Gemini, Claude, Copilot, etc.).
- All AI-generated implementation code lives in `src/`, config files, or build scripts.
