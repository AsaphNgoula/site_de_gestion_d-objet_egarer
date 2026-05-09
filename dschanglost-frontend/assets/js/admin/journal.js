/* ================================================
   journal.js — Page journal d'activité admin
   Version Expert — Animations & interactions
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ════════════════════════════════════════════
     DONNÉES DU JOURNAL
  ════════════════════════════════════════════ */
  const logs = [
    { id:'001', date:'19/05/2024', heure:'10h32', type:'consultation', typeLabel:'Consultation coffre-fort', detail:'Consultation de la liste complète des objets déposés', objet:'Coffre-fort complet', ip:'192.168.1.1' },
    { id:'002', date:'19/05/2024', heure:'10h45', type:'relation',     typeLabel:'Mise en relation',         detail:'Mise en relation confirmée entre inventeur et propriétaire', objet:'Téléphone Samsung Galaxy A54', ip:'192.168.1.1' },
    { id:'003', date:'19/05/2024', heure:'11h02', type:'notification', typeLabel:'Notification email',       detail:'Email de notification envoyé au propriétaire inscrit', objet:'Téléphone Samsung Galaxy A54', ip:'192.168.1.1' },
    { id:'004', date:'18/05/2024', heure:'09h15', type:'connexion',    typeLabel:'Connexion admin',           detail:'Connexion au tableau de bord administrateur', objet:'—', ip:'192.168.1.2' },
    { id:'005', date:'18/05/2024', heure:'09h20', type:'consultation', typeLabel:'Consultation coffre-fort', detail:'Consultation de l\'objet #F3 — Clés avec porte-clés rouge', objet:'Clés avec porte-clés rouge', ip:'192.168.1.2' },
    { id:'006', date:'18/05/2024', heure:'09h35', type:'validation',   typeLabel:'Validation objet',         detail:'Statut de l\'objet mis à jour : En attente → En cours d\'analyse', objet:'Clés avec porte-clés rouge', ip:'192.168.1.2' },
    { id:'007', date:'17/05/2024', heure:'14h10', type:'consultation', typeLabel:'Consultation coffre-fort', detail:'Consultation de l\'objet #F1 — Téléphone Samsung', objet:'Téléphone Samsung Galaxy A54', ip:'192.168.1.1' },
    { id:'008', date:'17/05/2024', heure:'14h22', type:'relation',     typeLabel:'Mise en relation',         detail:'Comparaison effectuée entre objets trouvés et déclarations', objet:'Comparaison multiple', ip:'192.168.1.1' },
    { id:'009', date:'16/05/2024', heure:'08h55', type:'connexion',    typeLabel:'Connexion admin',           detail:'Connexion au tableau de bord administrateur', objet:'—', ip:'192.168.1.3' },
    { id:'010', date:'16/05/2024', heure:'09h05', type:'consultation', typeLabel:'Consultation coffre-fort', detail:'Consultation de la liste complète des objets déposés', objet:'Coffre-fort complet', ip:'192.168.1.3' },
    { id:'011', date:'15/05/2024', heure:'11h30', type:'notification', typeLabel:'Notification email',       detail:'Email de notification envoyé au propriétaire inscrit', objet:'Portefeuille marron', ip:'192.168.1.1' },
    { id:'012', date:'15/05/2024', heure:'11h45', type:'validation',   typeLabel:'Validation objet',         detail:'Statut mis à jour : En cours → Restitué', objet:'Portefeuille marron', ip:'192.168.1.1' },
    { id:'013', date:'14/05/2024', heure:'16h00', type:'consultation', typeLabel:'Consultation coffre-fort', detail:'Consultation de l\'objet #F4 — Sac à main noir', objet:'Sac à main noir', ip:'192.168.1.2' },
    { id:'014', date:'13/05/2024', heure:'10h20', type:'relation',     typeLabel:'Mise en relation',         detail:'Mise en relation confirmée inventeur / propriétaire', objet:'Bague en or', ip:'192.168.1.1' },
    { id:'015', date:'13/05/2024', heure:'10h35', type:'notification', typeLabel:'Notification email',       detail:'Email de notification envoyé au propriétaire', objet:'Bague en or', ip:'192.168.1.1' },
  ];

  /* ════════════════════════════════════════════
     ÉTAT
  ════════════════════════════════════════════ */
  let filteredLogs = [...logs];
  let currentPage  = 1;
  const perPage    = 8;

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

  sidebarToggle?.addEventListener('click',  () => { sidebar?.classList.add('open');    sidebarOverlay?.classList.add('show'); document.body.style.overflow = 'hidden'; });
  sidebarClose?.addEventListener('click',   () => { sidebar?.classList.remove('open'); sidebarOverlay?.classList.remove('show'); document.body.style.overflow = ''; });
  sidebarOverlay?.addEventListener('click', () => { sidebar?.classList.remove('open'); sidebarOverlay?.classList.remove('show'); document.body.style.overflow = ''; });

  /* ════════════════════════════════════════════
     MINI STATS ANIMÉES (easing)
  ════════════════════════════════════════════ */
  function updateStats() {
    animateValue('js-total',   logs.length);
    animateValue('js-consult', logs.filter(l => l.type === 'consultation').length);
    animateValue('js-relation',logs.filter(l => l.type === 'relation').length);
    animateValue('js-notif',   logs.filter(l => l.type === 'notification').length);
  }

  function animateValue(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    const start = parseInt(el.textContent) || 0;
    const diff = target - start;
    if (diff === 0) return;
    const duration = 500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out
      el.textContent = Math.round(start + diff * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ════════════════════════════════════════════
     BADGE TYPE D'ACTION
  ════════════════════════════════════════════ */
  const actionIcons = {
    consultation: 'fa-eye',
    relation:     'fa-handshake',
    notification: 'fa-bell',
    validation:   'fa-circle-check',
    connexion:    'fa-right-to-bracket',
  };

  function actionBadge(log) {
    return `<span class="action-badge action--${log.type}">
      <i class="fas ${actionIcons[log.type] || 'fa-circle'}"></i>
      ${log.typeLabel}
    </span>`;
  }

  /* ════════════════════════════════════════════
     RENDU TABLEAU (avec délai d'animation)
  ════════════════════════════════════════════ */
  function renderTable() {
    const tbody   = document.getElementById('journal-body');
    const emptyEl = document.getElementById('table-empty');
    const numEl   = document.getElementById('results-num');
    if (!tbody) return;

    if (filteredLogs.length === 0) {
      tbody.innerHTML = '';
      if (emptyEl) {
        emptyEl.style.display = 'block';
        emptyEl.style.animation = 'none';
        emptyEl.offsetHeight;
        emptyEl.style.animation = 'scaleIn 0.4s ease forwards';
      }
      if (numEl) numEl.textContent = '0';
      renderPagination();
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (numEl) numEl.textContent = filteredLogs.length;

    const start = (currentPage - 1) * perPage;
    const page  = filteredLogs.slice(start, start + perPage);

    tbody.innerHTML = page.map((log, i) => {
      const delay = (i * 0.05).toFixed(2); // délai croissant
      return `<tr style="animation-delay: ${delay}s">
        <td class="td-num">${String(start + i + 1).padStart(3,'0')}</td>
        <td class="td-datetime">
          <span class="td-date">${log.date}</span>
          <span class="td-time"><i class="fas fa-clock"></i>${log.heure}</span>
        </td>
        <td>${actionBadge(log)}</td>
        <td class="td-detail">${log.detail}</td>
        <td class="td-objet"><strong>${log.objet}</strong></td>
        <td class="td-ip">${log.ip}</td>
      </tr>`;
    }).join('');

    renderPagination();
  }

  /* ════════════════════════════════════════════
     PAGINATION
  ════════════════════════════════════════════ */
  function renderPagination() {
    const infoEl = document.getElementById('pagination-info');
    const btnsEl = document.getElementById('pagination-btns');
    if (!btnsEl) return;

    const total      = filteredLogs.length;
    const totalPages = Math.ceil(total / perPage);
    const start      = Math.min((currentPage - 1) * perPage + 1, total);
    const end        = Math.min(currentPage * perPage, total);

    if (infoEl) infoEl.textContent = total > 0 ? `Affichage ${start}–${end} sur ${total}` : '';

    btnsEl.innerHTML = '';

    const prev = document.createElement('button');
    prev.className = 'page-btn';
    prev.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prev.disabled  = currentPage === 1;
    prev.addEventListener('click', () => { currentPage--; renderTable(); });
    btnsEl.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
      btn.textContent = i;
      btn.addEventListener('click', () => { currentPage = i; renderTable(); });
      btnsEl.appendChild(btn);
    }

    const next = document.createElement('button');
    next.className = 'page-btn';
    next.innerHTML = '<i class="fas fa-chevron-right"></i>';
    next.disabled = currentPage === totalPages || totalPages === 0;
    next.addEventListener('click', () => { currentPage++; renderTable(); });
    btnsEl.appendChild(next);
  }

  /* ════════════════════════════════════════════
     FILTRES & RECHERCHE
  ════════════════════════════════════════════ */
  function applyFilters() {
    const search = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
    const type   = document.getElementById('filter-type')?.value || '';
    const date   = document.getElementById('filter-date')?.value || '';

    filteredLogs = logs.filter(log => {
      const matchSearch = !search || log.detail.toLowerCase().includes(search) || log.objet.toLowerCase().includes(search) || log.typeLabel.toLowerCase().includes(search);
      const matchType   = !type   || log.type === type;
      let matchDate = true;
      if (date === 'today') matchDate = log.date === '19/05/2024';
      if (date === 'week')  matchDate = ['19/05/2024','18/05/2024','17/05/2024','16/05/2024','15/05/2024'].includes(log.date);
      if (date === 'month') matchDate = log.date.includes('/05/2024');
      return matchSearch && matchType && matchDate;
    });

    currentPage = 1;
    renderTable();
  }

  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');

  searchInput?.addEventListener('input', function () {
    if (searchClear) searchClear.style.display = this.value.trim() ? 'flex' : 'none';
    applyFilters();
  });

  searchClear?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    searchClear.style.display = 'none';
    applyFilters();
  });

  document.getElementById('filter-type')?.addEventListener('change', applyFilters);
  document.getElementById('filter-date')?.addEventListener('change', applyFilters);

  function resetFilters() {
    if (searchInput) { searchInput.value = ''; searchInput.focus(); }
    if (searchClear) searchClear.style.display = 'none';
    ['filter-type','filter-date'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    filteredLogs = [...logs];
    currentPage  = 1;
    renderTable();
    showToast('🔄 Filtres réinitialisés');
  }

  document.getElementById('btn-reset')?.addEventListener('click', resetFilters);
  document.getElementById('btn-reset-empty')?.addEventListener('click', resetFilters);

  /* ════════════════════════════════════════════
     EXPORT CSV (avec animation)
  ════════════════════════════════════════════ */
  const exportBtn = document.getElementById('btn-export');
  exportBtn?.addEventListener('click', () => {
    // Animation succès
    exportBtn.classList.add('success');
    exportBtn.innerHTML = '<i class="fas fa-check-circle"></i> Exporté !';
    setTimeout(() => {
      exportBtn.classList.remove('success');
      exportBtn.innerHTML = '<i class="fas fa-file-export"></i> Exporter CSV';
    }, 2000);

    // Construction CSV
    const headers = ['#','Date','Heure','Type','Détail','Objet','IP'];
    const rows = logs.map((l,i) => [
      String(i+1).padStart(3,'0'), l.date, l.heure, l.typeLabel,
      '"' + l.detail + '"', l.objet, l.ip
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'journal-activite-dschanglost.csv';
    a.click();
    URL.revokeObjectURL(url);

    showToast('📁 Fichier CSV exporté avec succès');
  });

  /* ════════════════════════════════════════════
     TOAST
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
  renderTable();

});