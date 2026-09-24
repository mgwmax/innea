// Assemble les fichiers CSS partiels en un seul /css/styles.css.
// L'ordre compte : fondations → composants → sections.
import { readFileSync } from "node:fs";

const files = [
  "base/tokens.css",
  "base/reset.css",
  "base/typographie.css",
  "base/layout.css",

  "components/logo.css",
  "components/bouton-lien.css",
  "components/lang.css",
  "components/masque.css",
  "components/carte-projet.css",
  "components/etape.css",
  "components/objet.css",
  "components/filtre.css",
  "components/meta-projet.css",
  "components/bloc-label.css",
  "components/avant-apres.css",
  "components/valeur.css",
  "components/champ.css",

  "sections/header.css",
  "sections/mobile-menu.css",
  "sections/hero.css",
  "sections/intro-de-page.css",
  "sections/manifeste.css",
  "sections/projets.css",
  "sections/grille-projets.css",
  "sections/fiche-projet.css",
  "sections/galerie-projet.css",
  "sections/avant-apres-section.css",
  "sections/projet-suivant.css",
  "sections/equipe.css",
  "sections/valeurs.css",
  "sections/respiration.css",
  "sections/demarche.css",
  "sections/savoir-faire.css",
  "sections/showroom.css",
  "sections/infos-pratiques.css",
  "sections/contact.css",
  "sections/contact-formulaire.css",
  "sections/texte-legal.css",
  "sections/footer.css",
];

export const data = { permalink: "/css/styles.css", eleventyExcludeFromCollections: true };

export function render() {
  return files
    .map((f) => `/* ===== ${f} ===== */\n` + readFileSync(new URL(f, import.meta.url), "utf8").trim())
    .join("\n\n") + "\n";
}
