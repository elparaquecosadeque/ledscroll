# 0001: Scaled-down baseline for a one-screen app

- **Status:** Accepted
- **Date:** 2026-11-09
- **Decided by:** user (asked for the "proportional version" of the baseline)

## Context

[`CODE_STYLE.md`](../../CODE_STYLE.md) is written for multi-feature apps with a backend. LED Scroll is one screen, has no backend, no routing and no login. Applying every rule would add folders, packages and files with nothing in them.

## Decision

LED Scroll follows the baseline with these deviations:

1. **Flat `src/`** instead of `core/ features/ shared/`: `components/`, `hooks/`, and plain modules at the root of `src/`. The dependency rules become one: plain modules never import components or hooks.
2. **One stylesheet** (`src/style.css`) with theme tokens on `:root`, instead of a CSS Module per component.
3. **`node:test` only**, no Vitest or React Testing Library: the logic worth testing (scrolling, share-link parsing) lives in plain modules. Components are checked by looking at them in a browser.
4. **No end-to-end tests or coverage gate yet.**
5. **No HTTP, session, forms, config or clock modules**: there is nothing for them to do.

## Consequences

- Fewer files and packages; `npm run check` stays fast.
- Component behavior (dialog, saved messages, share button) has no automated test. Revisit when a component gains logic that can't move into a plain module, or when a regression slips through: that is the trigger for Vitest + React Testing Library, and Playwright for the install and fullscreen flows.
- Revisit 1 and 2 when a second screen appears.
