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
| Project list (in projects-page order) and each project's detail-page content. Fields: `slug` (unique), `titre` (detail-page title), `legende` (two caption labels, e.g. `["Villa", "Blonay"]`), `lieu`, `categorie`, `image`, `alt`, `masque` (`false` removes the dark gradient on the projects page), and the optional `texte` and `galerie` | `src/_data/realisations.json` |
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
  - Exception: everything inside `.hero` reveals on page load, not on intersection. The hero is at least 860px tall, so its lower part (subtitle, caption) can sit below the fold on short screens and would otherwise wait for a scroll.
  - **Never nest** `data-reveal` elements, or the offsets and fades add up. Put the attribute on siblings, as the existing sections do. `boutonLien` already adds `data-reveal="texte"`, except in its `span` mode.
  - Elements are only hidden if the inline script in `layouts/base.njk` put the `anim` class on `<html>` before the first paint. It never does this when the visitor prefers reduced motion or when IntersectionObserver is unavailable, and it removes the class after 3s if `main.js` hasn't started. So with JavaScript off or broken, the content stays visible.
  - Reveal transitions use the individual `scale` property, not `transform`, so they don't conflict with the hover zooms.
  - `revelation.js` is listed first in `main.11ty.js`, and `animations.css` last in `styles.11ty.js`.
  - Testing: the fully revealed state should be pixel-identical to the page without animations. Headless screenshots can't show scroll-triggered states; Playwright driving the installed Edge (`channel: "msedge"`) can.
- **JS:** each file is a self-contained IIFE that returns early when its elements are missing, so every script can be loaded on every page. Don't introduce globals or dependencies.
- **Images:** every raster image in `src/assets` is WebP. To add a photo, drop the JPG/PNG into `src/assets/photos/`, reference it by its future `.webp` name or its current name, then run `python scripts/convertir-webp.py`. The script does the following:
  - applies the EXIF orientation, which matters for phone photos;
  - keeps transparency;
  - shrinks images whose width or height exceeds 1920px (`--max N`), keeping proportions;
  - encodes at quality 75 (change it with `--qualite N`; to change the quality of every existing image, re-encode from the originals with `--depuis-originaux`);
  - rewrites the `/assets/….jpg|png` references in `src/`;
  - moves the original into `assets-originaux/`, which isn't published but should be kept as the source files.

  Eleventy doesn't clean its output folder, so after converting or deleting assets, delete `_site/` or `_site-local/` before rebuilding. Deleting `_site/` stops a running `npm run dev`, so restart it afterwards.
- **Assets:** use the exported Figma SVGs and photos as they are. Don't redraw, inline or edit them, and keep the SVG `width`/`height` attributes. Give new files descriptive French names.

## Design rules (from the Figma component descriptions)

- **Bouton lien** (text plus arrow line) is the site's only call to action. Never use filled buttons.
- **Header:** transparent over a full-screen photo, Toile background on light pages and after scrolling, four menu entries, no buttons.
  - `js/components/header.js` adds `.is-solid`. On pages without a `.hero` the header is always solid.
  - On mobile (≤ 640px) it is 64px tall with a "Menu" / "Fermer" text toggle that opens the full-screen `mobile-menu`.
  - When `<main>` doesn't start with a `.hero`, it gets top padding equal to the header height (88px, or 64px on mobile) so content isn't hidden under the fixed header. See `sections/header.css`.
- **Intro de page:** opens inner pages, under the Toile header. Label on the left; a thin title (two lines at most) and optional text on the right.
- **Homepage, design update of October 2026:** the homepage was re-synced with Figma node `8036:12`.
  - The Figma text styles changed: Display XL is now 60px and Titre L 40px. They are updated globally in `typographie.css`.
  - The hero uses `legendes: "numerotees"`, with labels in the form « 01 — Attique à la montagne ».
  - The homepage Projets section has its own list in `index.njk` (`projets.projets`), separate from `realisations.json`. Its rows pair `paysage` with `etroit` cards (464×560), with no offset.
  - Démarche uses `variante: "large"` plus a `complement` block (Honoraires). Steps accept multi-line `texte` and a bold `fort` sentence.
  - « Ce que nous apportons » is `savoirFaire` with `numerote: true`, which renders the `avantage` component (square photo, « 01 —— » overline).
  - Showroom uses `variante: "centre"`.
  - The contact block has a Bureau column (`site.contact.bureau`, Blonay) and the new showroom address (`site.contact.showroom`, Granges).
  - `js/components/etapes.js` positions the vertical step line from the first to the last number.
