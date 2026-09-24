// Formulaire de contact : validation, puis envoi.
// - Avec un attribut action (site.json → formulaire.action) : envoi POST classique vers ce service.
// - Sans action : ouvre la messagerie du visiteur avec le message prérempli, adressé à data-email.
(() => {
  document.querySelectorAll('.contact-page__formulaire').forEach((form) => {
    const statut = form.querySelector('.contact-page__statut');
    const dire = (texte, erreur = false) => {
      statut.textContent = texte;
      statut.classList.toggle('is-erreur', erreur);
    };

    // Les erreurs ne s'affichent qu'après une première tentative d'envoi
    form.addEventListener('input', () => { if (form.classList.contains('is-verifie')) dire(''); });

    form.addEventListener('submit', (e) => {
      form.classList.add('is-verifie');
      if (!form.checkValidity()) {
        e.preventDefault();
        const premier = form.querySelector(':invalid');
        premier?.focus();
        dire(premier?.type === 'checkbox'
          ? 'Merci d’accepter la politique de confidentialité.'
          : 'Merci de remplir les champs requis (nom et e-mail valide).', true);
        return;
      }
      if (form.getAttribute('action')) return; // envoi au service configuré

      e.preventDefault();
      const d = new FormData(form);
      const sujet = `Message depuis le site – ${d.get('nom')}`;
      const corps = [
        `Nom : ${d.get('nom')}`,
        `E-mail : ${d.get('email')}`,
        d.get('lieu') ? `Lieu du projet : ${d.get('lieu')}` : '',
        '',
        d.get('message') || '',
      ].filter((l, i) => l !== '' || i === 3).join('\n');
      window.location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
      dire('Votre messagerie s’ouvre avec le message prérempli. Il ne reste qu’à l’envoyer.');
    });
  });
})();
