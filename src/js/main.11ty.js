// Assemble les scripts partiels en un seul /js/main.js.
// Chaque script ne s'active que si ses éléments sont présents dans la page.
import { readFileSync } from "node:fs";

const files = [
  "components/revelation.js",
  "components/header.js",
  "components/mobile-menu.js",
  "components/lang.js",
  "components/hero-carousel.js",
  "components/grille-projets.js",
  "components/avant-apres.js",
  "components/formulaire-contact.js",
];

export const data = { permalink: "/js/main.js", eleventyExcludeFromCollections: true };

export function render() {
  return files
    .map((f) => `/* ===== ${f} ===== */\n` + readFileSync(new URL(f, import.meta.url), "utf8").trim())
    .join("\n\n") + "\n";
}
