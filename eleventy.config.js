import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  // Images, SVG et logos copiés tels quels
  eleventyConfig.addPassthroughCopy("src/assets");

  // Les fichiers CSS/JS partiels sont assemblés par css/styles.11ty.js et js/main.11ty.js
  eleventyConfig.addWatchTarget("src/css/");
  eleventyConfig.addWatchTarget("src/js/");

  // Réécrit les URL absolues (/assets/…) si le site est publié dans un sous-dossier (pathPrefix)
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // {{ 5 | pad }} → "05"
  eleventyConfig.addFilter("pad", (n) => String(n).padStart(2, "0"));

  // Titres sur plusieurs lignes : {{ ["Ligne 1", "Ligne 2"] | lignes | safe }} → "Ligne 1<br>Ligne 2" (texte échappé)
  const escape = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  eleventyConfig.addFilter("lignes", (v) => [].concat(v ?? []).map(escape).join("<br>"));

  // Découpe une liste en groupes de tailles répétées : [a,b,c,d,e] | decouper([1, 2]) → [[a], [b,c], [d], [e]]
  eleventyConfig.addFilter("decouper", (liste = [], tailles = [1]) => {
    const groupes = [];
    for (let i = 0, g = 0; i < liste.length; g++) {
      const n = tailles[g % tailles.length];
      groupes.push(liste.slice(i, i + n));
      i += n;
    }
    return groupes;
  });

  // Grille projets : répartit une liste de projets en rangées selon le motif du design.
  // Même motif que js/components/grille-projets.js — les garder identiques.
  const MOTIF_GRILLE = [
    { type: "grand-petit", formats: ["paysage", "portrait"] },
    { type: "trois", formats: ["carre", "carre", "carre"] },
    { type: "petit-grand", formats: ["portrait", "paysage"] },
    { type: "trois", formats: ["carre", "carre", "carre"] },
  ];
  eleventyConfig.addFilter("rangeesProjets", (projets = []) => {
    const rangees = [];
    for (let i = 0, r = 0; i < projets.length; r++) {
      const m = MOTIF_GRILLE[r % MOTIF_GRILLE.length];
      const cartes = projets.slice(i, i + m.formats.length).map((projet, n) => ({ projet, format: m.formats[n] }));
      rangees.push({ type: m.type, cartes });
      i += cartes.length;
    }
    return rangees;
  });
}

export const config = {
  dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
};
