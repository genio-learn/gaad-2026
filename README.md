# The Reverse Accessibility Lab · by Genio
A five-room challenge that lives permanently on the Genio website. Each room is **deliberately inaccessible** for the way most people use a computer, so visitors can experience some of the barriers students with disabilities face with digital tools, and the assistive technology or settings that get them through.

Each room hides a one-word clue; the five clues together form the final code (checked on `/final/`).

Originally built for Global Accessibility Awareness Day (GAAD) 2026.

This was all vibe coded so... yeah...

## The rooms
| Room | Simulates | Clue |
| --- | --- | --- |
| 1 — Keyboard only | Students who can't use a mouse | `FOCUS` |
| 2 — Screen reader | Blind and partially sighted students | `SEMANTIC` |
| 3 — Voice control | Students who control their computer by voice | `VOICE` |
| 4 — Zoom & magnification | Students with low vision | `REFLOW` |
| 5 — Reduced motion | Students sensitive to motion on screen | `MOTION` |

Every room has a "What this room simulates" box and an "I can't work this out" panel that walks through the solution, explains why it matters for students and, as a last resort, reveals the clue.

## The violations are intentional
The rooms break WCAG criteria **on purpose**. Every one is documented on [`/about/`](public/about/index.html). Keep that page up to date when changing a room, and don't "fix" a room's barriers without checking they aren't the point. The landing, about and final pages are not part of the challenge and should stay fully accessible.

## Deployment
This repo contains a [GitHub Action](https://github.com/genio-learn/gaad-2026/blob/main/.github/workflows/deploy.yml) which runs on commits to `main` and deploys changes to GitHub Pages, with the live version at [genio-learn.github.io/gaad-2026](https://genio-learn.github.io/gaad-2026/).

All internal links are relative, so the site can be hosted under any sub-path.

## Building
To build and run this website locally you can use the included NPM scripts like so;

```sh
# Install dependencies
npm install

# Start web server, changes are served on refresh (use npm run dev for live-reload)
npm start   # Serves under http://localhost:3000
```

`public/og-image.png` is rendered from `public/og-image.svg`. To regenerate it on a Mac:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --window-size=1200,630 --screenshot=public/og-image.png "file://$PWD/public/og-image.svg"
```
