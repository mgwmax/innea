/* Innea — scripts partagés
   Chaque bloc ne s'active que si ses éléments sont présents dans la page. */

(() => {
  const header = document.getElementById('header');
  const hero = document.querySelector('.hero');

  // Header : transparent sur la photo du hero, Toile au défilement (ou toujours, sans hero)
  if (header) {
    const onScroll = () => header.classList.toggle('is-solid', !hero || window.scrollY > hero.offsetHeight - header.offsetHeight);
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();
  }

  // Menu mobile plein écran
  const toggle = header?.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    const setMenu = (open) => {
      header.classList.toggle('is-open', open);
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', !open);
      menu.inert = !open;
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open);
      toggle.textContent = open ? 'Fermer' : 'Menu';
      if (open) menu.focus({ preventScroll: true });
    };
    menu.inert = true;
    toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
    menu.querySelectorAll('.mobile-menu__entrees a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); toggle.focus(); } });
    matchMedia('(min-width: 641px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
  }

  // FR / EN : état partagé entre le header et le menu mobile
  const langButtons = [...document.querySelectorAll('.lang button')];
  langButtons.forEach(b => b.addEventListener('click', () => {
    langButtons.forEach(o => o.setAttribute('aria-pressed', o.textContent === b.textContent));
  }));

  // Hero carousel : fondu enchaîné image + légende, durée réglable via data-interval (ms)
  const slides = hero ? [...hero.querySelectorAll('.hero__img')] : [];
  if (slides.length > 1) {
    const legendes = [...hero.querySelectorAll('.hero__legendes p')];
    const dots = [...hero.querySelectorAll('.indicator button')];
    const interval = Number(hero.dataset.interval) || 5000;
    let current = 0, timer;

    const show = (i) => {
      current = (i + slides.length) % slides.length;
      [slides, legendes].forEach(list => list.forEach((el, n) => el.classList.toggle('is-active', n === current)));
      legendes.forEach((el, n) => el.setAttribute('aria-hidden', n !== current));
      dots.forEach((d, n) => n === current ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current'));
    };
    const start = () => { clearInterval(timer); timer = setInterval(() => show(current + 1), interval); };

    dots.forEach((d, i) => d.addEventListener('click', () => { show(i); start(); }));
    document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(timer) : start());
    start();
  }
})();
