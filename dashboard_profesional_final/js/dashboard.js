/* ==========================================================
   DASHBOARD EJECUTIVO DE VENTAS 2025
   ========================================================== */

if (typeof DATA === 'undefined') {
  throw new Error('No se encontró DATA. Revisa que js/data.js esté cargando correctamente.');
}

if (typeof Chart === 'undefined') {
  throw new Error('Chart.js no se cargó correctamente.');
}

const $ = id => document.getElementById(id);
const fmtMoney = n => '$' + Number(n || 0).toLocaleString('es-MX', {maximumFractionDigits: 0});
const fmtMoney2 = n => '$' + Number(n || 0).toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2});
const fmtNumber = n => Number(n || 0).toLocaleString('es-MX');

const COLORS = {
  purple: '#8b7bd8',
  purpleSoft: 'rgba(139,123,216,.16)',
  green: '#4ca987',
  greenSoft: 'rgba(76,169,135,.15)',
  blue: '#5b9bd5',
  orange: '#d9985b',
  red: '#c96f7d',
  grid: '#eceaf2',
  text: '#77758a'
};

Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.color = COLORS.text;

const sum = (arr, key) => arr.reduce((total, row) => total + Number(row[key] || 0), 0);
const groupBy = (arr, key) => arr.reduce((map, row) => {
  const value = row[key];
  if (!map[value]) map[value] = [];
  map[value].push(row);
  return map;
}, {});
const unique = key => [...new Set(DATA.map(row => row[key]))];

const filters = {
  region: $('filterRegion'),
  producto: $('filterProducto'),
  canal: $('filterCanal')
};

function fillSelect(select, values) {
  values.sort().forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

fillSelect(filters.region, unique('region'));
fillSelect(filters.producto, unique('producto'));
fillSelect(filters.canal, unique('canal'));

function filteredData() {
  return DATA.filter(row =>
    (filters.region.value === 'Todas' || row.region === filters.region.value) &&
    (filters.producto.value === 'Todos' || row.producto === filters.producto.value) &&
    (filters.canal.value === 'Todos' || row.canal === filters.canal.value)
  );
}

const commonPlugins = {
  legend: {
    labels: {
      usePointStyle: true,
      pointStyle: 'circle',
      boxWidth: 8,
      boxHeight: 8,
      padding: 15
    }
  },
  tooltip: {
    backgroundColor: '#29253d',
    titleFont: {size: 11},
    bodyFont: {size: 10},
    padding: 10,
    cornerRadius: 8
  }
};

const charts = {};

function makeCharts() {
  charts.tendencia = new Chart($('chartTendencia'), {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Ingresos', data: [], borderColor: COLORS.purple,
          backgroundColor: COLORS.purpleSoft, fill: true, tension: .35,
          borderWidth: 2.4, pointRadius: 3, pointHoverRadius: 5
        },
        {
          label: 'Ganancia', data: [], borderColor: COLORS.green,
          backgroundColor: COLORS.greenSoft, fill: true, tension: .35,
          borderWidth: 2.4, pointRadius: 3, pointHoverRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {mode: 'index', intersect: false},
      plugins: {
        ...commonPlugins,
        legend: {...commonPlugins.legend, position: 'top', align: 'end'},
        tooltip: {...commonPlugins.tooltip, callbacks: {label: c => `${c.dataset.label}: ${fmtMoney(c.raw)}`}}
      },
      scales: {
        x: {grid: {display: false}},
        y: {beginAtZero: true, grid: {color: COLORS.grid}, ticks: {callback: v => '$' + Math.round(v / 1000) + 'k'}}
      }
    }
  });

  charts.region = new Chart($('chartRegion'), {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {label: 'Ingresos', data: [], backgroundColor: COLORS.purple, borderRadius: 5, maxBarThickness: 30},
        {label: 'Ganancia', data: [], backgroundColor: COLORS.green, borderRadius: 5, maxBarThickness: 30}
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        ...commonPlugins,
        legend: {...commonPlugins.legend, position: 'top', align: 'end'},
        tooltip: {...commonPlugins.tooltip, callbacks: {label: c => `${c.dataset.label}: ${fmtMoney(c.raw)}`}}
      },
      scales: {
        x: {grid: {display: false}},
        y: {beginAtZero: true, grid: {color: COLORS.grid}, ticks: {callback: v => '$' + Math.round(v / 1000) + 'k'}}
      }
    }
  });

  charts.producto = new Chart($('chartProducto'), {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [COLORS.purple, COLORS.green, COLORS.orange, COLORS.blue, COLORS.red],
        borderColor: '#fff', borderWidth: 4, hoverOffset: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        ...commonPlugins,
        legend: {...commonPlugins.legend, position: 'bottom'},
        tooltip: {...commonPlugins.tooltip, callbacks: {label: c => `${c.label}: ${fmtMoney(c.raw)}`}}
      }
    }
  });

  charts.canal = new Chart($('chartCanal'), {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{label: 'Ingresos', data: [], backgroundColor: [COLORS.green, COLORS.orange, COLORS.blue], borderRadius: 6, maxBarThickness: 38}]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        ...commonPlugins,
        legend: {display: false},
        tooltip: {...commonPlugins.tooltip, callbacks: {label: c => `Ingresos: ${fmtMoney(c.raw)}`}}
      },
      scales: {
        x: {beginAtZero: true, grid: {color: COLORS.grid}, ticks: {callback: v => '$' + Math.round(v / 1000) + 'k'}},
        y: {grid: {display: false}}
      }
    }
  });

  charts.scatter = new Chart($('chartScatter'), {
    type: 'scatter',
    data: {datasets: []},
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        ...commonPlugins,
        legend: {...commonPlugins.legend, position: 'top', align: 'end'},
        tooltip: {
          ...commonPlugins.tooltip,
          callbacks: {
            label: c => `${c.raw.producto} · ${c.raw.region}`,
            afterLabel: c => `Unidades: ${c.raw.x} · Margen: ${c.raw.y.toFixed(1)}%`
          }
        }
      },
      scales: {
        x: {beginAtZero: true, title: {display: true, text: 'Unidades vendidas'}, grid: {color: COLORS.grid}},
        y: {beginAtZero: true, title: {display: true, text: 'Margen %'}, grid: {color: COLORS.grid}}
      }
    }
  });
}

