// Étapes de la démarche : le filet vertical relie le milieu du premier numéro au milieu du dernier,
// quelle que soit la longueur des textes. Recalculé quand la liste change de taille.
// (offsetTop ignore les transformations : la mesure reste juste pendant les animations d'apparition)
(() => {
  const placer = (liste) => {
    const ligne = liste.querySelector('.etapes__line');
    const numeros = [...liste.querySelectorAll('.etape__num')];
    if (!ligne || numeros.length < 2) return;
    const milieu = (num) => num.closest('.etape').offsetTop + num.offsetTop + num.offsetHeight / 2;
    const haut = milieu(numeros[0]);
    const bas = milieu(numeros[numeros.length - 1]);
    ligne.style.top = `${haut}px`;
    ligne.style.bottom = `${liste.offsetHeight - bas}px`;
  };

  document.querySelectorAll('.etapes').forEach((liste) => {
    placer(liste);
    if ('ResizeObserver' in window) new ResizeObserver(() => placer(liste)).observe(liste);
  });
})();
