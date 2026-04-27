/* ================================================
   main.js — Navbar interactions
   DschangLost · Ville de Dschang
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {

  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  /* ── Toggle menu mobile ── */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open');
    });

    /* Fermer si on clique en dehors */
    document.addEventListener('click', function (e) {
      const navbar = document.getElementById('navbar');
      if (navbar && !navbar.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
      }
    });

    /* Fermer si on clique sur un lien mobile */
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }

  /* ── Lien actif automatique selon la page ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.navbar-links .nav-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      document.querySelectorAll('.navbar-links .nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });

  /* ── Navbar shadow au scroll ── */
  window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 4px 24px rgba(27,58,107,0.28)';
      } else {
        navbar.style.boxShadow = '0 4px 20px rgba(27,58,107,0.2)';
      }
    }
  });

});