function updateKpis(rows) {
  const ingreso = sum(rows, 'ingreso');
  const ganancia = sum(rows, 'ganancia');
  const unidades = sum(rows, 'unidades');
  const margen = ingreso ? ganancia / ingreso * 100 : 0;
  const ticket = rows.length ? ingreso / rows.length : 0;

  const byRegion = groupBy(rows, 'region');
  const regionRanking = Object.keys(byRegion)
    .map(region => ({region, ingreso: sum(byRegion[region], 'ingreso')}))
    .sort((a, b) => b.ingreso - a.ingreso);
  const bestRegion = regionRanking[0];

  $('statIngreso').textContent = fmtMoney(ingreso);
  $('statGanancia').textContent = fmtMoney(ganancia);
  $('statMargen').textContent = `Margen ${margen.toFixed(1)}%`;
  $('statUnidades').textContent = fmtNumber(unidades);
  $('statTicket').textContent = `Ticket promedio ${fmtMoney(ticket)}`;
  $('statTransacciones').textContent = `${rows.length} transacciones`;
  $('statRegion').textContent = bestRegion ? bestRegion.region : '—';
  $('statRegionValue').textContent = bestRegion ? `${fmtMoney(bestRegion.ingreso)} en ingresos` : 'Sin datos';

  const byProduct = groupBy(rows, 'producto');
  const productRanking = Object.keys(byProduct)
    .map(producto => ({producto, ingreso: sum(byProduct[producto], 'ingreso')}))
    .sort((a, b) => b.ingreso - a.ingreso);
  const bestProduct = productRanking[0];
  const avgUnits = rows.length ? unidades / rows.length : 0;

  if (!rows.length) {
    $('executiveInsight').textContent = 'No hay registros que coincidan con los filtros seleccionados.';
  } else {
    $('executiveInsight').textContent = `${bestRegion.region} lidera los ingresos con ${fmtMoney(bestRegion.ingreso)}. ${bestProduct.producto} es el producto con mayor facturación. El margen global es de ${margen.toFixed(1)}% y se venden en promedio ${avgUnits.toFixed(1)} unidades por transacción.`;
  }
}

