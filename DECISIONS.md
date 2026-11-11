# Decisions log

Smaller decisions made while developing, newest first. A decision that changes a rule in `CODE_STYLE.md` or `STACK.md`, or that is hard to reverse, gets an ADR in [`docs/adr/`](docs/adr/) instead, and only a one-line pointer here.

Each entry has the decision, the reason, and who decided (**user**, or **dev** when it was taken while implementing and not objected to).

## 2026-11-09: Architecture diagram and font exception

| Decision                                                                                                                                                                  | Why                                                          | By         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------- |
| One Excalidraw diagram of the wiring, `docs/architecture/wiring.excalidraw`, with an SVG copy for GitHub. Re-export the SVG from Excalidraw whenever the diagram changes. | Asked by the user; GitHub renders SVG but not `.excalidraw`. | user / dev |
| Roboto is exempt from Impeccable's overused-font rule (`.impeccable/config.json`).                                                                                        | The font picker mirrors the reference app's Roboto variants. | user       |

## 2026-11-09: Guidelines and TypeScript

Larger decision: [ADR 0001](docs/adr/0001-scaled-down-baseline.md) (scaled-down baseline for a one-screen app).

| Decision                                                                                                                                                                | Why                                                                                                                      | By   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---- |
| Adopt a React baseline (`CODE_STYLE.md`, `STACK.md`, `CLAUDE.md`) derived from the ASP.NET Core + Angular one.                                                          | Same principles and process across projects; the Angular rules translated to React.                                      | user |
| TypeScript `strict`, ESLint (with React Compiler rules) and Prettier.                                                                                                   | Asked for as part of the proportional baseline.                                                                          | user |
| Tests run on Node's built-in `node:test`, with imports that include `.ts` and `erasableSyntaxOnly`, so Node runs the sources without a build step. CI moves to Node 24. | No test package needed for plain-module tests; Node 22.18+ strips types natively.                                        | dev  |
| Share links are parsed by `toLook`: unknown keys dropped, values kept only when their type matches the default, direction limited to -1/0/1.                            | A share link is untrusted input; an object where text is expected would crash the render. Covered by `settings.test.ts`. | dev  |
| `es` strings are typed as `Strings` (the English shape).                                                                                                                | A missing Spanish string fails the type check instead of showing `undefined`.                                            | dev  |
| Theme colors moved into `:root` tokens; rainbow keyframes and the color swatches keep their literal colors.                                                             | Those are the effect and user content, not theme.                                                                        | dev  |
| `sample-guidelines/` is git-ignored.                                                                                                                                    | It holds another project's internal details.                                                                             | user |
| Line endings LF (`.gitattributes`).                                                                                                                                     | Stops the CRLF warnings on every commit.                                                                                 | dev  |

## 2026-11-09: Icon and install help

| Decision                                                                                                                                                                                               | Why                                                                                   | By         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ---------- |
| One LED dot-matrix SVG is the favicon; the PNG install icons (512, 192, 180) are rendered from it.                                                                                                     | One source, sharp in the tab; full-bleed black so Android's icon masks don't crop it. | dev        |
| The Install button opens per-OS steps (iOS, Android, desktop), opening the current OS's section, and adds "Install now" where the browser offers `beforeinstallprompt`. Hidden when already installed. | iOS has no install prompt, so instructions are the only path there.                   | user / dev |

## 2026-11-09: Features from the reference app, and extras

| Decision                                                                                                                                                                                                         | Why                                                                                    | By         |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------- |
| Rebuild the paid LED-scroller app the user tested (video), as a PWA installable on iOS and Android.                                                                                                              | Paying for something this simple seemed unfair; a PWA covers both OSes without stores. | user       |
| Features: text, direction left/pause/right, speed, blink + frequency, keep screen on, fonts, size, text and background colors, fullscreen start, Spanish/English switch. Skipped: PRO, widget, audio, wallpaper. | What the video showed, minus paid extras that a web app can't do on iOS.               | user / dev |
| Speed and font size are relative to the sign's height.                                                                                                                                                           | The preview and fullscreen look and feel the same.                                     | dev        |
| Fullscreen on a phone held upright rotates the sign 90° with CSS.                                                                                                                                                | iPhone Safari can't lock orientation; the sign should run along the long edge.         | dev        |
| Pause re-centers the text, and keeps it centered after text, font or size changes.                                                                                                                               | Asked by the user.                                                                     | user       |
| LED dot size slider (2–20 px), the same in preview and fullscreen.                                                                                                                                               | Asked by the user.                                                                     | user       |
| Saved messages store the whole look; glow; rainbow; brightness; share links in the URL hash.                                                                                                                     | Suggested by dev, all accepted by the user.                                            | user       |
| Fonts from Google Fonts; the service worker caches every GET (stale-while-revalidate), fonts included.                                                                                                           | Works offline after the first visit without a PWA plugin.                              | dev        |
| Deploy with GitHub Actions to Pages; the `github-pages` environment was opened to `master` by the user.                                                                                                          | Vite needs a build step, so branch-based Pages can't serve the sources.                | user / dev |
