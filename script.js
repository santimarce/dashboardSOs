const OPERATING_SYSTEMS = [
  {
    key: 'windows',
    label: 'Windows',
    description: 'Principal sistema operativo de escritorio a lo largo de las dos últimas décadas.',
    color: '#274690',
  },
  {
    key: 'macos',
    label: 'macOS',
    description: 'Ecosistema de Apple con crecimiento constante entre usuarios creativos y profesionales.',
    color: '#0091d5',
  },
  {
    key: 'linux',
    label: 'Linux',
    description: 'Distribuciones basadas en software libre utilizadas en entornos técnicos y servidores.',
    color: '#38b000',
  },
];

const MARKET_SHARE = [
  { year: 2001, windows: 92, macos: 6, linux: 2 },
  { year: 2002, windows: 91, macos: 6, linux: 3 },
  { year: 2003, windows: 90, macos: 6, linux: 4 },
  { year: 2004, windows: 89, macos: 7, linux: 4 },
  { year: 2005, windows: 88, macos: 8, linux: 4 },
  { year: 2006, windows: 87, macos: 9, linux: 4 },
  { year: 2007, windows: 86, macos: 10, linux: 4 },
  { year: 2008, windows: 84, macos: 11, linux: 5 },
  { year: 2009, windows: 83, macos: 12, linux: 5 },
  { year: 2010, windows: 82, macos: 13, linux: 5 },
  { year: 2011, windows: 81, macos: 14, linux: 5 },
  { year: 2012, windows: 80, macos: 15, linux: 5 },
  { year: 2013, windows: 79, macos: 16, linux: 5 },
  { year: 2014, windows: 78, macos: 17, linux: 5 },
  { year: 2015, windows: 77, macos: 18, linux: 5 },
  { year: 2016, windows: 76, macos: 18, linux: 6 },
  { year: 2017, windows: 75, macos: 19, linux: 6 },
  { year: 2018, windows: 74, macos: 20, linux: 6 },
  { year: 2019, windows: 73, macos: 20, linux: 7 },
  { year: 2020, windows: 72, macos: 21, linux: 7 },
  { year: 2021, windows: 71, macos: 22, linux: 7 },
  { year: 2022, windows: 70, macos: 23, linux: 7 },
  { year: 2023, windows: 69, macos: 24, linux: 7 },
  { year: 2024, windows: 68, macos: 24, linux: 8 },
];

const selectionForm = document.getElementById('os-selection');
const ctx = document.getElementById('os-chart');

let chartInstance = null;

function buildSelectionControls() {
  const fragment = document.createDocumentFragment();

  OPERATING_SYSTEMS.forEach(({ key, label, description }) => {
    const wrapper = document.createElement('label');
    wrapper.className = 'os-option';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'operating-system';
    checkbox.value = key;
    checkbox.checked = true;
    checkbox.setAttribute('aria-label', label);

    const content = document.createElement('div');
    const title = document.createElement('span');
    title.className = 'os-title';
    title.textContent = label;

    const subtitle = document.createElement('span');
    subtitle.className = 'os-description';
    subtitle.textContent = description;

    content.append(title, subtitle);
    wrapper.append(checkbox, content);
    fragment.append(wrapper);
  });

  selectionForm.append(fragment);
}

function getSelectedKeys() {
  const checkedInputs = selectionForm.querySelectorAll('input[type="checkbox"]:checked');
  return Array.from(checkedInputs).map((input) => input.value);
}

function buildDatasets(selectedKeys) {
  return selectedKeys.map((key) => {
    const osDefinition = OPERATING_SYSTEMS.find((os) => os.key === key);

    return {
      label: osDefinition.label,
      data: MARKET_SHARE.map((row) => row[key]),
      borderColor: osDefinition.color,
      backgroundColor: `${osDefinition.color}33`,
      tension: 0.35,
      fill: false,
      borderWidth: 3,
      pointRadius: 3,
    };
  });
}

function updateChart() {
  const selectedKeys = getSelectedKeys();

  if (selectedKeys.length === 0) {
    // Evita quedar sin selección reactivando la última opción interactuada
    const lastCheckbox = selectionForm.querySelector('input[type="checkbox"]:not(:checked)');
    if (lastCheckbox) {
      lastCheckbox.checked = true;
    }
    return updateChart();
  }

  if (chartInstance) {
    chartInstance.data.datasets = buildDatasets(selectedKeys);
    chartInstance.update();
  }
}

function initChart() {
  const years = MARKET_SHARE.map((row) => row.year);

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: buildDatasets(getSelectedKeys()),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (value) => `${value}%`,
          },
          title: {
            display: true,
            text: 'Porcentaje de usuarios',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Año',
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.formattedValue}%`,
          },
        },
      },
    },
  });
}

function setupInteractions() {
  selectionForm.addEventListener('change', (event) => {
    const selectedKeys = getSelectedKeys();

    if (!event.target.checked && selectedKeys.length === 0) {
      event.target.checked = true;
      return;
    }

    updateChart();
  });
}

buildSelectionControls();
setupInteractions();
initChart();