function updateCharts(rows) {
  const months = [...new Set(rows.map(d => d.fecha.slice(0, 7)))].sort();
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const monthLabel = m => {
    const [year, month] = m.split('-');
    return `${monthNames[Number(month) - 1]} ${year.slice(2)}`;
  };

  charts.tendencia.data.labels = months.map(monthLabel);
  charts.tendencia.data.datasets[0].data = months.map(m => sum(rows.filter(d => d.fecha.startsWith(m)), 'ingreso'));
  charts.tendencia.data.datasets[1].data = months.map(m => sum(rows.filter(d => d.fecha.startsWith(m)), 'ganancia'));
  charts.tendencia.update();

  const regions = [...new Set(rows.map(d => d.region))];
  const byRegion = groupBy(rows, 'region');
  charts.region.data.labels = regions;
  charts.region.data.datasets[0].data = regions.map(r => sum(byRegion[r] || [], 'ingreso'));
  charts.region.data.datasets[1].data = regions.map(r => sum(byRegion[r] || [], 'ganancia'));
  charts.region.update();

  const products = [...new Set(rows.map(d => d.producto))];
  const byProduct = groupBy(rows, 'producto');
  charts.producto.data.labels = products;
  charts.producto.data.datasets[0].data = products.map(p => sum(byProduct[p] || [], 'ingreso'));
  charts.producto.update();

  const channels = [...new Set(rows.map(d => d.canal))];
  const byChannel = groupBy(rows, 'canal');
  charts.canal.data.labels = channels;
  charts.canal.data.datasets[0].data = channels.map(c => sum(byChannel[c] || [], 'ingreso'));
  charts.canal.update();

  const palette = {'En línea': COLORS.green, 'Presencial': COLORS.orange};
  charts.scatter.data.datasets = channels.map(c => ({
    label: c,
    data: rows.filter(d => d.canal === c).map(d => ({
      x: Number(d.unidades),
      y: d.ingreso ? d.ganancia / d.ingreso * 100 : 0,
      producto: d.producto,
      region: d.region
    })),
    backgroundColor: palette[c] || COLORS.blue,
    borderColor: '#fff',
    borderWidth: 1.2,
    pointRadius: 6,
    pointHoverRadius: 8
  }));
  charts.scatter.update();
}

function renderTable(rows) {
  const tbody = $('dataTableBody');
  tbody.innerHTML = '';
  $('recordCount').textContent = `${rows.length} registros`;

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="10" class="empty-state">No hay datos para mostrar con estos filtros.</td></tr>';
    return;
  }

  rows.forEach(d => {
    const [year, month, day] = d.fecha.split('-');
    const margin = d.ingreso ? d.ganancia / d.ingreso * 100 : 0;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${day}/${month}/${year}</td>
      <td>${d.region}</td>
      <td>${d.producto}</td>
      <td><span class="pill ${d.canal === 'En línea' ? 'online' : 'presencial'}">${d.canal}</span></td>
      <td class="num">${fmtNumber(d.unidades)}</td>
      <td class="num">${fmtMoney2(d.precio)}</td>
      <td class="num">${fmtMoney2(d.ingreso)}</td>
      <td class="num">${fmtMoney2(d.costo)}</td>
      <td class="num">${fmtMoney2(d.ganancia)}</td>
      <td class="num">${margin.toFixed(1)}%</td>`;
    tbody.appendChild(tr);
  });
}

function refreshDashboard() {
  const rows = filteredData();
  updateKpis(rows);
  updateCharts(rows);
  renderTable(rows);
}

makeCharts();
refreshDashboard();

Object.values(filters).forEach(select => select.addEventListener('change', refreshDashboard));
$('resetFilters').addEventListener('click', () => {
  filters.region.value = 'Todas';
  filters.producto.value = 'Todos';
  filters.canal.value = 'Todos';
  refreshDashboard();
});
