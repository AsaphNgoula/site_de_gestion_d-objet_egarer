//Chart.js pour dashboard
/* ================================================
   charts.js — Dashboard admin
   DschangLost · Ville de Dschang
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ════════════════════════════════════════════
     DATE DANS LA TOPBAR
  ════════════════════════════════════════════ */
  const dateEl = document.getElementById('topbar-date');
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  /* ════════════════════════════════════════════
     SIDEBAR TOGGLE (mobile)
  ════════════════════════════════════════════ */
  const sidebar        = document.getElementById('sidebar');
  const sidebarToggle  = document.getElementById('sidebar-toggle');
  const sidebarClose   = document.getElementById('sidebar-close');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  function openSidebar() {
    if (sidebar)        sidebar.classList.add('open');
    if (sidebarOverlay) sidebarOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (sidebar)        sidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (sidebarToggle)  sidebarToggle.addEventListener('click', openSidebar);
  if (sidebarClose)   sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  /* ════════════════════════════════════════════
     BOUTON ACTUALISER
  ════════════════════════════════════════════ */
  const btnRefresh = document.getElementById('btn-refresh');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', function () {
      btnRefresh.classList.add('spinning');
      setTimeout(function () {
        btnRefresh.classList.remove('spinning');
      }, 1000);
    });
  }

  /* ════════════════════════════════════════════
     COMPTEURS ANIMÉS
  ════════════════════════════════════════════ */
  const counters = document.querySelectorAll('.stat-card-num[data-target]');

  function animateCounter(el) {
    const target    = parseInt(el.dataset.target);
    const duration  = 1600;
    const step      = 16;
    const increment = target / (duration / step);
    let current     = 0;

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

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { obs.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.dataset.target; });
  }

  /* ════════════════════════════════════════════
     GRAPHIQUE BARRES — Évolution des objets
  ════════════════════════════════════════════ */
  const ctxBar = document.getElementById('chartObjets');
  if (!ctxBar) return;

  /* Données par période */
  const dataByPeriod = {
    '6m': {
      labels: ['Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
      depots:      [18, 24, 20, 28, 22, 30],
      restitutions:[12, 16, 14, 20, 15, 22]
    },
    '3m': {
      labels: ['Mar', 'Avr', 'Mai'],
      depots:      [28, 22, 30],
      restitutions:[20, 15, 22]
    },
    '1m': {
      labels: ['S1', 'S2', 'S3', 'S4'],
      depots:      [8, 9, 7, 6],
      restitutions:[5, 6, 5, 6]
    }
  };

  const barChart = new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: dataByPeriod['6m'].labels,
      datasets: [
        {
          label: 'Objets déposés',
          data: dataByPeriod['6m'].depots,
          backgroundColor: 'rgba(45, 95, 168, 0.85)',
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Objets restitués',
          data: dataByPeriod['6m'].restitutions,
          backgroundColor: 'rgba(200, 153, 42, 0.85)',
          borderRadius: 6,
          borderSkipped: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { size: 12 }, padding: 16 }
        },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return ' ' + ctx.dataset.label + ' : ' + ctx.raw;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 12 } }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { font: { size: 12 }, stepSize: 5 }
        }
      }
    }
  });

  /* Filtres période */
  document.querySelectorAll('.chart-filter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.chart-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const period = btn.dataset.period;
      const d = dataByPeriod[period];

      barChart.data.labels             = d.labels;
      barChart.data.datasets[0].data   = d.depots;
      barChart.data.datasets[1].data   = d.restitutions;
      barChart.update();
    });
  });

  /* ════════════════════════════════════════════
     GRAPHIQUE DONUT — Par catégorie
  ════════════════════════════════════════════ */
  const ctxDonut = document.getElementById('chartCategories');
  if (!ctxDonut) return;

  const categories = [
    { label: 'Électronique',     value: 38, color: '#2D5FA8' },
    { label: 'Sac & Portefeuille', value: 25, color: '#C8992A' },
    { label: 'Documents',        value: 18, color: '#16A34A' },
    { label: 'Clés',             value: 12, color: '#7C3AED' },
    { label: 'Autres',           value: 7,  color: '#94A3B8' },
  ];

  new Chart(ctxDonut, {
    type: 'doughnut',
    data: {
      labels: categories.map(c => c.label),
      datasets: [{
        data: categories.map(c => c.value),
        backgroundColor: categories.map(c => c.color),
        borderWidth: 2,
        borderColor: '#FFFFFF',
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return ' ' + ctx.label + ' : ' + ctx.raw + '%';
            }
          }
        }
      }
    }
  });

  /* Légende personnalisée */
  const legendEl = document.getElementById('donut-legend');
  if (legendEl) {
    const total = categories.reduce((s, c) => s + c.value, 0);
    categories.forEach(function (cat) {
      const pct  = Math.round((cat.value / total) * 100);
      const item = document.createElement('div');
      item.className = 'legend-item';
      item.innerHTML = `
        <div class="legend-dot-label">
          <span class="legend-dot" style="background:${cat.color}"></span>
          <span>${cat.label}</span>
        </div>
        <span class="legend-pct">${pct}%</span>
      `;
      legendEl.appendChild(item);
    });
  }

});