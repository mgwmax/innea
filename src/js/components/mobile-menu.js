// Menu mobile plein écran, ouvert par le bouton « Menu » du header
(() => {
  const header = document.getElementById('header');
  const toggle = header?.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

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
})();
