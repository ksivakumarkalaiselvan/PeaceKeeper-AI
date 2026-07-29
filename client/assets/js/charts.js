// Chart.js Helper Wrappers

export function initLineChart(canvasId, labels, datasets) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: datasets.map((ds, idx) => ({
        label: ds.label,
        data: ds.data,
        borderColor: idx === 0 ? '#00F0FF' : '#FF0055',
        backgroundColor: idx === 0 ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255, 0, 85, 0.1)',
        tension: 0.3,
        fill: true,
        pointRadius: 4
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#94A3B8' } }
      },
      scales: {
        x: { ticks: { color: '#64748B' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#64748B' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });
}

export function initDoughnutChart(canvasId, labels, data) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#FF0055', '#FF7700', '#FFB703', '#00E676'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: '#94A3B8' } }
      }
    }
  });
}

export function initBarChart(canvasId, labels, data) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Violations / Incidents',
        data,
        backgroundColor: 'rgba(0, 240, 255, 0.6)',
        borderColor: '#00F0FF',
        borderWidth: 1,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#94A3B8' } }
      },
      scales: {
        x: { ticks: { color: '#64748B' }, grid: { display: false } },
        y: { ticks: { color: '#64748B' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });
}
