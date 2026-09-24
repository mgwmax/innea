// Animations d'apparition : révèle les éléments [data-reveal] quand ils entrent dans l'écran.
// Styles et variantes : css/base/animations.css. Ne fait rien si <html> n'a pas la classe « anim »
// (préférence « réduire les animations », ou navigateur sans IntersectionObserver).
(() => {
  const html = document.documentElement;
  if (!html.classList.contains('anim')) return;

  // Titres : chaque ligne (séparée par <br>) dans un masque, pour la faire glisser
  document.querySelectorAll('[data-reveal="titre"]').forEach((titre) => {
    titre.innerHTML = titre.innerHTML
      .split(/<br\s*\/?>/i)
      .map((ligne, i) => `<span class="ligne-masque"><span style="--i:${i}">${ligne.trim()}</span></span>`)
      .join('');
  });
  html.classList.add('anim-prete');

  // Les éléments qui apparaissent en même temps sont décalés (dans l'ordre du document), 90ms chacun, 6 au plus
  const avant = (a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
  const observateur = new IntersectionObserver((entrees) => {
    entrees
      .filter((e) => e.isIntersecting)
      .map((e) => e.target)
      .sort(avant)
      .forEach((el, k) => {
        el.style.setProperty('--delai', `${Math.min(k, 6) * 0.09}s`);
        el.classList.add('est-revele');
        observateur.unobserve(el);
      });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.12 }); // déclenche un peu avant le bas de l'écran

  document.querySelectorAll('[data-reveal]').forEach((el) => observateur.observe(el));
})();
