# CLAUDE.md

LED Scroll: an installable PWA (React + TypeScript + Vite) that turns a phone into a scrolling LED sign, in Spanish and English. Live at https://oficinamentaldebruno.com/ledscroll/ and https://gerardoleon.dev/ledscroll/ (a Cloudflare Worker in `cloudflare/` forwarding to GitHub Pages at https://elparaquecosadeque.github.io/ledscroll/).

Read these before writing code:

- [`CODE_STYLE.md`](CODE_STYLE.md): architecture, conventions and testing rules.
- [`STACK.md`](STACK.md): approved and forbidden libraries, and this project's choices.
- [`docs/adr/`](docs/adr/): decisions that deviate from or extend the two files above.
- [`DECISIONS.md`](DECISIONS.md): smaller decisions so far.

## Commands

- `npm run dev`: dev server, reachable from a phone on the same network.
- `npm run check`: format check, lint, type check and unit tests (what CI runs).
- `npm run format`: apply Prettier.
- `npm run build` / `npm run preview`: production build and serve it locally (the service worker only runs here).

## Working rules

- **TDD:** write the failing test first, then the simplest code that passes, then refactor. Logic goes in plain modules (`src/*.ts`) and is tested with `node:test`.
- **No new packages** without asking first. If one seems necessary, explain why the platform or the approved stack can't cover it.
- **Never use a forbidden library**, even as a temporary workaround.
- When a decision isn't covered by the docs, ask, and propose an ADR for it.
- **Keep ADRs and the baseline in sync:** an ADR that adds or changes a rule updates `CODE_STYLE.md` or `STACK.md` in the same commit, and the changed line links to the ADR. Never edit an accepted ADR; supersede it.
- **Log smaller decisions** in [`DECISIONS.md`](DECISIONS.md) as you make them (decision, why, who decided), in the same commit as the change.
- **Every user-facing string** goes in `src/strings.ts`, in both languages.
- **Conventional Commits** (`feat:`, `fix:`, `chore:`, …), on a short-lived branch, never directly on `master`. Pushing to `master` deploys.
- Run `npm run check` before declaring a task done, and look at the change in a browser when it touches the UI.

## Skills

| Skill          | Use it for                                                                |
| -------------- | ------------------------------------------------------------------------- |
| **grill-me**   | Maturing informal requests into clear requirements before implementation. |
| **ponytail**   | Keeping dependencies low; challenge every new package against `STACK.md`. |
| **impeccable** | Mockups and UI/UX definition, using the theme tokens in `src/style.css`.  |
