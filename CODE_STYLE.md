# Code style

Baseline conventions for **React frontends** (TypeScript, Vite). It is the React counterpart of the ASP.NET Core + Angular baseline: the principles, process and quality gates are the same, and the Angular rules are translated to React. Library choices live in [`STACK.md`](STACK.md); project-specific deviations are recorded as ADRs in [`docs/adr/`](docs/adr/).

> In the examples, `<feature>` is a domain feature in plural (`orders`, `customers`, …). A feature called `orders` is used for illustration.

## Principles

- **Readability first.** Code is read far more often than it is written. Prefer short files that can be understood at a glance over a few large files.
- **Separation of concerns.** Components render and handle interaction; hooks hold state and effects; plain modules hold logic and I/O. Logic that doesn't need React doesn't import React.
- **SOLID, the React way.** One reason to change per component or hook; components depend on props and hooks, not on how data is fetched.
- **TDD.** Behavior is specified by a failing test first: red → green → refactor.
- **Few dependencies.** Before adding a package, check whether the platform (browser APIs, CSS, React itself) already covers the need. Every new package needs a reason and goes through [`STACK.md`](STACK.md).

---

## Version and defaults

- The **latest stable major** of React and Vite, kept on a version under active support.
- Function components only; no class components.
- **TypeScript `strict`**, plus `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` and `erasableSyntaxOnly` (type-only imports are marked `import type`; no enums or namespaces, so Node can run the sources directly).
- Imports include the file extension (`./settings.ts`), so the same file runs under Vite and under Node's test runner.

## One concern per file

- One component per file, named after it in PascalCase: `OrderList` → `OrderList.tsx`. Its tests sit next to it: `OrderList.test.tsx`.
- Styles: a CSS Module per component (`OrderList.module.css`) once the app has more than one screen; a single stylesheet is fine below that (see ADRs).
- Hooks: one per file, `useThing.ts`, in a `hooks/` folder.
- Non-component modules are camelCase or kebab-case with a type suffix where it adds meaning: `orders.api.ts`, `order.model.ts`, `sign.constants.ts`, `price.utils.ts`.
- One model per file; models are plain TypeScript `interface`s or `type`s, mirroring the backend DTOs when there is a backend.
- Small helpers used by one component stay in its file, **below** the component and outside it (module scope), so they aren't recreated on every render and read as "details after the main thing".

## Core / Features / Shared

For apps with more than one feature:

```
src/
├─ main.tsx                 entry point: providers, router, service worker; reads like a table of contents
├─ core/                    app-wide singletons, loaded once
│  ├─ api/                  client.ts (the only fetch wrapper), api-error.model.ts
│  ├─ layout/               shell, header, nav
│  ├─ session/              session context + hook
│  └─ config.ts             validated environment settings
├─ features/
│  └─ orders/               one folder per feature, lazy-loaded
│     ├─ components/        presentational pieces of this feature
│     ├─ pages/             routed components
│     ├─ hooks/             useOrders.ts (state + effects for this feature)
│     ├─ orders.api.ts      HTTP calls for this feature, through core/api/client.ts
│     ├─ order.model.ts
│     └─ orders.routes.tsx
└─ shared/                  reusable, feature-agnostic building blocks
   ├─ components/
   ├─ hooks/
   └─ utils/
```

A single-feature app may stay flat (`components/`, `hooks/`, modules at the root of `src/`) until a second feature appears; record that choice in an ADR.

### Dependency rules

- `features/*` may import from `core/` and `shared/`, **never** from another feature. If two features need the same thing, move it to `shared/` (UI, pure helpers) or `core/` (state and services).
- `shared/` never imports from `features/` or `core/`.
- `core/` never imports from `features/`.
- Enforced with ESLint's built-in `no-restricted-imports` (no plugin needed).

## Responsibilities

- **Components**: presentation and user interaction. They never call `fetch`; they use hooks.
- **Shared components**: data in through props, events out through callback props (`onChange`, `onSelect`). They never call the API or read feature state.
- **Pages**: routed components that compose feature components and wire them to hooks.
- **Hooks**: state, effects and subscriptions (`useOrders`, `useWakeLock`). Each effect cleans up what it starts.
- **API modules**: HTTP calls only, through `core/api/client.ts`. Every async function takes an `AbortSignal` and passes it on; effects abort on unmount.
- **Plain modules**: logic with no React (parsing, math, mapping). This is where most unit tests live.

## UI and accessibility

