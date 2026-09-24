# AGENTS.md — Innea website

Guide for AI coding agents working in this repository. Read it before editing. For human setup and a page example, see [README.md](README.md).

## Project

Website redesign for **Innea**, a small interior-architecture and custom-furniture studio in Suisse romande (Blonay). The site is in **French**. It is a static site built with **Eleventy 3 + Nunjucks**. The output is plain HTML/CSS/JS with no client framework.

- **Design source:** Figma file `KYRLht06crPP5jjDNJhLiA` ("Innea - Redesign Siteweb").
  - Homepage desktop: node `8036:12`
  - Projects page desktop: node `8038:77`
  - Project detail page (fiche projet) desktop: node `8039:153`
  - Studio page desktop: node `8040:210`
  - Showroom page desktop: node `8041:262`
  - Contact page desktop: node `8041:8037`
  - Mentions légales desktop: node `8041:8092`. Confidentialité has no design of its own and uses the same template.
  - Mobile menu open: node `8042:436`
  - Mobile header component: node `8033:7728`
- **Fidelity:** the implementation matches Figma closely (pixel-checked at 1440px). Keep it that way. When a design question comes up, read the Figma node with the Figma MCP tools instead of guessing.
- **Current scope:** the shared layout and these pages:
  - homepage: `src/index.njk`
  - projects page: `src/projets.njk`, served at `/projets/`
  - one detail page per project: `src/projets/projet.njk`, served at `/projets/<slug>/` and generated with Eleventy pagination over `realisations.json`
  - studio page: `src/studio.njk`, served at `/studio/`
  - showroom page: `src/showroom.njk`, served at `/showroom/`
  - contact page: `src/contact.njk`, served at `/contact/`
  - legal pages: `src/mentions-legales.njk` and `src/confidentialite.njk`, served at `/mentions-legales/` and `/confidentialite/`

  The owner plans to add more pages that reuse the same sections and components.

## Commands

```bash
npm install
npm run dev     # eleventy --serve on http://localhost:5173 (live reload)
npm run build   # outputs to _site/ (for a web server)
npm run build-local-static   # outputs to _site-local/, opens from disk (file://)
```

There are no tests and no linter. Verify changes visually (see "Verifying changes" below).

## Where things live

| What | Where |
|---|---|
| Page content (texts, images, lists) | YAML front matter at the top of each page, e.g. `src/index.njk` |
| Site-wide data (nav, email, phones, address, socials, legal) | `src/_data/site.json` |
| Project list and each project's detail-page content: the projects page shows all of them, the homepage only those with `accueil: true`. Every project needs a unique `slug`. Detail-page fields are optional: `lieu`, `annee`, `surface`, `texte`, `galerie`, `details`, `avantApres` | `src/_data/realisations.json` |
| Page skeleton (head, header, mobile menu, contact, footer) | `src/_includes/layouts/base.njk` |
| Blocks present on every page | `src/_includes/partials/` |
| Page sections (one Nunjucks macro each) | `src/_includes/sections/` |
| Small reusable components (macros) | `src/_includes/components/` |
| CSS | `src/css/{base,components,sections}/*.css`, concatenated by `src/css/styles.11ty.js` into `/css/styles.css` |
| JS | `src/js/components/*.js`, concatenated by `src/js/main.11ty.js` into `/js/main.js` |
| Images and SVGs | `src/assets/{logo,photos,ui}/` (passthrough copy) |
| Eleventy config, filters | `eleventy.config.js` |

`_site/`, `_site-local/` and `node_modules/` are generated. Never edit them.

**`build-local-static`** runs `scripts/build-local-static.js`, which sets `INNEA_BUILD=local-static`. In that mode, `eleventy.config.js` writes to `_site-local/` and adds the `urls-relatives` transform. It rewrites every root URL in `href`, `src`, `action` and `poster` to a path relative to the page (`./assets/…`, `../../projets/index.html`), and points folder URLs at their `index.html`. Keep writing root-absolute URLs (`/assets/…`) in templates and data; the transform handles the local build. It only rewrites HTML attributes, so a root URL written in CSS or JS (e.g. `url(/assets/…)` or a path in a script) would not be converted.

