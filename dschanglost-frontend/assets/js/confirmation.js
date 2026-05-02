/* ================================================
   confirmation.js — Page accusé de réception
   DschangLost · Ville de Dschang
   Version EXPERT — Particules, rebond, compte à rebours
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════════════════
     1. RÉFÉRENCE DE DÉPÔT ALÉATOIRE
     ════════════════════════════════════════════ */
  const refEl = document.getElementById('ref-code');
  if (refEl) {
    const year = new Date().getFullYear();
    const num  = Math.floor(1000 + Math.random() * 9000);
    refEl.textContent = `DSC-${year}-${num}`;
  }

  /* ════════════════════════════════════════════
     2. COMPTE À REBOURS ANIMÉ + EFFET PULSE
     ════════════════════════════════════════════ */
  const countdownEl = document.getElementById('countdown');
  const progressEl  = document.getElementById('countdown-progress');
  const TOTAL       = 10;
  let remaining     = TOTAL;

  if (progressEl) progressEl.style.width = '100%';

  const timer = setInterval(() => {
    remaining--;
    if (countdownEl) {
      countdownEl.textContent = remaining;
      // Effet de saut
      countdownEl.style.transform = 'scale(1.4) translateY(-2px)';
      setTimeout(() => {
        countdownEl.style.transform = 'scale(1) translateY(0)';
      }, 150);
    }
    if (progressEl) {
      const pct = (remaining / TOTAL) * 100;
      progressEl.style.width = pct + '%';
      if (remaining <= 3) {
        progressEl.style.background = 'linear-gradient(90deg, #C8992A, #DC2626)';
        progressEl.style.boxShadow = '0 0 12px rgba(220,38,38,0.5)';
      }
    }
    if (remaining <= 0) {
      clearInterval(timer);
      // Transition de sortie sur la carte
      const card = document.getElementById('confirmation-card');
      if (card) {
        card.style.transition = 'opacity 0.4s, transform 0.4s';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.96)';
      }
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 400);
    }
  }, 1000);

  // Annuler si l'utilisateur clique sur le bouton retour
  document.getElementById('btn-home')?.addEventListener('click', () => clearInterval(timer));

  /* ════════════════════════════════════════════
     3. PARTICULES AVANCÉES — formes et couleurs
     ════════════════════════════════════════════ */
  const container = document.getElementById('particles');
  if (!container) return;

  const shapes = ['circle', 'star']; // circle, star (étoile)
  const colors = [
    'rgba(200, 153, 42, 0.6)',   // or
    'rgba(22, 163, 74, 0.45)',   // vert
    'rgba(45, 95, 168, 0.4)',    // bleu acier
    'rgba(255, 255, 255, 0.25)', // blanc
  ];

  function createParticle() {
    const particle = document.createElement('div');
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    particle.classList.add('particle');
    if (shape === 'star') particle.classList.add('star');

    const size   = Math.random() * 14 + 6;
    const left   = Math.random() * 100;
    const dur    = Math.random() * 10 + 8;
    const delay  = Math.random() * 5;
    const color  = colors[Math.floor(Math.random() * colors.length)];
    const rotation = Math.random() * 360;

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -20px;
      background: ${shape === 'circle' ? color : 'transparent'};
      border: ${shape === 'star' ? '1.5px solid ' + color : 'none'};
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      transform: rotate(${rotation}deg);
    `;

    container.appendChild(particle);

    // Nettoyage après l'animation
    setTimeout(() => {
      if (particle.parentNode) particle.remove();
    }, (dur + delay) * 1000);
  }

  // Création initiale dense
  for (let i = 0; i < 25; i++) {
    setTimeout(createParticle, i * 100);
  }

  // Génération continue
  setInterval(createParticle, 700);

  /* ════════════════════════════════════════════
     4. EFFET DE SURVOL SUR LA CARTE (MOUVEMENT PARALLAX LÉGER)
     ════════════════════════════════════════════ */
  const card = document.getElementById('confirmation-card');
  if (card) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  }

});