- **Carte projet:** clickable as a whole, no frame, no shadow. Formats are `paysage` (816×560), `etroit` (464×560), `portrait` (464×600) and `carre` (416×416). The caption is now one or two Label texts separated by a 24px line (« Villa —— Blonay »). It shows `p.legende` if set, otherwise category and location, otherwise the title. A card's format comes from its **position** in the layout, not from the project data:
  - Homepage `projets` section: pairs of cards, paysage + portrait, then portrait + paysage. The second card of each pair sits 120px lower.
  - The homepage is the only page that still uses project cards in a staggered grid. The projects page now uses full-bleed photos (see below).
- **Hero / Photo plein cadre:** `sections/hero.njk` covers both. With several `diapositives` it is the homepage carousel. With one, it is the static full-bleed photo used on project pages and the showroom page, with `masque: "photo"` for the plain dark gradient and an optional `filAriane` breadcrumb. In both cases it is a `.hero`, so the header stays transparent over it.
- **Projects page, design update of October 2026** (Figma `8234:9482`): `src/projets.njk` alternates two sections, driven by the order of `realisations.json`:
  - `photo-projet`: a clickable full-bleed photo (720px tall) with a white `« Label —— Label »` caption at the bottom left. The first project is the page hero (`{ hero: true, label: "Projets" }`, 100vh between 860 and 1000px, h1 « Projets » at the top).
  - `deux-projets`: two `paysage` cards side by side.
  - The rest of the list is cut with `decouper([2, 1])`: a pair, then one full-bleed photo, repeating. To reorder the page, reorder the JSON.
  - There are no filters and no "Afficher plus" any more.
- **Fiche projet** (project detail page, Figma `8039:153`), in order:
  1. Hero with the project `titre`, plain photo gradient and breadcrumb (no caption).
  2. `fiche-projet`: Méta (Lieu, Catégorie; missing entries are skipped) and the "Le projet" text (`bloc-label`).
  3. Gallery (full-width photo, then a pair, repeating), only if `galerie` is set.
  4. « Autres projets »: `deux-projets` with a top rule (`filet: true`) and a « Tous les projets » link, showing the next two projects in the list (wrapping round).
- **Studio, design update of October 2026** (Figma `8040:210`): intro, `equipe` with a single photo (`portraits` with one entry; options `ratio` for the frame, `cadrage` or `position` for the crop), `valeurs` with `numerote: false`, a `respiration` without caption (`position` sets the crop), then two `savoir-faire` grids (« Notre regard. » with `carre`, « Des idées posées sur le papier. » with `filet` and `numerote`).
  - The couple photo is a square image supplied by the client (`nathalie-christophe-carre.webp`), shown in the 640px square with the Sable colour-burn overlay (sepia tone).
- **Showroom, design update of October 2026** (Figma `8041:262`): hero, `texte-photo` (text + photo), `categories` (photo | list and rendez-vous button | photo), the « Sélection » mosaics, a `respiration`, then the contact block titled « Prenez rendez-vous. ».
  - **The Figma page has four alternative « Sélection · mosaïque » layouts, and all four are on the page on purpose: the client will pick one later.** Each is one entry of `selections` in `showroom.njk`. They share their texts through the YAML anchor `selectionCommun` (`<<: *commun`) and the categories through the `categories` map. To keep only one, delete the other entries.
  - `sections/mosaique.njk` takes `colonnes` (relative widths), `contenu` (one list of items per column, with `espace` between them) and items of type `intro`, `carte` (Sable card with button), `rdv` (button without card), `groupe` (two categories side by side) or a category (`cat`, `ratio`, optional `numero`). At 900px and below each column becomes a 2-column grid (1 column at 640px); intros and groups span the full width.
  - Its buttons use the new `bouton-contour` component (a bordered button, used only on the showroom page as in the design), and its photos the `carte-categorie` component.
