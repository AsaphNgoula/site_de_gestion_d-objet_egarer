/* ================================================
   mise-en-relation.js — Version Expert
   DschangLost · Ville de Dschang
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ════════════════════════════════════════════
     DONNÉES
  ════════════════════════════════════════════ */
  const relations = [
    {
      id: 'MER-001',
      date: '19/05/2024',
      statut: 'confirme',
      score: '95% de correspondance',
      objet: { nom: 'Téléphone Samsung Galaxy A54', categorie: 'electronique', icon: 'fa-mobile-screen', lieu: 'Marché A', date: '19/05/2024' },
      inventeur: { nom: 'Jean Kamga', tel: '677 23 45 67', gmail: true, email: 'jean.kamga@gmail.com' },
      proprietaire: { nom: 'Marie Claire Fono', tel: '699 88 77 66', gmail: true, email: 'marieclaire.fono@gmail.com' },
    },
    {
      id: 'MER-002',
      date: '15/05/2024',
      statut: 'restitue',
      score: '88% de correspondance',
      objet: { nom: 'Portefeuille marron en cuir', categorie: 'sac', icon: 'fa-wallet', lieu: 'Campus UDo', date: '14/05/2024' },
      inventeur: { nom: 'Sophie Tchamba', tel: '674 56 78 90', gmail: false, email: '' },
      proprietaire: { nom: 'Paul Nkemeni', tel: '655 12 34 56', gmail: true, email: 'paul.nkemeni@gmail.com' },
    },
    {
      id: 'MER-003',
      date: '13/05/2024',
      statut: 'en_cours',
      score: '76% de correspondance',
      objet: { nom: 'Clés avec porte-clés rouge', categorie: 'cle', icon: 'fa-key', lieu: 'Carrefour Fongé', date: '13/05/2024' },
      inventeur: { nom: 'Roger Atangana', tel: '699 12 34 56', gmail: true, email: 'roger.atangana@gmail.com' },
      proprietaire: { nom: 'Alice Mballa', tel: '677 00 11 22', gmail: true, email: 'alice.mballa@gmail.com' },
    },
    {
      id: 'MER-004',
      date: '10/05/2024',
      statut: 'en_attente',
      score: '82% de correspondance',
      objet: { nom: 'Sac à main noir grande taille', categorie: 'sac', icon: 'fa-bag-shopping', lieu: 'Gare Routière', date: '12/05/2024' },
      inventeur: { nom: 'Bruno Essam', tel: '655 44 55 66', gmail: false, email: '' },
      proprietaire: { nom: 'Claire Ngo Biyong', tel: '690 77 88 99', gmail: true, email: 'claire.ngo@gmail.com' },
    },
    {
      id: 'MER-005',
      date: '08/05/2024',
      statut: 'en_attente',
      score: '91% de correspondance',
      objet: { nom: "Carte Nationale d'Identité", categorie: 'document', icon: 'fa-id-card', lieu: 'Hôtel de Ville', date: '10/05/2024' },
      inventeur: { nom: 'Hélène Wamba', tel: '678 33 44 55', gmail: true, email: 'helene.wamba@gmail.com' },
      proprietaire: { nom: 'Roger Eto Fils', tel: '655 99 00 11', gmail: false, email: '' },
    },
  ];

  /* ════════════════════════════════════════════
     ÉTAT
  ════════════════════════════════════════════ */
  let filtered = [...relations];
  let currentModal = null;
  let modalTarget  = null;

  /* ════════════════════════════════════════════
     DATE TOPBAR
  ════════════════════════════════════════════ */
  const dateEl = document.getElementById('topbar-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('fr-FR', {
      weekday:'long', day:'numeric', month:'long', year:'numeric'
    });
  }

  /* ════════════════════════════════════════════
     SIDEBAR MOBILE
  ════════════════════════════════════════════ */
  const sidebar        = document.getElementById('sidebar');
  const sidebarToggle  = document.getElementById('sidebar-toggle');
  const sidebarClose   = document.getElementById('sidebar-close');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  function openSide()  { sidebar?.classList.add('open');    sidebarOverlay?.classList.add('show'); document.body.style.overflow = 'hidden'; }
  function closeSide() { sidebar?.classList.remove('open'); sidebarOverlay?.classList.remove('show'); document.body.style.overflow = ''; }

  sidebarToggle?.addEventListener('click', openSide);
  sidebarClose?.addEventListener('click', closeSide);
  sidebarOverlay?.addEventListener('click', closeSide);

  /* ════════════════════════════════════════════
     MINI STATS ANIMÉES (plus fluides)
  ════════════════════════════════════════════ */
  function updateStats() {
    animateValue('ms-attente',  relations.filter(r => r.statut === 'en_attente').length);
    animateValue('ms-cours',    relations.filter(r => r.statut === 'en_cours').length);
    animateValue('ms-confirme', relations.filter(r => r.statut === 'confirme').length);
    animateValue('ms-restitue', relations.filter(r => r.statut === 'restitue').length);
  }

  function animateValue(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    const start = parseInt(el.textContent) || 0;
    const diff = target - start;
    if (diff === 0) return;
    const duration = 400;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + diff * eased);
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  /* ════════════════════════════════════════════
     BADGES
  ════════════════════════════════════════════ */
  function statutBadge(statut) {
    const map = {
      en_attente: { cls:'mer-statut--attente',  icon:'fa-hourglass-half', label:'En attente' },
      en_cours:   { cls:'mer-statut--cours',    icon:'fa-magnifying-glass', label:'En cours' },
      confirme:   { cls:'mer-statut--confirme', icon:'fa-circle-check', label:'Confirmée' },
      restitue:   { cls:'mer-statut--restitue', icon:'fa-handshake', label:'Restituée' },
    };
    const s = map[statut] || map['en_attente'];
    return `<span class="mer-statut ${s.cls}"><i class="fas ${s.icon}"></i>${s.label}</span>`;
  }

  function gmailBadge(hasGmail) {
    return hasGmail
      ? `<span class="gmail-badge gmail--yes"><i class="fab fa-google"></i> Gmail disponible</span>`
      : `<span class="gmail-badge"><i class="fas fa-times"></i> Pas de Gmail</span>`;
  }

  /* ════════════════════════════════════════════
     RENDU CARTES (avec animation staggered)
  ════════════════════════════════════════════ */
  function renderCards() {
    const listEl  = document.getElementById('mer-list');
    const emptyEl = document.getElementById('mer-empty');
    const numEl   = document.getElementById('results-num');
    if (!listEl) return;

    if (numEl) numEl.textContent = filtered.length;

    if (filtered.length === 0) {
      listEl.innerHTML = '';
      if (emptyEl) {
        emptyEl.style.display = 'block';
        emptyEl.style.opacity = '0';
        emptyEl.style.animation = 'none';
        emptyEl.offsetHeight; // reflow
        emptyEl.style.animation = 'scaleIn 0.4s ease forwards';
        emptyEl.style.opacity = '1';
      }
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    listEl.innerHTML = filtered.map((r, index) => `
      <div class="mer-card" data-id="${r.id}" style="animation-delay: ${0.6 + index * 0.1}s">

        <!-- En-tête -->
        <div class="mer-card-header">
          <span class="mer-card-id">${r.id}</span>
          <span class="mer-card-date"><i class="fas fa-calendar"></i>${r.date}</span>
        </div>

        <!-- Corps côte à côte -->
        <div class="mer-card-body">

          <!-- Inventeur (objet trouvé) -->
          <div class="mer-side mer-side--found">
            <span class="mer-side-tag">Objet trouvé — Inventeur</span>
            <div class="mer-side-objet">
              <div class="mer-obj-icon"><i class="fas ${r.objet.icon}"></i></div>
              <div class="mer-obj-info">
                <strong>${r.objet.nom}</strong>
                <span><i class="fas fa-location-dot"></i>${r.objet.lieu}</span>
                <span><i class="fas fa-calendar"></i>${r.objet.date}</span>
              </div>
            </div>
            <div class="mer-person">
              <div class="mer-person-name">
                <i class="fas fa-user-secret"></i> ${r.inventeur.nom}
              </div>
              <div class="mer-person-contact">
                <i class="fas fa-phone"></i> ${r.inventeur.tel}
              </div>
              ${gmailBadge(r.inventeur.gmail)}
            </div>
          </div>

          <!-- Flèche centrale -->
          <div class="mer-arrow">
            <div class="mer-arrow-icon"><i class="fas fa-arrows-left-right"></i></div>
            <span class="mer-score">${r.score}</span>
          </div>

          <!-- Propriétaire (perte déclarée) -->
          <div class="mer-side mer-side--lost">
            <span class="mer-side-tag">Déclaration de perte — Propriétaire</span>
            <div class="mer-side-objet">
              <div class="mer-obj-icon"><i class="fas ${r.objet.icon}"></i></div>
              <div class="mer-obj-info">
                <strong>${r.objet.nom}</strong>
                <span><i class="fas fa-location-dot"></i>${r.objet.lieu}</span>
                <span><i class="fas fa-calendar"></i>${r.date}</span>
              </div>
            </div>
            <div class="mer-person">
              <div class="mer-person-name">
                <i class="fas fa-user"></i> ${r.proprietaire.nom}
              </div>
              <div class="mer-person-contact">
                <i class="fas fa-phone"></i> ${r.proprietaire.tel}
              </div>
              ${gmailBadge(r.proprietaire.gmail)}
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="mer-card-footer">
          ${statutBadge(r.statut)}
          <div class="mer-actions">
            ${r.inventeur.gmail
              ? `<button class="btn-notify-found" data-id="${r.id}" data-target="inventeur">
                   <i class="fas fa-envelope"></i> Notifier inventeur
                 </button>`
              : ''}
            ${r.proprietaire.gmail
              ? `<button class="btn-notify-lost" data-id="${r.id}" data-target="proprietaire">
                   <i class="fas fa-envelope"></i> Notifier propriétaire
                 </button>`
              : ''}
            ${r.statut === 'en_cours' || r.statut === 'en_attente'
              ? `<button class="btn-confirm" data-id="${r.id}">
                   <i class="fas fa-circle-check"></i> Confirmer
                 </button>`
              : ''}
            ${r.statut === 'confirme'
              ? `<button class="btn-restitue" data-id="${r.id}">
                   <i class="fas fa-handshake"></i> Marquer restitué
                 </button>`
              : ''}
          </div>
        </div>

      </div>
    `).join('');

    /* Événements */
    listEl.querySelectorAll('.btn-notify-found, .btn-notify-lost').forEach(btn => {
      btn.addEventListener('click', () => openModal(btn.dataset.id, btn.dataset.target));
    });

    listEl.querySelectorAll('.btn-confirm').forEach(btn => {
      btn.addEventListener('click', () => updateStatut(btn.dataset.id, 'confirme'));
    });

    listEl.querySelectorAll('.btn-restitue').forEach(btn => {
      btn.addEventListener('click', () => updateStatut(btn.dataset.id, 'restitue'));
    });
  }

  /* ════════════════════════════════════════════
     MISE À JOUR STATUT (avec animation carte)
  ════════════════════════════════════════════ */
  function updateStatut(id, newStatut) {
    const rel = relations.find(r => r.id === id);
    if (!rel) return;
    rel.statut = newStatut;

    // Animation flash sur la carte avant re-render
    const card = document.querySelector(`.mer-card[data-id="${id}"]`);
    if (card) {
      card.style.transition = 'transform 0.3s, box-shadow 0.3s';
      card.style.transform = 'scale(1.02)';
      card.style.boxShadow = '0 12px 32px rgba(200,153,42,0.3)';
      setTimeout(() => {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = '';
      }, 300);
    }

    applyFilters();
    updateStats();
    const label = newStatut === 'confirme' ? 'confirmée' : 'restituée';
    showToast(`✅ Mise en relation ${label} avec succès !`);
  }

  /* ════════════════════════════════════════════
     MODALE EMAIL (animations améliorées)
  ════════════════════════════════════════════ */
  const modalOverlay = document.getElementById('modal-overlay');

  function openModal(id, target) {
    const rel = relations.find(r => r.id === id);
    if (!rel) return;

    currentModal = rel;
    modalTarget  = target;

    const person   = target === 'inventeur' ? rel.inventeur : rel.proprietaire;
    const role     = target === 'inventeur' ? "l'inventeur" : "le propriétaire";
    const titleEl  = document.getElementById('modal-title-text');
    const toEl     = document.getElementById('email-to');
    const subjectEl= document.getElementById('email-subject');
    const contentEl= document.getElementById('email-content');

    if (titleEl)   titleEl.textContent  = `Notifier ${role}`;
    if (toEl)      toEl.textContent     = `${person.nom} — ${person.email}`;
    if (subjectEl) subjectEl.textContent = `✅ Votre objet "${rel.objet.nom}" — DschangLost`;
    if (contentEl) contentEl.innerHTML  =
      `Bonjour <strong>${person.nom}</strong>,<br><br>
      Nous avons trouvé une correspondance concernant l'objet <strong>"${rel.objet.nom}"</strong>
      signalé à <strong>${rel.objet.lieu}</strong>.<br><br>
      Veuillez contacter la mairie de Dschang pour organiser la récupération en présentant une pièce d'identité.<br><br>
      Cordialement,<br>
      <strong>L'équipe DschangLost — Ville de Dschang 🇨🇲</strong>`;

    if (modalOverlay) {
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    currentModal = null;
    modalTarget  = null;
  }

  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('btn-modal-close')?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });

  // Fermeture avec Échap
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('open')) {
      closeModal();
    }
  });

  document.getElementById('btn-send-email')?.addEventListener('click', () => {
    // Animation du bouton d'envoi
    const btn = document.getElementById('btn-send-email');
    if (btn) {
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer l\'email';
        btn.disabled = false;
      }, 1500);
    }
    setTimeout(() => {
      closeModal();
      showToast('📧 Email envoyé avec succès au destinataire !');
    }, 800);
  });

  /* ════════════════════════════════════════════
     FILTRES & RECHERCHE
  ════════════════════════════════════════════ */
  function applyFilters() {
    const search = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
    const statut = document.getElementById('filter-statut')?.value || '';

    filtered = relations.filter(r => {
      const matchSearch = !search
        || r.objet.nom.toLowerCase().includes(search)
        || r.inventeur.nom.toLowerCase().includes(search)
        || r.proprietaire.nom.toLowerCase().includes(search)
        || r.id.toLowerCase().includes(search);
      const matchStatut = !statut || r.statut === statut;
      return matchSearch && matchStatut;
    });

    renderCards();
  }

  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');

  searchInput?.addEventListener('input', function () {
    if (searchClear) searchClear.style.display = this.value.trim() ? 'flex' : 'none';
    applyFilters();
  });

  searchClear?.addEventListener('click', () => {
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    searchClear.style.display = 'none';
    applyFilters();
  });

  document.getElementById('filter-statut')?.addEventListener('change', applyFilters);

  function resetFilters() {
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    if (searchClear) searchClear.style.display = 'none';
    const fs = document.getElementById('filter-statut');
    if (fs) fs.value = '';
    filtered = [...relations];
    renderCards();
    showToast('🔄 Filtres réinitialisés');
  }

  document.getElementById('btn-reset')?.addEventListener('click', resetFilters);
  document.getElementById('btn-reset-empty')?.addEventListener('click', resetFilters);

  // Raccourci Ctrl+R pour reset
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'r' && !modalOverlay?.classList.contains('open')) {
      e.preventDefault();
      resetFilters();
    }
  });

  /* ════════════════════════════════════════════
     TOAST (animé avec entrée/sortie)
  ════════════════════════════════════════════ */
  let toastTimer;
  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
  }

  /* ════════════════════════════════════════════
     INIT
  ════════════════════════════════════════════ */
  updateStats();
  renderCards();

});