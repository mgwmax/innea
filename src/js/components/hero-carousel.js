// Hero carrousel : fondu enchaîné image + légende, durée réglable via data-interval (ms)
(() => {
  const hero = document.querySelector('.hero');
  const slides = hero ? [...hero.querySelectorAll('.hero__img')] : [];
  if (slides.length < 2) return;

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
})();
