# Stack

Approved and forbidden libraries. Adding a package means asking first and recording it here, with the reason the platform or the approved stack can't cover the need ([`CODE_STYLE.md`](CODE_STYLE.md#principles)).

## Approved (baseline)

| Need                       | Choice                                                                   | Notes                                                        |
| -------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------ |
| UI                         | `react`, `react-dom`                                                     | Function components only                                     |
| Build and dev server       | `vite`, `@vitejs/plugin-react`                                           |                                                              |
| Language                   | `typescript`, `@types/react`, `@types/react-dom`, `@types/node`          | `strict`; `@types/node` only for `node:test` files           |
| Lint                       | `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks` | Flat config; React Compiler rules included via `react-hooks` |
| Format                     | `prettier`                                                               |                                                              |
| Unit tests (plain modules) | Node's built-in `node:test`                                              | No package                                                   |

## Approved when needed (ask first, then record the ADR)

| Need                           | Choice                                                                     |
| ------------------------------ | -------------------------------------------------------------------------- |
| Component and hook tests       | `vitest`, `@testing-library/react`, `@testing-library/user-event`, `jsdom` |
| End-to-end and accessibility   | `@playwright/test`, `@axe-core/playwright`                                 |
| Coverage                       | `@vitest/coverage-v8`                                                      |
| Routing (more than one screen) | `react-router`                                                             |
| Network mocking in unit tests  | `msw`                                                                      |

## Forbidden

| Library                                            | Use instead                                                                               |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `axios`, `superagent`                              | `fetch` through `core/api/client.ts`                                                      |
| `lodash`, `underscore`, `ramda`                    | Standard library (`Array`, `Object`, `structuredClone`, `Intl`)                           |
| `moment`                                           | `Intl.DateTimeFormat`, `Date`; `Temporal` where supported                                 |
| `jquery`                                           | The DOM and React                                                                         |
| Runtime CSS-in-JS (`styled-components`, `emotion`) | CSS Modules and CSS custom properties                                                     |
| `create-react-app`                                 | Vite                                                                                      |
| `uuid`                                             | `crypto.randomUUID()`                                                                     |
| `classnames`, `clsx`                               | A template literal or `[a && 'x'].filter(Boolean).join(' ')`                              |
| `vite-plugin-pwa`, Workbox                         | A hand-written `manifest.webmanifest` and `sw.js`, until caching needs outgrow them (ADR) |

## This project (ledscroll)

- No backend, no routing, no design-system library: native elements styled with the tokens in `src/style.css`.
- Fonts: Google Fonts stylesheet, cached by the service worker for offline use.
- Hosting: GitHub Pages, deployed by `.github/workflows/pages.yml` from `master`. Custom domains (`oficinamentaldebruno.com/ledscroll`, `gerardoleon.dev/ledscroll`) go through a Cloudflare Worker, `cloudflare/ledscroll-proxy.js`, pasted into the Cloudflare dashboard (no Wrangler package).
