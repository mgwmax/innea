// Avant / après : le curseur (input range transparent) déplace la poignée et la découpe de l'image « avant »
(() => {
  document.querySelectorAll('.avant-apres').forEach((cadre) => {
    const curseur = cadre.querySelector('.avant-apres__curseur');
    if (!curseur) return;
    const maj = () => cadre.style.setProperty('--position', `${curseur.value}%`);
    curseur.addEventListener('input', maj);
    maj();
  });
})();