## Conventions

- **Language:** UI text, content, data keys, file names and code comments are in French (`titre`, `texte`, `legende`, `diapositives`, `etapes`…). Keep this consistent.
- **Sections and components are Nunjucks macros** that take one data object. Each file starts with a comment documenting its parameters and usage. Keep that comment up to date when you change parameters.
  - Import them with an alias to avoid clashing with front-matter keys: `{% from "sections/hero.njk" import hero as heroSection %}`.
  - Macros can't see the page context (e.g. `site`). Pass data in explicitly, or use a partial with `{% include %}` if it needs `site`.
  - A macro that uses another macro imports it inside its own body (see `sections/projets.njk`).
- **Filters** (defined in `eleventy.config.js`):
  - `pad`: `5` → `"05"`.
  - `lignes`: turns an array of lines into escaped `<br>`-separated HTML. Use it with `| safe`, as in `{{ titre | lignes | safe }}`. Multi-line titles are stored as YAML arrays.
  - `rangeesProjets`: splits a project list into the rows of the projects-page grid (see "Carte projet" below).
  - `decouper(sizes)`: splits a list into groups whose sizes repeat, e.g. the gallery uses `[1, 2]` for one full-width photo, then a pair.
- **URLs:** asset and page URLs are root-absolute (`/assets/photos/x.jpg`, `/#contact`). `EleventyHtmlBasePlugin` rewrites them if the site is deployed under a `pathPrefix`.
- **CSS:**
  - Class names are BEM-ish (`.hero__img`, `.card--portrait`) plus state classes `.is-active`, `.is-open`, `.is-solid`.
  - One CSS file per component or section. Each file holds its own `@media` rules.
  - Breakpoints are **1180px, 900px and 640px (mobile)**. Plain CSS can't store breakpoints in variables, so keep them consistent by hand.
  - Tokens live in `src/css/base/tokens.css`: colours `--innea-toile|sable|ligne|encre|taupe|blanc`, spacing `--section-x` (64 → 32 → 20px), `--section-y`, `--gap`, and `--max: 1360px` (the width of `.container`, used by the header too). Use tokens rather than hardcoded colours.
  - Text styles are the utility classes `.t-label .t-nav .t-texte .t-texte-s .t-legende .t-titre-s|m|l .t-display-l|xl`, mirroring the Figma "Innea V3" text styles. Fonts are Newsreader Light / Light Italic and Jost Regular (Google Fonts).
  - **When adding a CSS file, add it to the ordered list in `src/css/styles.11ty.js`.** Order is base → components → sections. The same applies to JS and `src/js/main.11ty.js`.
- **Scroll-reveal animations:** add `data-reveal="…"` to an element to animate it when it scrolls into view. The variants are in `css/base/animations.css`, and `js/components/revelation.js` does the observing.
  - Variants:
    - `texte`: fades in while rising 24px.
    - `titre`: each line, as separated by `<br>`, slides up out of a clip-path mask. The script wraps the lines at runtime.
    - `carte`: rises 48px, and the photo inside `.card__frame` settles from a zoom.
    - `image`: fades in while settling from a zoom.
    - `zoom`: the hero photo zooms out slowly, with no fade.
    - `trait`: the étapes line draws itself downwards.
  - Elements that enter the screen together are staggered by 90ms each, up to 6.
  - **Never nest** `data-reveal` elements, or the offsets and fades add up. Put the attribute on siblings, as the existing sections do. `boutonLien` already adds `data-reveal="texte"`, except in its `span` mode.
  - Elements are only hidden if the inline script in `layouts/base.njk` put the `anim` class on `<html>` before the first paint. It never does this when the visitor prefers reduced motion or when IntersectionObserver is unavailable, and it removes the class after 3s if `main.js` hasn't started. So with JavaScript off or broken, the content stays visible.
  - Reveal transitions use the individual `scale` property, not `transform`, so they don't conflict with the hover zooms.
  - `revelation.js` is listed first in `main.11ty.js`, and `animations.css` last in `styles.11ty.js`.
  - Testing: the fully revealed state should be pixel-identical to the page without animations. Headless screenshots can't show scroll-triggered states; Playwright driving the installed Edge (`channel: "msedge"`) can.
