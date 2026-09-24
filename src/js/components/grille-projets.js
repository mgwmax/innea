// Grille projets : filtre par catégorie et « Afficher plus ».
// Les cartes sont redistribuées en rangées selon le motif du design ; leur format suit leur position.
// Même motif que le filtre « rangeesProjets » d'eleventy.config.js — les garder identiques.
(() => {
  const MOTIF = [
    { type: 'grand-petit', formats: ['paysage', 'portrait'] },
    { type: 'trois', formats: ['carre', 'carre', 'carre'] },
    { type: 'petit-grand', formats: ['portrait', 'paysage'] },
    { type: 'trois', formats: ['carre', 'carre', 'carre'] },
  ];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('.grille').forEach((grille) => {
    const rangees = grille.querySelector('.grille__rangees');
    const cartes = [...grille.querySelectorAll('.grille__rangees .card, .grille__reserve .card')];
    const filtres = [...grille.querySelectorAll('.filtre')];
    const plus = grille.querySelector('.grille__plus');
    const parPage = Number(grille.dataset.parPage) || 10;
    let filtre = 'tous';
    let visibles = parPage;

    const render = (animer) => {
      const liste = cartes.filter((c) => filtre === 'tous' || c.dataset.categorie === filtre);
      const affichees = liste.slice(0, visibles);
      const fragment = document.createDocumentFragment();

      for (let i = 0, r = 0; i < affichees.length; r++) {
        const m = MOTIF[r % MOTIF.length];
        const rangee = document.createElement('div');
        rangee.className = `rangee rangee--${m.type}`;
        for (const format of m.formats) {
          const carte = affichees[i++];
          if (!carte) break;
          carte.className = carte.className.replace(/\bcard--\S+/, `card--${format}`);
          rangee.append(carte);
        }
        fragment.append(rangee);
      }

      rangees.replaceChildren(fragment);
      if (plus) plus.hidden = liste.length <= visibles;
      if (animer && !reduceMotion.matches) rangees.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: 'ease' });
    };

    filtres.forEach((bouton) => bouton.addEventListener('click', () => {
      if (bouton.dataset.filtre === filtre) return;
      filtre = bouton.dataset.filtre;
      visibles = parPage;
      filtres.forEach((b) => b.setAttribute('aria-pressed', b === bouton));
      render(true);
    }));

    plus?.querySelector('button')?.addEventListener('click', () => {
      visibles += parPage;
      render(false);
    });

    render(false);
  });
})();
