# ParkEx Garage Marketplace

## Standards
- Versioning: SemVer (`MAJOR.MINOR.PATCH`).
- Commits: Conventional Commits; reference task/bug IDs when relevant (e.g., `feat(TASK-002): ...` or `fix(BUG-001): ...`).
- Lint/format: Biome (`npm run lint`, `npm run format`, `npm run check`).
- Hooks: Husky runs commitlint on `commit-msg`.

## Setup
1) Install deps: `npm install`
2) Enable hooks: `npm run prepare`
3) Utvikling: `npm run dev`
4) Bygg: `npm run build` og start: `npm run start`

## Commit message examples
- `feat(TASK-006): add seller listing form`
- `fix(BUG-001): prevent bids after deadline`

## Release notes
- Use SemVer; breaking changes bump MAJOR, backwards-compatible features bump MINOR, fixes bump PATCH.
- Capture notable changes per release in `CHANGELOG.md` (to be generated when release workflow is added).

