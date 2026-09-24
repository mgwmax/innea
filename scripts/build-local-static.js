// npm run build-local-static : génère le site dans _site-local/ avec des chemins relatifs,
// pour l'ouvrir sans serveur (double-clic sur _site-local/index.html).
// Le dossier de sortie et la réécriture des URL (transform « urls-relatives ») sont définis
// dans eleventy.config.js, selon la variable INNEA_BUILD.
process.env.INNEA_BUILD = "local-static";

const { Eleventy } = await import("@11ty/eleventy");
const eleventy = new Eleventy(undefined, undefined, { configPath: "eleventy.config.js" });
await eleventy.write();
console.log("\nSite local prêt : ouvrir _site-local/index.html dans un navigateur.");
