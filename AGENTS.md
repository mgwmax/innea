# AGENTS.md — Innea website

Guide for AI coding agents working in this repository. Read it before editing. For human setup and a page example, see [README.md](README.md).

## Project

Website redesign for **Innea**, a small interior-architecture and custom-furniture studio in Suisse romande (Blonay). The site is in **French**. It is a static site built with **Eleventy 3 + Nunjucks**. The output is plain HTML/CSS/JS with no client framework.

- **Design source:** Figma file `KYRLht06crPP5jjDNJhLiA` ("Innea - Redesign Siteweb").
  - Homepage desktop: node `8036:12`
  - Mobile menu open: node `8042:436`
  - Mobile header component: node `8033:7728`
- **Fidelity:** the implementation matches Figma closely (pixel-checked at 1440px). Keep it that way. When a design question comes up, read the Figma node with the Figma MCP tools instead of guessing.
- **Current scope:** the homepage (`src/index.njk`) plus the shared layout. The owner plans to add more pages that reuse the same sections and components.

## Commands

```bash
npm install
npm run dev     # eleventy --serve on http://localhost:5173 (live reload)
npm run build   # outputs to _site/
```

There are no tests and no linter. Verify changes visually (see "Verifying changes" below).

## Where things live

| What | Where |
|---|---|
| Page content (texts, images, lists) | YAML front matter at the top of each page, e.g. `src/index.njk` |
| Site-wide data (nav, email, phones, address, socials, legal) | `src/_data/site.json` |
| Page skeleton (head, header, mobile menu, contact, footer) | `src/_includes/layouts/base.njk` |
| Blocks present on every page | `src/_includes/partials/` |
| Page sections (one Nunjucks macro each) | `src/_includes/sections/` |
| Small reusable components (macros) | `src/_includes/components/` |
| CSS | `src/css/{base,components,sections}/*.css`, concatenated by `src/css/styles.11ty.js` into `/css/styles.css` |
| JS | `src/js/components/*.js`, concatenated by `src/js/main.11ty.js` into `/js/main.js` |
| Images and SVGs | `src/assets/{logo,photos,ui}/` (passthrough copy) |
| Eleventy config, filters | `eleventy.config.js` |

`_site/` and `node_modules/` are generated. Never edit them.

## Conventions

- **Language:** UI text, content, data keys, file names and code comments are in French (`titre`, `texte`, `legende`, `diapositives`, `etapes`…). Keep this consistent.
- **Sections and components are Nunjucks macros** that take one data object. Each file starts with a comment documenting its parameters and usage. Keep that comment up to date when you change parameters.
  - Import them with an alias to avoid clashing with front-matter keys: `{% from "sections/hero.njk" import hero as heroSection %}`.
  - Macros can't see the page context (e.g. `site`). Pass data in explicitly, or use a partial with `{% include %}` if it needs `site`.
  - A macro that uses another macro imports it inside its own body (see `sections/projets.njk`).
- **Filters** (defined in `eleventy.config.js`):
  - `pad`: `5` → `"05"`.
  - `lignes`: turns an array of lines into escaped `<br>`-separated HTML. Use it with `| safe`, as in `{{ titre | lignes | safe }}`. Multi-line titles are stored as YAML arrays.
- **URLs:** asset and page URLs are root-absolute (`/assets/photos/x.jpg`, `/#contact`). `EleventyHtmlBasePlugin` rewrites them if the site is deployed under a `pathPrefix`.
- **CSS:**
  - Class names are BEM-ish (`.hero__img`, `.card--portrait`) plus state classes `.is-active`, `.is-open`, `.is-solid`.
  - One CSS file per component or section. Each file holds its own `@media` rules.
  - Breakpoints are **1180px, 900px and 640px (mobile)**. Plain CSS can't store breakpoints in variables, so keep them consistent by hand.
  - Tokens live in `src/css/base/tokens.css`: colours `--innea-toile|sable|ligne|encre|taupe|blanc`, spacing `--section-x` (64 → 32 → 20px), `--section-y`, `--gap`, and `--max: 1360px` (the width of `.container`, used by the header too). Use tokens rather than hardcoded colours.
  - Text styles are the utility classes `.t-label .t-nav .t-texte .t-texte-s .t-legende .t-titre-s|m|l .t-display-l|xl`, mirroring the Figma "Innea V3" text styles. Fonts are Newsreader Light / Light Italic and Jost Regular (Google Fonts).
  - **When adding a CSS file, add it to the ordered list in `src/css/styles.11ty.js`.** Order is base → components → sections. The same applies to JS and `src/js/main.11ty.js`.
- **JS:** each file is a self-contained IIFE that returns early when its elements are missing, so every script can be loaded on every page. Don't introduce globals or dependencies.
- **Assets:** use the exported Figma SVGs and photos as they are. Don't redraw, inline or edit them, and keep the SVG `width`/`height` attributes. Give new files descriptive French names.

## Design rules (from the Figma component descriptions)

- **Bouton lien** (text plus arrow line) is the site's only call to action. Never use filled buttons.
- **Header:** transparent over a full-screen photo, Toile background on light pages and after scrolling, four menu entries, no buttons.
  - `js/components/header.js` adds `.is-solid`. On pages without a `.hero` the header is always solid.
  - On mobile (≤ 640px) it is 64px tall with a "Menu" / "Fermer" text toggle that opens the full-screen `mobile-menu`.
- **Carte projet:** clickable as a whole, no frame, no shadow. Formats are `paysage` (816×560) and `portrait` (464×600). The `projets` section groups cards in pairs and offsets the second one down by 120px.
- **Étape:** four stacked steps with a thin vertical line.
- **Objet:** no price, no cart.
- **Bloc contact:** closes every page, right before the footer. It is included by the layout; a page can opt out with `contact: false` in its front matter.
- **Pied de page:** a single line.

## Known placeholders and open items

- Hero slides 2–5 reuse other project photos with captions invented during development. The real hero set is still to come from the client. Figma only has slide 1 (`salon-cheminee.jpg`).
- Most links are `#` placeholders: "Découvrir le studio", "Tous les projets", project cards, Instagram/Pinterest, and the legal pages.
- The FR / EN switch is only visual. No English content or i18n setup exists yet.
- The Figma file says the showroom address (Chemin du Péage 39, 1807 Blonay) still needs confirming.

## Verifying changes

1. Run `npm run build` and check it finishes without errors. Then `grep` `_site/index.html` for `undefined` or `[object`, which reveal missing data.
2. Check the page visually at **1440px** (the Figma desktop width) and **390px** (the Figma mobile width). Also check that the page doesn't scroll sideways (`scrollWidth === clientWidth`).
3. Headless Edge works well for screenshots:
   ```bash
   "/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new --user-data-dir=<tmp> --window-size=1440,900 --virtual-time-budget=3000 --screenshot=<out.png> http://localhost:5173/
   ```
   - Its minimum viewport is about 500px. For mobile checks, load the page in a 390px-wide `<iframe>`.
   - It writes the screenshot asynchronously, so wait for the file to exist before reading it.
   - Use a separate `--user-data-dir` for each capture, because runs that share one conflict.
4. In a hidden or non-rendering browser, CSS transitions and `setInterval` may not advance. Don't treat that as a bug without checking in a visible browser.
5. Keep changes limited to what was asked, and note (don't silently "fix") unrelated mismatches with the design.
