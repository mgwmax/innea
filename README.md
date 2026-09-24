# Innea — site

Site statique généré avec [Eleventy](https://www.11ty.dev/). Les pages sont assemblées à partir de sections et de composants réutilisables ; le résultat (`_site/`) est du HTML, CSS et JS simple, sans framework.

```bash
npm install      # une seule fois
npm run dev      # serveur local sur http://localhost:5173, rechargé à chaque modification
npm run build    # génère le site final dans _site/
```

## Structure

```
src/
  index.njk                 page d'accueil : contenu (en-tête YAML) + liste des sections
  projets.njk               page Projets (/projets/) : intro + grille filtrable
  projets/projet.njk        fiche projet : une page par projet de realisations.json (/projets/<slug>/)
  studio.njk                page Studio (/studio/)
  showroom.njk              page Showroom (/showroom/)
  contact.njk               page Contact (/contact/) : coordonnées + formulaire
  mentions-legales.njk      page Mentions légales (/mentions-legales/)
  confidentialite.njk       page Confidentialité (/confidentialite/)
  _data/site.json           données communes : navigation, coordonnées, mentions légales
  _data/realisations.json   liste des projets et contenu de leurs fiches (accueil: true = affiché aussi sur la page d’accueil)
  _includes/
    layouts/base.njk        squelette de page : <head>, header, menu mobile, contact, pied de page
    partials/               blocs présents sur toutes les pages (header, menu mobile, contact, footer, FR/EN)
    sections/               sections de page, une par fichier (hero, manifeste, projets, …)
    components/             composants : logo, bouton lien, carte projet, filtre, étape, objet, méta projet, bloc label, avant/après, valeur, champ de formulaire
  css/
    base/                   couleurs et espacements (tokens.css), reset, typographie, container
    components/  sections/  un fichier CSS par composant et par section, avec ses règles responsive
    styles.11ty.js          assemble tous les fichiers en un seul /css/styles.css (l'ordre y est défini)
  js/
    components/             un script par comportement (header, menu mobile, FR/EN, carrousel, grille projets, avant/après, formulaire de contact)
    main.11ty.js            assemble les scripts en un seul /js/main.js
  assets/                   logo/, photos/, ui/ — copiés tels quels
```

## Créer une page

Créer par exemple `src/studio.njk` (publiée sur `/studio/`) :

```njk
---
layout: layouts/base.njk
title: Studio
manifeste:
  label: L’atelier
  texte: "…"
respiration:
  image: /assets/photos/exterieurs-bassin.jpg
  alt: "…"
  legende: "…"
---
{% from "sections/manifeste.njk" import manifeste as manifesteSection %}
{% from "sections/respiration.njk" import respiration as respirationSection %}

{{ manifesteSection(manifeste) }}
{{ respirationSection(respiration) }}
```

Le header, le menu mobile, le bloc contact et le pied de page sont ajoutés par le layout. Pour masquer le bloc contact : `contact: false`. Sans section hero, le header s'affiche directement sur fond Toile.

Chaque fichier de `sections/` et `components/` décrit ses paramètres en commentaire en tête de fichier.

## Ajouter une section ou un composant

1. Le gabarit : `src/_includes/sections/ma-section.njk` (une macro `{% macro maSection(data) %}…{% endmacro %}`).
2. Le style : `src/css/sections/ma-section.css`, puis ajouter son nom dans la liste de `src/css/styles.11ty.js`.
3. Un comportement éventuel : `src/js/components/ma-section.js`, puis l'ajouter dans `src/js/main.11ty.js`.