- **Contact page** (Figma `8041:8037`): the Bureau and Showroom addresses sit side by side; the photo below uses `masque: "photo"` without caption.
- **Sections and components no longer used by any page** (kept in case they come back): `grille-projets` + `filtre` + `js/components/grille-projets.js` (old projects grid, whose cycle is also written in the `rangeesProjets` filter), `avant-apres`, `projet-suivant`, `infos-pratiques`, the `intro-de-page` variant `suite`.
- **Bouton lien** has a white tone for use over photos (class `btn-link--blanc`) and a `span` mode for use inside a parent link: `boutonLien(texte, false, "btn-link--blanc", "span")`.
- **Reused sections with variants:**
  - `demarche` with `variante: "compacte"` (Studio): intro 416px wide, steps 832px wide.
  - `savoir-faire` with a `legende` on the right of the title and any number of rows. Options: `texte` (intro under the title), `carre` (square photos), `numerote` (`avantage` cards), `espaceHaut` and `filet` (top spacing / top rule).
  - `valeurs` with `numerote: false` hides the numbers.
  - `respiration` with `position` (object-position of the photo). `legende` is optional; without it (and without `masque`) there is no gradient.
- **Navigation:** Projets → `/projets/`, Studio → `/studio/`, Showroom → `/showroom/`, Contact → `/contact/`. The footer links go to `/mentions-legales/` and `/confidentialite/`. A nav item is marked `aria-current` when the page URL starts with its URL, so project pages mark "Projets" as current.
- **Contact block title per page:** the title defaults to `site.contact.titre` (« Parlons de votre intérieur. »). A page can override it in its front matter with `blocContact: { titre: … }`, as a string or as an array of lines. The showroom page uses « Prenez rendez-vous. ».
- **Pages without the contact block:** the contact and legal pages set `contact: false` in their front matter. The contact page is itself the contact block, and the legal pages follow the design, which goes straight to the footer.
- **Contact page:** `sections/contact-formulaire.njk` reads the contact details from `site.contact`. The form uses the `champ` component and `js/components/formulaire-contact.js`.
  - It validates on submit: name and a valid e-mail are required, as is the consent checkbox. Errors only show after a first attempt.
  - If `site.json → formulaire.action` is empty (the current setting), the script opens the visitor's e-mail app with a pre-filled message to `contact.email`. If it is set to a form service URL, the form is POSTed there.
  - The Figma component description says the fields should have only a bottom line, but the mock-up draws full boxes. The implementation follows the mock-up.
- **Legal pages:** `sections/texte-legal.njk` renders a centred 1024px column of titled sections, with text 640px wide. Each section uses `lignes` (one line per item) or `texte` (a paragraph).
- **Respiration** accepts `masque: "photo"` for the stronger 50% black gradient used on the contact page.
- **Étape:** four stacked steps with a thin vertical line.
- **Objet:** no price, no cart.
- **Bloc contact:** closes every page, right before the footer. It is included by the layout; a page can opt out with `contact: false` in its front matter.
- **Pied de page:** a single line.

## Known placeholders and open items

- Hero slides 2–5 reuse other project photos with captions invented during development. The real hero set is still to come from the client. Figma only has slide 1 (`salon-cheminee.jpg`).
- Remaining `#` placeholder links: Instagram and Pinterest.
- The contact form has no back end yet: "Envoyer" only opens a pre-filled e-mail. The client also still has to approve the form itself (the Figma frame calls it « à valider »).
- The legal texts are placeholders in square brackets. The Confidentialité structure is a suggestion based on the Swiss data-protection law (nLPD) and needs review. It mentions Google Fonts because the site loads its fonts from Google's servers.
- Only « Les Hauts de Vevey » has a text and a gallery (from Figma). The other project pages show the hero, the Méta block and « Autres projets » until their content is written. Their `titre` (detail-page title) was written during development, as Figma only has one project page.
- The fourth project's caption is « Attique à la montagne —— Les Diablerets »; Figma reads « Les Hauts de Vevey —— Les Diablerets », which looks like a copy-paste slip.
- The showroom has four « Sélection » variants to choose from (see above).
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
