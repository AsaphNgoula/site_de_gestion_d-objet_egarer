/* ================================================
   comment.js — Page comment ça marche
   DschangLost · Ville de Dschang
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ════════════════════════════════════════════
     FAQ ACCORDION
  ════════════════════════════════════════════ */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item   = btn.closest('.faq-item');
      const answer = document.getElementById('faq-' + btn.dataset.faq);
      const isOpen = item.classList.contains('open');

      /* Fermer tous */
      document.querySelectorAll('.faq-item').forEach(function (el) {
        el.classList.remove('open');
        const ans = el.querySelector('.faq-answer');
        if (ans) ans.classList.remove('open');
      });

      /* Ouvrir celui cliqué si était fermé */
      if (!isOpen) {
        item.classList.add('open');
        if (answer) answer.classList.add('open');
      }
    });
  });

  /* Ouvrir le premier par défaut */
  const first = document.querySelector('.faq-item');
  if (first) {
    first.classList.add('open');
    const ans = first.querySelector('.faq-answer');
    if (ans) ans.classList.add('open');
  }

});