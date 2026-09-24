import path from "node:path";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

// Build « local statique » (npm run build-local-static) : pages ouvrables directement depuis le disque (file://)
const LOCAL_STATIQUE = process.env.INNEA_BUILD === "local-static";

export default function (eleventyConfig) {
  if (LOCAL_STATIQUE) {
    // Réécrit chaque URL absolue (/assets/x.jpg, /projets/) en chemin relatif à la page (./assets/x.jpg,
    // ../projets/index.html). Les dossiers pointent vers leur index.html : en file://, le navigateur
    // n'ouvre pas l'index d'un dossier tout seul. Liens externes, mailto:, tel: et #ancres inchangés.
    eleventyConfig.addTransform("urls-relatives", function (contenu) {
      const sortie = this.page.outputPath;
      if (!sortie || !sortie.endsWith(".html")) return contenu;
      const dossierPage = path.dirname(path.relative(eleventyConfig.directories.output, sortie));
      const racine = dossierPage === "." ? "./" : dossierPage.split(path.sep).map(() => "..").join("/") + "/";
      return contenu.replace(/(\s(?:href|src|action|poster)=")\/(?!\/)([^"]*)"/g, (_, attribut, url) => {
        const [, chemin, suite = ""] = url.match(/^([^?#]*)(.*)$/);
        const cible = chemin === "" || chemin.endsWith("/") ? chemin + "index.html" : chemin;
        return `${attribut}${racine}${cible}${suite}"`;
      });
    });
  }

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
  dir: { input: "src", includes: "_includes", data: "_data", output: LOCAL_STATIQUE ? "_site-local" : "_site" },
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
};
