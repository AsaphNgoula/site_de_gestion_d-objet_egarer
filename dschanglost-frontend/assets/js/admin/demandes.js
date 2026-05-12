/* ================================================
   demandes.js — Page demandes d'assistance admin
   DschangLost · Ville de Dschang
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ════════════════════════════════════════════
     DONNÉES
  ════════════════════════════════════════════ */
  const demandes = [
    {
      id: 'DEM-001',
      proprietaire: 'Jean Dupont',
      email: 'jean.dupont@gmail.com',
      tel: '677 23 45 67',
      objet: 'Téléphone Samsung Galaxy A54',
      objet_icon: 'fa-mobile-screen',
      message: 'Bonjour, j\'ai perdu mon téléphone Samsung noir au Marché A le 18 mai. Est-ce qu\'un objet correspondant a été déposé ? Je suis disponible pour le récupérer.',
      date: '19/05/2024',
      heure: '11h20',
      statut: 'non_lu',
    },
    {
      id: 'DEM-002',
      proprietaire: 'Marie Claire Fono',
      email: 'marie.fono@gmail.com',
      tel: '699 88 77 66',
      objet: 'Portefeuille marron en cuir',
      objet_icon: 'fa-wallet',
      message: 'Bonsoir, j\'ai perdu mon portefeuille marron en cuir sur le Campus UDo. Il contient ma carte d\'identité et mes cartes bancaires. Merci de me contacter si vous l\'avez.',
      date: '15/05/2024',
      heure: '16h45',
      statut: 'traite',
    },
    {
      id: 'DEM-003',
      proprietaire: 'Paul Nkemeni',
      email: 'paul.nkemeni@gmail.com',
      tel: '655 12 34 56',
      objet: 'Clés avec porte-clés rouge',
      objet_icon: 'fa-key',
      message: 'Bonjour, j\'ai perdu mes clés le 13 mai au niveau du Carrefour Fongé. Porte-clés rouge en forme de cœur. C\'est urgent car c\'est la clé de mon domicile.',
      date: '14/05/2024',
      heure: '09h10',
      statut: 'non_lu',
    },
    {
      id: 'DEM-004',
      proprietaire: 'Sophie Biya',
      email: 'sophie.biya@gmail.com',
      tel: '674 56 00 11',
      objet: 'Sac à main noir grande taille',
      objet_icon: 'fa-bag-shopping',
      message: 'Bonjour, j\'ai oublié mon sac à main noir à la gare routière lors de mon départ. Il contient des documents importants. Avez-vous une information à ce sujet ?',
      date: '12/05/2024',
      heure: '14h30',
      statut: 'lu',
    },
    {
      id: 'DEM-005',
      proprietaire: 'Roger Eto Fils',
      email: 'roger.eto@gmail.com',
      tel: '655 99 00 11',
      objet: "Carte Nationale d'Identité",
      objet_icon: 'fa-id-card',
      message: 'Bonjour monsieur l\'administrateur, j\'ai égaré ma CNI à l\'Hôtel de Ville le 10 mai. Je n\'ai aucune pièce d\'identité pour le moment ce qui me pose problème. Merci.',
      date: '11/05/2024',
      heure: '08h55',
      statut: 'non_lu',
    },
    {
      id: 'DEM-006',
      proprietaire: 'Alice Mballa',
      email: 'alice.mballa@gmail.com',
      tel: '677 00 11 22',
      objet: 'Montre connectée noire',
      objet_icon: 'fa-clock',
      message: 'Bonsoir, j\'ai perdu ma montre connectée noire bracelet bleu au Campus UDo. La batterie était déchargée. Si quelqu\'un l\'a trouvée merci de me contacter.',
      date: '09/05/2024',
      heure: '18h00',
      statut: 'traite',
    },
  ];

  /* ════════════════════════════════════════════
     ÉTAT
  ════════════════════════════════════════════ */
  let filtered     = [...demandes];
  let currentDemId = null;

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

  sidebarToggle?.addEventListener('click',  () => { sidebar?.classList.add('open');    sidebarOverlay?.classList.add('show'); });
  sidebarClose?.addEventListener('click',   () => { sidebar?.classList.remove('open'); sidebarOverlay?.classList.remove('show'); });
  sidebarOverlay?.addEventListener('click', () => { sidebar?.classList.remove('open'); sidebarOverlay?.classList.remove('show'); });

  /* ════════════════════════════════════════════
     MINI STATS ANIMÉES
  ════════════════════════════════════════════ */
  function updateStats() {
    const total  = demandes.length;
    const nonlu  = demandes.filter(d => d.statut === 'non_lu').length;
    const lu     = demandes.filter(d => d.statut === 'lu').length;
    const traite = demandes.filter(d => d.statut === 'traite').length;

    animNum('ds-total',  total);
    animNum('ds-nonlu',  nonlu);
    animNum('ds-lu',     lu);
    animNum('ds-traite', traite);

    /* Badge sidebar */
    const nbEl = document.getElementById('nb-nonlu');
    if (nbEl) nbEl.textContent = nonlu;
  }

  function animNum(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let cur = 0;
    const step = Math.ceil(target / 20) || 1;
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur;
      if (cur >= target) clearInterval(timer);
    }, 30);
  }

  /* ════════════════════════════════════════════
     INITIALES AVATAR
  ════════════════════════════════════════════ */
  function initiales(nom) {
    return nom.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase();
  }

  /* ════════════════════════════════════════════
     BADGE STATUT
  ════════════════════════════════════════════ */
  function statutBadge(statut) {
    const map = {
      non_lu: { cls:'dem-statut--non_lu', icon:'fa-circle',       label:'Non lu' },
      lu:     { cls:'dem-statut--lu',     icon:'fa-envelope-open', label:'Lu' },
      traite: { cls:'dem-statut--traite', icon:'fa-circle-check', label:'Traité' },
    };
    const s = map[statut] || map['non_lu'];
    return `<span class="dem-statut ${s.cls}"><i class="fas ${s.icon}"></i>${s.label}</span>`;
  }

  /* ════════════════════════════════════════════
     RENDU CARTES
  ════════════════════════════════════════════ */
  function renderCards() {
    const listEl  = document.getElementById('dem-list');
    const emptyEl = document.getElementById('dem-empty');
    const numEl   = document.getElementById('results-num');
    if (!listEl) return;

    if (numEl) numEl.textContent = filtered.length;

    if (filtered.length === 0) {
      listEl.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    listEl.innerHTML = filtered.map(d => `
      <div class="dem-card ${d.statut}" data-id="${d.id}">

        <!-- En-tête -->
        <div class="dem-card-header">
          <div class="dem-card-user">
            <div class="dem-avatar">${initiales(d.proprietaire)}</div>
            <div class="dem-user-info">
              <strong>${d.proprietaire}</strong>
              <span><i class="fas fa-envelope"></i>${d.email}</span>
              <span><i class="fas fa-phone"></i>${d.tel}</span>
            </div>
          </div>
          <div class="dem-card-meta">
            ${statutBadge(d.statut)}
            <span class="dem-date">
              <i class="fas fa-calendar"></i>${d.date} à ${d.heure}
            </span>
          </div>
        </div>

        <!-- Corps -->
        <div class="dem-card-body">
          <!-- Objet concerné -->
          <div class="dem-objet-ref">
            <i class="fas ${d.objet_icon}"></i>
            <div>
              <span>Objet concerné</span>
              <strong>${d.objet}</strong>
            </div>
          </div>
          <!-- Message -->
          <div class="dem-message">"${d.message}"</div>
        </div>

        <!-- Footer -->
        <div class="dem-card-footer">
          <div class="dem-footer-left">
            <i class="fas fa-hashtag"></i> Réf. ${d.id}
          </div>
          <div class="dem-actions">
            ${d.statut === 'non_lu'
              ? `<button class="btn-marquer-lu" data-id="${d.id}">
                   <i class="fas fa-envelope-open"></i> Marquer lu
                 </button>`
              : ''}
            <button class="btn-repondre" data-id="${d.id}">
              <i class="fas fa-reply"></i> Répondre
            </button>
            ${d.statut !== 'traite'
              ? `<button class="btn-marquer-traite" data-id="${d.id}">
                   <i class="fas fa-circle-check"></i> Marquer traité
                 </button>`
              : ''}
          </div>
        </div>

      </div>
    `).join('');

    /* Événements boutons */
    listEl.querySelectorAll('.btn-marquer-lu').forEach(btn => {
      btn.addEventListener('click', () => updateStatut(btn.dataset.id, 'lu'));
    });

    listEl.querySelectorAll('.btn-marquer-traite').forEach(btn => {
      btn.addEventListener('click', () => updateStatut(btn.dataset.id, 'traite'));
    });

    listEl.querySelectorAll('.btn-repondre').forEach(btn => {
      btn.addEventListener('click', () => openModal(btn.dataset.id));
    });
  }

  /* ════════════════════════════════════════════
     MISE À JOUR STATUT
  ════════════════════════════════════════════ */
  function updateStatut(id, newStatut) {
    const dem = demandes.find(d => d.id === id);
    if (!dem) return;
    dem.statut = newStatut;
    applyFilters();
    updateStats();
    const label = newStatut === 'lu' ? 'marquée comme lue' : 'marquée comme traitée';
    showToast(`✅ Demande ${label} !`);
  }

  /* ════════════════════════════════════════════
     TOUT MARQUER LU
  ════════════════════════════════════════════ */
  document.getElementById('btn-mark-all')?.addEventListener('click', () => {
    demandes.forEach(d => { if (d.statut === 'non_lu') d.statut = 'lu'; });
    applyFilters();
    updateStats();
    showToast('✅ Toutes les demandes ont été marquées comme lues !');
  });

  /* ════════════════════════════════════════════
     MODALE RÉPONSE
  ════════════════════════════════════════════ */
  const modalOverlay = document.getElementById('modal-overlay');

  function openModal(id) {
    const dem = demandes.find(d => d.id === id);
    if (!dem) return;
    currentDemId = id;

    /* Marquer lu automatiquement à l'ouverture */
    if (dem.statut === 'non_lu') {
      dem.statut = 'lu';
      applyFilters();
      updateStats();
    }

    /* Remplir modale */
    const infoEl  = document.getElementById('modal-demande-info');
    const nomEl   = document.getElementById('reponse-nom');
    const textEl  = document.getElementById('reponse-text');

    if (infoEl) {
      infoEl.innerHTML = `
        <strong>${dem.proprietaire}</strong> — ${dem.email}<br>
        <span style="color:var(--texte-second)">Objet : <strong>${dem.objet}</strong></span><br>
        <span style="color:var(--texte-second);font-size:12px">${dem.date} à ${dem.heure}</span><br><br>
        <em style="color:var(--texte-second)">"${dem.message}"</em>
      `;
    }

    if (nomEl)  nomEl.textContent = dem.proprietaire;
    if (textEl) textEl.value = '';

    if (modalOverlay) modalOverlay.classList.add('open');
  }

  function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove('open');
    currentDemId = null;
  }

  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('btn-modal-close')?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

  document.getElementById('btn-send-reponse')?.addEventListener('click', () => {
    const textEl = document.getElementById('reponse-text');
    if (!textEl?.value.trim()) {
      textEl?.classList.add('error');
      textEl?.setAttribute('placeholder', '⚠ Veuillez écrire une réponse avant d\'envoyer.');
      return;
    }
    /* Marquer comme traité après réponse */
    if (currentDemId) updateStatut(currentDemId, 'traite');
    closeModal();
    showToast('📧 Réponse envoyée avec succès au propriétaire !');
  });

  /* ════════════════════════════════════════════
     FILTRES & RECHERCHE
  ════════════════════════════════════════════ */
  function applyFilters() {
    const search = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
    const statut = document.getElementById('filter-statut')?.value || '';

    filtered = demandes.filter(d => {
      const matchSearch = !search
        || d.proprietaire.toLowerCase().includes(search)
        || d.objet.toLowerCase().includes(search)
        || d.message.toLowerCase().includes(search)
        || d.id.toLowerCase().includes(search);
      const matchStatut = !statut || d.statut === statut;
      return matchSearch && matchStatut;
    });

    renderCards();
  }

  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');

  searchInput?.addEventListener('input', function () {
    if (searchClear) searchClear.style.display = this.value ? 'block' : 'none';
    applyFilters();
  });

  searchClear?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    searchClear.style.display = 'none';
    applyFilters();
  });

  document.getElementById('filter-statut')?.addEventListener('change', applyFilters);

  function resetFilters() {
    if (searchInput) searchInput.value = '';
    if (searchClear) searchClear.style.display = 'none';
    const fs = document.getElementById('filter-statut');
    if (fs) fs.value = '';
    filtered = [...demandes];
    renderCards();
  }

  document.getElementById('btn-reset')?.addEventListener('click', resetFilters);
  document.getElementById('btn-reset-empty')?.addEventListener('click', resetFilters);

  /* ════════════════════════════════════════════
     TOAST
  ════════════════════════════════════════════ */
  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  /* ════════════════════════════════════════════
     INIT
  ════════════════════════════════════════════ */
  updateStats();
  renderCards();

});