- **JS:** each file is a self-contained IIFE that returns early when its elements are missing, so every script can be loaded on every page. Don't introduce globals or dependencies.
- **Assets:** use the exported Figma SVGs and photos as they are. Don't redraw, inline or edit them, and keep the SVG `width`/`height` attributes. Give new files descriptive French names.

## Design rules (from the Figma component descriptions)

- **Bouton lien** (text plus arrow line) is the site's only call to action. Never use filled buttons.
- **Header:** transparent over a full-screen photo, Toile background on light pages and after scrolling, four menu entries, no buttons.
  - `js/components/header.js` adds `.is-solid`. On pages without a `.hero` the header is always solid.
  - On mobile (≤ 640px) it is 64px tall with a "Menu" / "Fermer" text toggle that opens the full-screen `mobile-menu`.
  - When `<main>` doesn't start with a `.hero`, it gets top padding equal to the header height (88px, or 64px on mobile) so content isn't hidden under the fixed header. See `sections/header.css`.
- **Intro de page:** opens inner pages, under the Toile header. Label on the left; a thin title (two lines at most) and optional text on the right.
- **Carte projet:** clickable as a whole, no frame, no shadow. Formats are `paysage` (816×560), `portrait` (464×600) and `carre` (416×416). A card's format comes from its **position** in the layout, not from the project data:
  - Homepage `projets` section: pairs of cards, paysage + portrait, then portrait + paysage. The second card of each pair sits 120px lower.
  - Projects page `grille-projets` section: a repeating cycle of *grand + petit* (second card 160px lower), *three squares*, *petit + grand* (second card 120px lower), *three squares*.
  - Responsive behaviour (in `sections/grille-projets.css`): above 640px the cycle is kept, with proportional `minmax(0, …fr)` columns and vertical offsets that shrink at each breakpoint. At 640px and below it becomes a condensed version of the same rhythm. In large + small rows, the large card is full width and the small one is 64% wide, aligned right (left for small + large). In three-square rows, the first square is full width and the other two sit side by side. When a three-square row is narrower than 1260px, a container query moves all its captions onto two lines together.
  - This cycle is written twice and the two copies must stay identical: the `rangeesProjets` filter in `eleventy.config.js` (initial render) and `src/js/components/grille-projets.js` (re-layout when filtering or clicking "Afficher plus").
- **Hero / Photo plein cadre:** `sections/hero.njk` covers both. With several `diapositives` it is the homepage carousel. With one, it is the static full-bleed photo used on project pages and the showroom page, with `masque: "photo"` for the plain dark gradient and an optional `filAriane` breadcrumb. In both cases it is a `.hero`, so the header stays transparent over it.
- **Fiche projet** (project detail page), in order:
  1. Hero with the project title, `Catégorie · Lieu` and an `NN / total` counter.
  2. Méta projet: Lieu, Année, Catégorie, Surface. Missing entries are skipped, and Surface is shown only if the client agrees.
  3. "Le projet" text (`bloc-label` component).
  4. Gallery: full-width photo, then a pair, repeating, followed by an optional "Détails" block.
  5. Optional Avant / après slider.
  6. Projet suivant: the whole block links to the next project, and the last project links back to the first.
