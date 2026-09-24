// FR / EN : état partagé entre tous les sélecteurs de langue de la page
(() => {
  const buttons = [...document.querySelectorAll('.lang button')];
  buttons.forEach(b => b.addEventListener('click', () => {
    buttons.forEach(o => o.setAttribute('aria-pressed', o.textContent === b.textContent));
  }));
})();
