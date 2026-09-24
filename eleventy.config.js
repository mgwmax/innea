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
}

export const config = {
  dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
};
