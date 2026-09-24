// Header : transparent sur la photo du hero, Toile au défilement (ou toujours, sur une page sans hero)
(() => {
  const header = document.getElementById('header');
  if (!header) return;
  const hero = document.querySelector('.hero');
  const onScroll = () => header.classList.toggle('is-solid', !hero || window.scrollY > hero.offsetHeight - header.offsetHeight);
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
})();
