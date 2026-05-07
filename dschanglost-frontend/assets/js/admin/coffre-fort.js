/* ================================================
   coffre-fort.js — Page coffre-fort admin
   DschangLost · Ville de Dschang
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ════════════════════════════════════════════
     DONNÉES DES OBJETS
  ════════════════════════════════════════════ */
  const objets = [
    {
      id: '001', nom: 'Téléphone Samsung Galaxy A54',
      description: 'Noir, avec coque de protection rouge. Écran légèrement fissuré.',
      categorie: 'electronique', categorieLabel: 'Électronique',
      lieu: 'marche-a', lieuLabel: 'Marché A',
      date: '19/05/2024', heure: '10h30',
      statut: 'en_attente', photo: true,
      inventeur: 'Jean Kamga', contact: '677 23 45 67'
    },
    {
      id: '002', nom: 'Portefeuille marron',
      description: 'En cuir, contient plusieurs cartes bancaires et une photo.',
      categorie: 'sac', categorieLabel: 'Sac & Portefeuille',
      lieu: 'campus-udo', lieuLabel: 'Campus UDo',
      date: '14/05/2024', heure: '14h15',
      statut: 'restitue', photo: false,
      inventeur: 'Marie Foko', contact: '690 11 22 33'
    },
    {
      id: '003', nom: 'Clés avec porte-clés rouge',
      description: 'Trousseau de 3 clés. Porte-clés rouge en forme de cœur.',
      categorie: 'cle', categorieLabel: 'Clés',
      lieu: 'carrefour-fonge', lieuLabel: 'Carrefour Fongé',
      date: '13/05/2024', heure: '08h45',
      statut: 'en_cours', photo: true,
      inventeur: 'Paul Nkemeni', contact: '655 88 99 00'
    },
    {
      id: '004', nom: 'Sac à main noir',
      description: 'Grande taille, tissu synthétique. Contient des documents.',
      categorie: 'sac', categorieLabel: 'Sac & Portefeuille',
      lieu: 'gare-routiere', lieuLabel: 'Gare Routière',
      date: '12/05/2024', heure: '16h00',
      statut: 'en_attente', photo: true,
      inventeur: 'Sophie Tchamba', contact: '674 56 78 90'
    },
    {
      id: '005', nom: "Carte Nationale d'Identité",
      description: 'CNI camerounaise, nom illisible en raison de dommages.',
      categorie: 'document', categorieLabel: 'Document',
      lieu: 'hotel-ville', lieuLabel: 'Hôtel de Ville',
      date: '10/05/2024', heure: '11h20',
      statut: 'en_attente', photo: false,
      inventeur: 'Roger Atangana', contact: '699 12 34 56'
    },
    {
      id: '006', nom: 'Montre connectée',
      description: 'Montre noire, bracelet silicone bleu. Batterie déchargée.',
      categorie: 'electronique', categorieLabel: 'Électronique',
      lieu: 'campus-udo', lieuLabel: 'Campus UDo',
      date: '08/05/2024', heure: '09h00',
      statut: 'en_cours', photo: true,
      inventeur: 'Alice Mballa', contact: '677 00 11 22'
    },
    {
      id: '007', nom: 'Veste bleue',
      description: 'Veste en jean taille M, marque Zara. Légèrement usée.',
      categorie: 'vetement', categorieLabel: 'Vêtement',
      lieu: 'marche-b', lieuLabel: 'Marché B',
      date: '06/05/2024', heure: '15h30',
      statut: 'en_attente', photo: false,
      inventeur: 'Bruno Essam', contact: '655 44 55 66'
    },
    {
      id: '008', nom: 'Bague en or',
      description: 'Petite bague en or jaune sans inscription.',
      categorie: 'bijou', categorieLabel: 'Bijou',
      lieu: 'marche-a', lieuLabel: 'Marché A',
      date: '04/05/2024', heure: '12h10',
      statut: 'restitue', photo: true,
      inventeur: 'Claire Ngo', contact: '690 77 88 99'
    },
  ];

  /* ════════════════════════════════════════════
     ÉTAT
  ════════════════════════════════════════════ */
  let filteredObjets = [...objets];
  let currentPage    = 1;
  const perPage      = 5;
  let selectedObjet  = null;

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

  if (sidebarToggle) sidebarToggle.addEventListener('click', () => { sidebar.classList.add('open'); sidebarOverlay.classList.add('show'); });
  if (sidebarClose)  sidebarClose.addEventListener('click',  () => { sidebar.classList.remove('open'); sidebarOverlay.classList.remove('show'); });
  if (sidebarOverlay)sidebarOverlay.addEventListener('click',() => { sidebar.classList.remove('open'); sidebarOverlay.classList.remove('show'); });

  /* ════════════════════════════════════════════
     MINI STATS
  ════════════════════════════════════════════ */
  function updateStats() {
    const total    = objets.length;
    const attente  = objets.filter(o => o.statut === 'en_attente').length;
    const cours    = objets.filter(o => o.statut === 'en_cours').length;
    const restitue = objets.filter(o => o.statut === 'restitue').length;

    animNum('cs-total',   total);
    animNum('cs-attente', attente);
    animNum('cs-cours',   cours);
    animNum('cs-restitue',restitue);

    const nbEl = document.getElementById('nb-total');
    if (nbEl) nbEl.textContent = total;
  }

  function animNum(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let cur = 0;
    const step = target / 30;
    const timer = setInterval(() => {
      cur += step;
      if (cur >= target) { el.textContent = target; clearInterval(timer); }
      else el.textContent = Math.floor(cur);
    }, 20);
  }

  /* ════════════════════════════════════════════
     RENDU TABLEAU
  ════════════════════════════════════════════ */
  const catIcons = {
    electronique:'fa-mobile-screen', document:'fa-id-card',
    sac:'fa-wallet', cle:'fa-key', vetement:'fa-shirt',
    bijou:'fa-gem', autre:'fa-box'
  };

  function statutBadge(s) {
    if (s === 'en_attente')  return '<span class="status-badge status--waiting">En attente</span>';
    if (s === 'en_cours')    return '<span class="status-badge status--analyzing">En cours</span>';
    if (s === 'restitue')    return '<span class="status-badge status--found">Restitué</span>';
    return '';
  }

  function catBadge(o) {
    return `<span class="cat-badge cat--${o.categorie}">${o.categorieLabel}</span>`;
  }

  function renderTable() {
    const tbody    = document.getElementById('table-body');
    const emptyEl  = document.getElementById('table-empty');
    const numEl    = document.getElementById('results-num');
    if (!tbody) return;

    if (filteredObjets.length === 0) {
      tbody.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'block';
      if (numEl)   numEl.textContent = '0';
      renderPagination();
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (numEl)   numEl.textContent = filteredObjets.length;

    const start = (currentPage - 1) * perPage;
    const page  = filteredObjets.slice(start, start + perPage);

    tbody.innerHTML = page.map(o => `
      <tr data-id="${o.id}">
        <td class="td-num">${o.id}</td>
        <td class="td-objet">
          <div class="objet-cell">
            <div class="objet-icon"><i class="fas ${catIcons[o.categorie] || 'fa-box'}"></i></div>
            <div>
              <strong>${o.nom}</strong>
              <span>${o.description.substring(0,50)}...</span>
            </div>
          </div>
        </td>
        <td>${catBadge(o)}</td>
        <td><i class="fas fa-location-dot td-icon"></i>${o.lieuLabel}</td>
        <td><i class="fas fa-calendar td-icon"></i>${o.date}</td>
        <td>
          ${o.photo
            ? '<span class="photo-badge photo--yes"><i class="fas fa-image"></i> Oui</span>'
            : '<span class="photo-badge photo--no"><i class="fas fa-image-slash"></i> Non</span>'}
        </td>
        <td>${statutBadge(o.statut)}</td>
        <td class="td-actions">
          <button class="btn-detail" data-id="${o.id}" title="Voir détail"><i class="fas fa-eye"></i></button>
          <button class="btn-compare-row" title="Comparer"><i class="fas fa-code-compare"></i></button>
          <button class="btn-notify-row" data-id="${o.id}" title="Notifier"><i class="fas fa-bell"></i></button>
        </td>
      </tr>
    `).join('');

    /* Événements boutons */
    tbody.querySelectorAll('.btn-detail').forEach(btn => {
      btn.addEventListener('click', () => openModal(btn.dataset.id));
    });
    tbody.querySelectorAll('.btn-notify-row').forEach(btn => {
      btn.addEventListener('click', () => showToast('📧 Notification envoyée au propriétaire !'));
    });

    renderPagination();
  }

  /* ════════════════════════════════════════════
     PAGINATION
  ════════════════════════════════════════════ */
  function renderPagination() {
    const infoEl = document.getElementById('pagination-info');
    const btnsEl = document.getElementById('pagination-btns');
    if (!btnsEl) return;

    const total     = filteredObjets.length;
    const totalPages= Math.ceil(total / perPage);
    const start     = Math.min((currentPage - 1) * perPage + 1, total);
    const end       = Math.min(currentPage * perPage, total);

    if (infoEl) infoEl.textContent = total > 0 ? `Affichage ${start}–${end} sur ${total}` : '';

    btnsEl.innerHTML = '';

    /* Précédent */
    const prev = document.createElement('button');
    prev.className = 'page-btn';
    prev.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prev.disabled  = currentPage === 1;
    prev.addEventListener('click', () => { currentPage--; renderTable(); });
    btnsEl.appendChild(prev);

    /* Pages */
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
      btn.textContent = i;
      btn.addEventListener('click', () => { currentPage = i; renderTable(); });
      btnsEl.appendChild(btn);
    }

    /* Suivant */
    const next = document.createElement('button');
    next.className = 'page-btn';
    next.innerHTML = '<i class="fas fa-chevron-right"></i>';
    next.disabled  = currentPage === totalPages || totalPages === 0;
    next.addEventListener('click', () => { currentPage++; renderTable(); });
    btnsEl.appendChild(next);
  }

  /* ════════════════════════════════════════════
     FILTRES & RECHERCHE
  ════════════════════════════════════════════ */
  function applyFilters() {
    const search   = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
    const categorie= document.getElementById('filter-categorie')?.value || '';
    const statut   = document.getElementById('filter-statut')?.value || '';
    const lieu     = document.getElementById('filter-lieu')?.value || '';

    filteredObjets = objets.filter(o => {
      const matchSearch   = !search   || o.nom.toLowerCase().includes(search) || o.description.toLowerCase().includes(search) || o.lieuLabel.toLowerCase().includes(search);
      const matchCategorie= !categorie|| o.categorie === categorie;
      const matchStatut   = !statut   || o.statut === statut;
      const matchLieu     = !lieu     || o.lieu === lieu;
      return matchSearch && matchCategorie && matchStatut && matchLieu;
    });

    currentPage = 1;
    renderTable();
  }

  /* Recherche en temps réel */
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      if (searchClear) searchClear.style.display = this.value ? 'block' : 'none';
      applyFilters();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchClear.style.display = 'none';
      applyFilters();
    });
  }

  ['filter-categorie','filter-statut','filter-lieu'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', applyFilters);
  });

  /* Réinitialiser */
  function resetFilters() {
    if (searchInput) searchInput.value = '';
    if (searchClear) searchClear.style.display = 'none';
    ['filter-categorie','filter-statut','filter-lieu'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    applyFilters();
  }

  document.getElementById('btn-reset')?.addEventListener('click', resetFilters);
  document.getElementById('btn-reset-empty')?.addEventListener('click', resetFilters);

  /* ════════════════════════════════════════════
     TRI
  ════════════════════════════════════════════ */
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const sort = this.dataset.sort;
      filteredObjets.sort((a, b) => {
        if (sort === 'date')      return b.date.localeCompare(a.date);
        if (sort === 'categorie') return a.categorieLabel.localeCompare(b.categorieLabel);
        if (sort === 'lieu')      return a.lieuLabel.localeCompare(b.lieuLabel);
        return 0;
      });
      currentPage = 1;
      renderTable();
    });
  });

  /* ════════════════════════════════════════════
     MODALE DÉTAIL
  ════════════════════════════════════════════ */
  const modalOverlay = document.getElementById('modal-overlay');
  const modalBody    = document.getElementById('modal-body');

  function openModal(id) {
    const o = objets.find(obj => obj.id === id);
    if (!o || !modalBody) return;
    selectedObjet = o;

    modalBody.innerHTML = `
      <div class="modal-section">
        <div class="modal-section-title"><i class="fas fa-box-open"></i> Informations sur l'objet</div>
        <div class="modal-grid">
          <div class="modal-field"><label>Nom</label><span>${o.nom}</span></div>
          <div class="modal-field"><label>Catégorie</label><span>${o.categorieLabel}</span></div>
          <div class="modal-field"><label>Lieu trouvé</label><span>${o.lieuLabel}</span></div>
          <div class="modal-field"><label>Date</label><span>${o.date} à ${o.heure}</span></div>
          <div class="modal-field" style="grid-column:1/-1"><label>Description</label><span>${o.description}</span></div>
          <div class="modal-field"><label>Statut</label><span>${o.statut === 'en_attente' ? '🟡 En attente' : o.statut === 'en_cours' ? '🔵 En cours' : '🟢 Restitué'}</span></div>
        </div>
      </div>

      <div class="modal-section">
        <div class="modal-section-title"><i class="fas fa-camera"></i> Photo de l'objet</div>
        ${o.photo
          ? '<div class="modal-photo-box"><i class="fas fa-image"></i><p>Photo disponible — accessible uniquement via route sécurisée Laravel</p></div>'
          : '<div class="modal-photo-box"><i class="fas fa-image-slash"></i><p>Aucune photo fournie par l\'inventeur</p></div>'
        }
      </div>

      <div class="modal-section">
        <div class="modal-section-title"><i class="fas fa-user-secret"></i> Coordonnées inventeur (confidentiel)</div>
        <div class="modal-grid">
          <div class="modal-field"><label>Nom</label><span>${o.inventeur}</span></div>
          <div class="modal-field"><label>Téléphone</label><span>${o.contact}</span></div>
        </div>
      </div>
    `;

    if (modalOverlay) modalOverlay.classList.add('open');
  }

  function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove('open');
    selectedObjet = null;
  }

  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('btn-modal-close')?.addEventListener('click', closeModal);
  document.getElementById('btn-modal-notify')?.addEventListener('click', () => {
    closeModal();
    showToast('📧 Notification envoyée au propriétaire par email !');
  });

  /* Fermer en cliquant sur l'overlay */
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }

  /* ════════════════════════════════════════════
     TOAST
  ════════════════════════════════════════════ */
  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  /* ════════════════════════════════════════════
     EXPORT CSV
  ════════════════════════════════════════════ */
  document.getElementById('btn-export')?.addEventListener('click', () => {
    const headers = ['ID','Nom','Catégorie','Lieu','Date','Statut'];
    const rows    = objets.map(o => [o.id, o.nom, o.categorieLabel, o.lieuLabel, o.date, o.statut]);
    const csv     = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob    = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement('a');
    a.href        = url;
    a.download    = 'coffre-fort-dschanglost.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('📄 Export CSV téléchargé !');
  });

  /* ════════════════════════════════════════════
     INIT
  ════════════════════════════════════════════ */
  updateStats();
  renderTable();

});