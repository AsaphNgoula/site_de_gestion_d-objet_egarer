/* ================================================
   comparaison.js — Page comparaison admin
   DschangLost · Ville de Dschang
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ════════════════════════════════════════════
     DONNÉES
  ════════════════════════════════════════════ */
  const objetsData = [
    { id:'F1', nom:'Téléphone Samsung Galaxy A54',  categorie:'electronique', categorieLabel:'Électronique', lieu:'marche-a',       lieuLabel:'Marché A',       date:'19/05/2024' },
    { id:'F2', nom:'Portefeuille marron',            categorie:'sac',          categorieLabel:'Sac & Port.',   lieu:'campus-udo',      lieuLabel:'Campus UDo',     date:'14/05/2024' },
    { id:'F3', nom:'Clés avec porte-clés rouge',    categorie:'cle',          categorieLabel:'Clés',          lieu:'carrefour-fonge', lieuLabel:'Carrefour Fongé',date:'13/05/2024' },
    { id:'F4', nom:'Sac à main noir',               categorie:'sac',          categorieLabel:'Sac & Port.',   lieu:'gare-routiere',   lieuLabel:'Gare Routière',  date:'12/05/2024' },
    { id:'F5', nom:"Carte Nationale d'Identité",    categorie:'document',     categorieLabel:'Document',      lieu:'hotel-ville',     lieuLabel:'Hôtel de Ville', date:'10/05/2024' },
    { id:'F6', nom:'Montre connectée',              categorie:'electronique', categorieLabel:'Électronique', lieu:'campus-udo',      lieuLabel:'Campus UDo',     date:'08/05/2024' },
    { id:'F7', nom:'Veste bleue',                   categorie:'vetement',     categorieLabel:'Vêtement',      lieu:'marche-b',        lieuLabel:'Marché B',       date:'06/05/2024' },
    { id:'F8', nom:'Bague en or',                   categorie:'bijou',        categorieLabel:'Bijou',         lieu:'marche-a',        lieuLabel:'Marché A',       date:'04/05/2024' },
  ];

  const pertesData = [
    { id:'P1', nom:'Téléphone perdu (Samsung)',     categorie:'electronique', categorieLabel:'Électronique', lieu:'marche-a',       lieuLabel:'Marché A',       date:'18/05/2024', proprietaire:'Jean Dupont' },
    { id:'P2', nom:'Portefeuille en cuir',          categorie:'sac',          categorieLabel:'Sac & Port.',   lieu:'campus-udo',     lieuLabel:'Campus UDo',     date:'14/05/2024', proprietaire:'Marie Claire' },
    { id:'P3', nom:'Trousseau de clés',             categorie:'cle',          categorieLabel:'Clés',         lieu:'carrefour-fonge',lieuLabel:'Carrefour Fongé',date:'13/05/2024', proprietaire:'Paul Martin' },
    { id:'P4', nom:'Sac à main perdu',              categorie:'sac',          categorieLabel:'Sac & Port.',   lieu:'gare-routiere',  lieuLabel:'Gare Routière',  date:'11/05/2024', proprietaire:'Sophie Biya' },
    { id:'P5', nom:'CNI perdue',                    categorie:'document',     categorieLabel:'Document',     lieu:'hotel-ville',    lieuLabel:'Hôtel de Ville', date:'10/05/2024', proprietaire:'Roger Eto' },
    { id:'P6', nom:'Montre de sport',               categorie:'electronique', categorieLabel:'Électronique', lieu:'campus-udo',     lieuLabel:'Campus UDo',     date:'07/05/2024', proprietaire:'Alice Bello' },
  ];

  /* ════════════════════════════════════════════
     ÉTAT
  ════════════════════════════════════════════ */
  let filteredObjets = [];
  let filteredPertes = [];
  let selectedFound  = null;
  let selectedLost   = null;
  let matchedPairs   = new Set(); /* IDs des objets qui ont une correspondance */

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

  if (sidebarToggle)  sidebarToggle.addEventListener('click',  () => { sidebar?.classList.add('open');    sidebarOverlay?.classList.add('show'); });
  if (sidebarClose)   sidebarClose.addEventListener('click',   () => { sidebar?.classList.remove('open'); sidebarOverlay?.classList.remove('show'); });
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', () => { sidebar?.classList.remove('open'); sidebarOverlay?.classList.remove('show'); });

  /* ════════════════════════════════════════════
     ICÔNES PAR CATÉGORIE
  ════════════════════════════════════════════ */
  const catIcons = {
    electronique:'fa-mobile-screen', document:'fa-id-card',
    sac:'fa-wallet', cle:'fa-key', vetement:'fa-shirt',
    bijou:'fa-gem', autre:'fa-box'
  };

  /* ════════════════════════════════════════════
     DÉTECTER LES CORRESPONDANCES
     (même catégorie + même lieu)
  ════════════════════════════════════════════ */
  function detectMatches(objets, pertes) {
    const pairs = [];
    objets.forEach(o => {
      pertes.forEach(p => {
        if (o.categorie === p.categorie && o.lieu === p.lieu) {
          pairs.push({ found: o.id, lost: p.id });
        }
      });
    });
    return pairs;
  }

  /* ════════════════════════════════════════════
     RENDU COLONNES
  ════════════════════════════════════════════ */
  function renderFound(list, matchedIds) {
    const el = document.getElementById('list-found');
    const countEl = document.getElementById('count-found');
    if (!el) return;
    if (countEl) countEl.textContent = list.length;

    if (list.length === 0) {
      el.innerHTML = `<div class="comp-empty"><i class="fas fa-box-open"></i><p>Aucun objet trouvé pour ces filtres</p></div>`;
      return;
    }

    el.innerHTML = list.map(o => {
      const isMatch    = matchedIds.has(o.id);
      const isSelected = selectedFound?.id === o.id;
      return `
        <div class="comp-card ${isMatch ? 'matched' : ''} ${isSelected ? 'selected' : ''}" data-id="${o.id}" data-type="found">
          ${isMatch ? '<div class="comp-card-match"><i class="fas fa-circle-check"></i> Correspondance</div>' : ''}
          <div class="comp-card-top">
            <div class="comp-card-icon"><i class="fas ${catIcons[o.categorie] || 'fa-box'}"></i></div>
            <div class="comp-card-info">
              <strong>${o.nom}</strong>
              <span>${o.categorieLabel}</span>
            </div>
          </div>
          <div class="comp-card-badges">
            <span class="cc-badge cc-badge--cat">${o.categorieLabel}</span>
            <span class="cc-badge cc-badge--lieu"><i class="fas fa-location-dot"></i> ${o.lieuLabel}</span>
            <span class="cc-badge cc-badge--date"><i class="fas fa-calendar"></i> ${o.date}</span>
          </div>
          <button class="btn-select-card" data-id="${o.id}" data-type="found">
            <i class="fas fa-${isSelected ? 'check' : 'plus'}"></i>
            ${isSelected ? 'Sélectionné' : 'Sélectionner'}
          </button>
        </div>
      `;
    }).join('');

    /* Événements */
    el.querySelectorAll('.comp-card').forEach(card => {
      card.addEventListener('click', () => selectFound(card.dataset.id));
    });
  }

  function renderLost(list, matchedIds) {
    const el = document.getElementById('list-lost');
    const countEl = document.getElementById('count-lost');
    if (!el) return;
    if (countEl) countEl.textContent = list.length;

    if (list.length === 0) {
      el.innerHTML = `<div class="comp-empty"><i class="fas fa-triangle-exclamation"></i><p>Aucune déclaration de perte pour ces filtres</p></div>`;
      return;
    }

    el.innerHTML = list.map(p => {
      const isMatch    = matchedIds.has(p.id);
      const isSelected = selectedLost?.id === p.id;
      return `
        <div class="comp-card ${isMatch ? 'matched' : ''} ${isSelected ? 'selected' : ''}" data-id="${p.id}" data-type="lost">
          ${isMatch ? '<div class="comp-card-match"><i class="fas fa-circle-check"></i> Correspondance</div>' : ''}
          <div class="comp-card-top">
            <div class="comp-card-icon comp-card-icon--lost"><i class="fas ${catIcons[p.categorie] || 'fa-box'}"></i></div>
            <div class="comp-card-info">
              <strong>${p.nom}</strong>
              <span>${p.proprietaire}</span>
            </div>
          </div>
          <div class="comp-card-badges">
            <span class="cc-badge cc-badge--cat">${p.categorieLabel}</span>
            <span class="cc-badge cc-badge--lieu"><i class="fas fa-location-dot"></i> ${p.lieuLabel}</span>
            <span class="cc-badge cc-badge--date"><i class="fas fa-calendar"></i> ${p.date}</span>
          </div>
          <button class="btn-select-card btn-select-card--lost" data-id="${p.id}" data-type="lost">
            <i class="fas fa-${isSelected ? 'check' : 'plus'}"></i>
            ${isSelected ? 'Sélectionné' : 'Sélectionner'}
          </button>
        </div>
      `;
    }).join('');

    el.querySelectorAll('.comp-card').forEach(card => {
      card.addEventListener('click', () => selectLost(card.dataset.id));
    });
  }

  /* ════════════════════════════════════════════
     SÉLECTION POUR MISE EN RELATION
  ════════════════════════════════════════════ */
  function selectFound(id) {
    const o = filteredObjets.find(x => x.id === id);
    selectedFound = selectedFound?.id === id ? null : o;
    renderAll();
    updateRelationZone();
  }

  function selectLost(id) {
    const p = filteredPertes.find(x => x.id === id);
    selectedLost = selectedLost?.id === id ? null : p;
    renderAll();
    updateRelationZone();
  }

  function updateRelationZone() {
    const zone = document.getElementById('relation-zone');
    if (!zone) return;

    if (selectedFound && selectedLost) {
      zone.style.display = 'block';
      document.getElementById('rel-found-nom').textContent  = selectedFound.nom;
      document.getElementById('rel-found-lieu').textContent = selectedFound.lieuLabel + ' · ' + selectedFound.date;
      document.getElementById('rel-lost-nom').textContent   = selectedLost.nom;
      document.getElementById('rel-lost-lieu').textContent  = selectedLost.lieuLabel + ' · ' + selectedLost.date;
      zone.scrollIntoView({ behavior:'smooth', block:'nearest' });
    } else {
      zone.style.display = 'none';
    }
  }

  /* ════════════════════════════════════════════
     MISE EN RELATION CONFIRMÉE
  ════════════════════════════════════════════ */
  document.getElementById('btn-confirm-relation')?.addEventListener('click', function () {
    if (!selectedFound || !selectedLost) return;
    showToast(`✅ Mise en relation confirmée : "${selectedFound.nom}" ↔ "${selectedLost.nom}"`);
    selectedFound = null;
    selectedLost  = null;
    document.getElementById('relation-zone').style.display = 'none';
    renderAll();
  });

  document.getElementById('btn-cancel-relation')?.addEventListener('click', function () {
    selectedFound = null;
    selectedLost  = null;
    document.getElementById('relation-zone').style.display = 'none';
    renderAll();
  });

  /* ════════════════════════════════════════════
     RENDU GLOBAL + MISE À JOUR STATS
  ════════════════════════════════════════════ */
  function renderAll() {
    const matches    = detectMatches(filteredObjets, filteredPertes);
    const matchFoundIds = new Set(matches.map(m => m.found));
    const matchLostIds  = new Set(matches.map(m => m.lost));

    renderFound(filteredObjets, matchFoundIds);
    renderLost(filteredPertes,  matchLostIds);

    /* Stats */
    animNum('nb-match', matches.length);
    animNum('nb-found', filteredObjets.length);
    animNum('nb-lost',  filteredPertes.length);
  }

  function animNum(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let cur = 0;
    const step = Math.ceil(target / 20);
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur;
      if (cur >= target) clearInterval(timer);
    }, 30);
  }

  /* ════════════════════════════════════════════
     FILTRES
  ════════════════════════════════════════════ */
  function applyFilters() {
    const cat    = document.getElementById('filter-categorie')?.value || '';
    const lieu   = document.getElementById('filter-lieu')?.value     || '';

    filteredObjets = objetsData.filter(o =>
      (!cat  || o.categorie === cat) &&
      (!lieu || o.lieu      === lieu)
    );

    filteredPertes = pertesData.filter(p =>
      (!cat  || p.categorie === cat) &&
      (!lieu || p.lieu      === lieu)
    );

    selectedFound = null;
    selectedLost  = null;

    const zone = document.getElementById('relation-zone');
    if (zone) zone.style.display = 'none';

    renderAll();
  }

  /* Bouton lancer comparaison */
  const btnComparer = document.getElementById('btn-comparer');
  if (btnComparer) {
    btnComparer.addEventListener('click', function () {
      this.classList.add('loading');
      this.querySelector('span') && (this.querySelector('span').textContent = 'Analyse...');
      setTimeout(() => {
        this.classList.remove('loading');
        applyFilters();
        showToast('🔍 Comparaison effectuée avec succès !');
      }, 800);
    });
  }

  /* Réinitialiser */
  document.getElementById('btn-reset-comp')?.addEventListener('click', function () {
    ['filter-categorie','filter-lieu','filter-periode'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    filteredObjets = [...objetsData];
    filteredPertes = [...pertesData];
    selectedFound = null;
    selectedLost  = null;
    const zone = document.getElementById('relation-zone');
    if (zone) zone.style.display = 'none';
    renderAll();
  });

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
  filteredObjets = [...objetsData];
  filteredPertes = [...pertesData];
  renderAll();

});