- UI components come from the design-system library in [`STACK.md`](STACK.md), or native elements when there is none. Check it before building a custom component.
- The theme (palette, typography, spacing) is defined once as CSS custom properties on `:root`. Components use the tokens, never hard-coded colors or fonts. Colors that are user content (a color picker's swatches) are data, not theme.
- **Accessibility:** every form control has a label (a wrapping `<label>` or `aria-label`), every interaction works with the keyboard, native elements come before ARIA (`<dialog>`, `<details>`, `<input type="checkbox">` styled as a switch), and critical flows are checked automatically (see [Testing](#testing)).
- Internationalization: deferred until a project needs it (ADR). The lightest option is one typed dictionary per language, where the second language is typed as the first so a missing string fails the type check.

## State

- `useState` / `useReducer` for component state; custom hooks for feature state; context only for app-wide state (session, theme, language).
- Derive instead of storing: anything computable from props or state is computed during render.
- No state-management or server-cache library in the baseline (Redux, Zustand, TanStack Query, …). Adopting one requires an ADR.
- Browser storage (`localStorage`) only for user preferences and drafts, always inside `try/catch`, never for tokens or secrets.

## Forms

- Controlled inputs with typed state. No form library in the baseline; adopting one requires an ADR.
- 400 validation errors from the API are mapped onto the matching fields.

## HTTP, session and errors

- **One fetch wrapper** (`core/api/client.ts`) does what Angular's interceptors do, in this order: send `X-Correlation-Id`; attach the access token; on a 401, refresh **once** and retry, and sign out if refresh fails; turn `ProblemDetails` into a typed `ApiError`. Components never inspect raw HTTP errors.
- 400 → form errors; 403/404/409/422 → a toast with the message; 500 → a generic message, details logged.
- **Session:** the access token lives **in memory only** (a module variable behind the session hook), with the user's permissions from the API's `/me` endpoint. Never in `localStorage` or `sessionStorage`.
- **Refresh token:** an HttpOnly, Secure, SameSite=Strict cookie scoped to the refresh endpoint; JavaScript never reads it.
- **Route guards and visibility:** routes and UI elements are shown or hidden from the session's permissions (a `<RequirePermission>` wrapper or a route loader). This is convenience only; the API always enforces.
- **Local development:** Vite's dev server proxies `/api/*` to the local backend (`server.proxy`), so there is no CORS locally.

## Configuration and time

- `import.meta.env` is read in **one** module (`core/config.ts`) and validated on boot; a missing setting fails at startup, not mid-session. Everything in the bundle is public: no secrets, ever.
- Code that depends on "now" takes the time from an injectable clock (a module or a parameter), so tests can fix it. Ban direct `Date.now()` / `new Date()` in logic with ESLint's `no-restricted-syntax` once a project has time rules.

## Input from outside

- URL parameters, `postMessage`, storage and API responses are untrusted. Parse them at the boundary into typed values (keep known keys, check types, clamp ranges) before they reach components.

## Testing

Write the failing test first, make it pass with the simplest code, then refactor. Tests describe behavior, not implementation.

| Kind       | Covers                                                               | Runner                                                                                                                  |
| ---------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Unit       | Plain modules, hooks, logic-heavy components. **The main TDD loop.** | Node's built-in `node:test` for plain modules; Vitest + React Testing Library once components or hooks are tested (ADR) |
| Component  | Rendered DOM and public props/callbacks, never internals or state    | React Testing Library                                                                                                   |
| End-to-end | Critical user flows only, with automated accessibility checks (axe)  | Playwright                                                                                                              |

- **Naming:** a test reads as `<behavior> when <condition>`: `it('rejects the order when lines are empty')`. No function names in test names, so they survive refactors.
- Arrange / Act / Assert, one behavior per test.
- **TDD** for logic, hooks and API modules; purely presentational components are tested after.
- **Doubles:** substitute only the boundaries (network, clock, storage). Mock the network with Playwright's `page.route` (or MSW after approval), never your own modules.
- **Test data:** one builder per type in `src/test/builders/` (`order.builder.ts`) once setup grows past a few lines.
- End-to-end runs cover both locales when the app has two, e.g. English on desktop and Spanish on a phone viewport.

---

# Quality gates

## Local vs CI

- **Locally:** ESLint and TypeScript report as you work; Prettier formats on save.
- **CI:** strict. `npm run check` must pass: `prettier --check`, `eslint --max-warnings 0`, `tsc`, unit tests. Then the production build.

## CI pipeline

1. `npm ci`
2. Format check, lint (warnings are errors), type check, unit tests.
3. Banned packages (see [`STACK.md`](STACK.md)).
4. Coverage threshold on logic modules, once agreed (ADR).
5. Production build.
6. End-to-end tests for critical flows.
7. Deploy from the default branch only.

## Git workflow

- **Trunk-based:** short-lived branches, pull requests into the default branch.
- **Conventional Commits:** `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`; a breaking change is marked with `!`.
- A pull request needs green CI and includes the tests for the change.
- Line endings are LF everywhere (`.gitattributes`).

---

# Documentation

- **`README.md`**: how to run, test and build locally.
- **`STACK.md`**: approved and forbidden libraries, and per-project choices.
- **`docs/adr/`**: one Architecture Decision Record per significant decision or deviation from this guide, numbered `NNNN-title.md`, using [`docs/adr/0000-template.md`](docs/adr/0000-template.md).
- **`DECISIONS.md`**: smaller decisions, newest first, with who decided.
- **`CLAUDE.md`**: entry point for coding agents; points to this guide, `STACK.md` and the skills used in the project.