- **Avant / après:** the slider is an invisible `<input type="range">` laid over the frame, so mouse, touch and keyboard all work. `js/components/avant-apres.js` updates the `--position` CSS variable, which drives the before-image clip and the handle. Both photos fill the whole frame, so their framing differs from the static Figma mock-up, where each photo is a separate half.
- **Bouton lien** has a white tone for use over photos (class `btn-link--blanc`) and a `span` mode for use inside a parent link: `boutonLien(texte, false, "btn-link--blanc", "span")`.
- **Reused sections with variants:**
  - `demarche` with `variante: "compacte"` (Studio): intro 416px wide, steps 832px wide.
  - `savoir-faire` with a `legende` on the right of the title and any number of rows. It also renders the showroom "Sélection".
  - `intro-de-page` with `variante: "suite"` (Showroom, placed under a hero): 44px title as an h2.
- **Navigation:** Projets → `/projets/`, Studio → `/studio/`, Showroom → `/showroom/`, Contact → `/contact/`. The footer links go to `/mentions-legales/` and `/confidentialite/`. A nav item is marked `aria-current` when the page URL starts with its URL, so project pages mark "Projets" as current.
- **Pages without the contact block:** the contact and legal pages set `contact: false` in their front matter. The contact page is itself the contact block, and the legal pages follow the design, which goes straight to the footer.
- **Contact page:** `sections/contact-formulaire.njk` reads the contact details from `site.contact`. The form uses the `champ` component and `js/components/formulaire-contact.js`.
  - It validates on submit: name and a valid e-mail are required, as is the consent checkbox. Errors only show after a first attempt.
  - If `site.json → formulaire.action` is empty (the current setting), the script opens the visitor's e-mail app with a pre-filled message to `contact.email`. If it is set to a form service URL, the form is POSTed there.
  - The Figma component description says the fields should have only a bottom line, but the mock-up draws full boxes. The implementation follows the mock-up.
- **Legal pages:** `sections/texte-legal.njk` renders a centred 1024px column of titled sections, with text 640px wide. Each section uses `lignes` (one line per item) or `texte` (a paragraph).
- **Respiration** accepts `masque: "photo"` for the stronger 50% black gradient used on the contact page.
- **Filtre** (projects page): active is encre with a 1px underline, inactive is taupe. Each filter's value is its category passed through `slugify`, matched against each card's `data-categorie`. "Tous" has the value `tous`.
- **Étape:** four stacked steps with a thin vertical line.
- **Objet:** no price, no cart.
- **Bloc contact:** closes every page, right before the footer. It is included by the layout; a page can opt out with `contact: false` in its front matter.
- **Pied de page:** a single line.

## Known placeholders and open items

- Hero slides 2–5 reuse other project photos with captions invented during development. The real hero set is still to come from the client. Figma only has slide 1 (`salon-cheminee.jpg`).
- Remaining `#` placeholder links: Instagram and Pinterest.
- The contact form has no back end yet: "Envoyer" only opens a pre-filled e-mail. The client also still has to approve the form itself (the Figma frame calls it « à valider »).
- The legal texts are placeholders in square brackets. The Confidentialité structure is a suggestion based on the Swiss data-protection law (nLPD) and needs review. It mentions Google Fonts because the site loads its fonts from Google's servers.
- Only "Sur les hauts de Vevey" has full detail-page content (texts, gallery, details, before/after), taken from Figma. The other project pages show only the hero, the category and location, and "Projet suivant" until their content is written. The project, studio and showroom texts in square brackets are placeholders from the design.
- Studio portraits (`portrait-1.png`, `portrait-2.png`): the alt texts assume Nathalie on the left and Christophe on the right. Please confirm.
- The showroom "Sélection" repeats the same three objects on two rows, as in the design. Their materials are `[Matière à confirmer]`.
- Project names and photos in `realisations.json` are provisional, per a Figma annotation: the client still has to confirm which photo belongs to which project. Three projects are literally named `[Nom du projet]`.
- "Afficher plus" only appears when there are more projects than `parPage` (10). With the current 10 projects it is hidden.
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
