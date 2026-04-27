/* ================================================
   animations.js — Carousel + Counters + Scroll
   DschangLost · Ville de Dschang
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ════════════════════════════════════════════
     CAROUSEL
  ════════════════════════════════════════════ */
  const slides    = document.querySelectorAll('.carousel-slide');
  const dots      = document.querySelectorAll('.dot');
  const btnPrev   = document.getElementById('carousel-prev');
  const btnNext   = document.getElementById('carousel-next');

  if (!slides.length) return; // pas de carousel sur cette page

  let current   = 0;
  let autoTimer = null;
  const INTERVAL = 5000; // 5 secondes

  /* ── Aller à un slide précis ── */
  function goTo(index) {
    // Désactiver l'ancien slide
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');

    // Calculer le nouvel index (boucle)
    current = (index + slides.length) % slides.length;

    // Activer le nouveau
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  /* ── Suivant ── */
  function next() { goTo(current + 1); }

  /* ── Précédent ── */
  function prev() { goTo(current - 1); }

  /* ── Autoplay ── */
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, INTERVAL);
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  /* ── Événements flèches ── */
  if (btnNext) btnNext.addEventListener('click', function () { next(); startAuto(); });
  if (btnPrev) btnPrev.addEventListener('click', function () { prev(); startAuto(); });

  /* ── Événements dots ── */
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goTo(parseInt(this.dataset.slide));
      startAuto();
    });
  });

  /* ── Swipe tactile (mobile) ── */
  let touchStartX = 0;
  let touchEndX   = 0;

  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    });

    hero.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {        // seuil de 50px
        if (diff > 0) next();           // swipe gauche → suivant
        else          prev();           // swipe droite → précédent
        startAuto();
      }
    });
  }

  /* ── Pause au survol ── */
  if (hero) {
    hero.addEventListener('mouseenter', stopAuto);
    hero.addEventListener('mouseleave', startAuto);
  }

  /* ── Démarrage ── */
  startAuto();


  /* ════════════════════════════════════════════
     COMPTEURS ANIMÉS (stats)
  ════════════════════════════════════════════ */
  const counters = document.querySelectorAll('.stat-num[data-target]');

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target);
    const duration = 1800; // ms
    const step     = 16;   // ~60fps
    const increment = target / (duration / step);
    let current    = 0;

    const timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, step);
  }

  /* Observer : lancer le compteur quand la section est visible */
  if (counters.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target); // ne lancer qu'une fois
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) { observer.observe(counter); });
  } else {
    // Fallback : afficher directement
    counters.forEach(function (counter) {
      counter.textContent = counter.dataset.target;
    });
  }


  /* ════════════════════════════════════════════
     ANIMATION APPARITION AU SCROLL
     (cards how-section et trust-section)
  ════════════════════════════════════════════ */
  const animEls = document.querySelectorAll('.how-card, .trust-card, .stat-item');

  /* Ajouter la classe CSS de départ */
  animEls.forEach(function (el) {
    el.style.opacity  = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  if ('IntersectionObserver' in window) {
    const scrollObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          /* Délai en cascade selon l'index */
          setTimeout(function () {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
          }, 80 * (Array.from(animEls).indexOf(entry.target) % 4));

          scrollObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    animEls.forEach(function (el) { scrollObserver.observe(el); });
  } else {
    /* Fallback */
    animEls.forEach(function (el) {
      el.style.opacity   = '1';
      el.style.transform = 'none';
    });
  }


  /* ════════════════════════════════════════════
     SCROLL INDICATOR — masquer après scroll
  ════════════════════════════════════════════ */
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 80) {
        scrollIndicator.style.opacity    = '0';
        scrollIndicator.style.transition = 'opacity 0.4s';
      } else {
        scrollIndicator.style.opacity = '1';
      }
    });
  }

});