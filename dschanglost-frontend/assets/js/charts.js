/* ================================================
   charts.js — Dashboard admin (version ultra animée)
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
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (sidebarToggle)  sidebarToggle.addEventListener('click', openSidebar);
  if (sidebarClose)   sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  /* ════════════════════════════════════════════
     BOUTON ACTUALISER + ANIMATION SPIN
  ════════════════════════════════════════════ */
  const btnRefresh = document.getElementById('btn-refresh');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', function () {
      btnRefresh.classList.add('spinning');
      setTimeout(() => btnRefresh.classList.remove('spinning'), 1000);
    });
  }

  /* ════════════════════════════════════════════
     COMPTEURS ANIMÉS (plus fluides avec easing)
  ════════════════════════════════════════════ */
  const counters = document.querySelectorAll('.stat-card-num[data-target]');

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = Math.ceil(target / 50);
    const interval = 15;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = current;
      }
    }, interval);
  }

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => obs.observe(c));
  } else {
    counters.forEach(c => c.textContent = c.dataset.target);
  }

  /* ════════════════════════════════════════════
     GRAPHIQUE BARRES — Évolution des objets
  ════════════════════════════════════════════ */
  const ctxBar = document.getElementById('chartObjets');
  if (!ctxBar) return;

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
          backgroundColor: 'rgba(45, 95, 168, 0.9)',
          borderRadius: 8,
          borderSkipped: false,
          barPercentage: 0.6,
        },
        {
          label: 'Objets restitués',
          data: dataByPeriod['6m'].restitutions,
          backgroundColor: 'rgba(200, 153, 42, 0.85)',
          borderRadius: 8,
          borderSkipped: false,
          barPercentage: 0.6,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1200,
        easing: 'easeOutQuart',
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { size: 13, weight: '500' }, padding: 20, usePointStyle: true }
        },
        tooltip: {
          backgroundColor: 'rgba(27,58,107,0.9)',
          titleColor: '#FFF',
          bodyColor: '#FFF',
          borderColor: '#C8992A',
          borderWidth: 1,
          cornerRadius: 8,
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
  document.querySelectorAll('.chart-filter').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.chart-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const period = btn.dataset.period;
      const d = dataByPeriod[period];
      barChart.data.labels           = d.labels;
      barChart.data.datasets[0].data = d.depots;
      barChart.data.datasets[1].data = d.restitutions;
      barChart.update();
    });
  });

  /* ════════════════════════════════════════════
     GRAPHIQUE DONUT — Par catégorie
  ════════════════════════════════════════════ */
  const ctxDonut = document.getElementById('chartCategories');
  if (!ctxDonut) return;

  const categories = [
    { label: 'Électronique',       value: 38, color: '#2D5FA8' },
    { label: 'Sac & Portefeuille', value: 25, color: '#C8992A' },
    { label: 'Documents',          value: 18, color: '#16A34A' },
    { label: 'Clés',               value: 12, color: '#7C3AED' },
    { label: 'Autres',             value: 7,  color: '#94A3B8' },
  ];

  const donutChart = new Chart(ctxDonut, {
    type: 'doughnut',
    data: {
      labels: categories.map(c => c.label),
      datasets: [{
        data: categories.map(c => c.value),
        backgroundColor: categories.map(c => c.color),
        borderWidth: 3,
        borderColor: '#FFFFFF',
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 1200,
        easing: 'easeOutBounce',
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label} : ${ctx.raw}%`
          }
        }
      }
    }
  });

  /* Légende personnalisée */
  const legendEl = document.getElementById('donut-legend');
  if (legendEl) {
    const total = categories.reduce((s, c) => s + c.value, 0);
    categories.forEach(cat => {
      const pct = Math.round((cat.value / total) * 100);
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