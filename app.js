(() => {
  const data = window.dashboardData;
  const root = document.getElementById('dashboard-root');
  const money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  document.getElementById('company-name').textContent = 'Overview';
  document.getElementById('dashboard-title').textContent = data.dashboardTitle;
  document.getElementById('period-label').textContent = data.periodLabel;
  document.getElementById('snapshot-label').textContent = data.companyName;

  function energyBolts() {
    return `
      <svg class='energy-bolts' viewBox='0 0 360 170' aria-hidden='true'>
        <path d='M0 95 C35 80 54 110 91 75 S153 59 192 90 254 120 294 76 333 71 360 58' />
        <path d='M22 105 L61 84 L76 92 L115 60 L108 88 L148 69 L166 83 L211 52 L196 80 L239 69 L262 90 L308 66 L360 70' />
        <path d='M8 124 C44 120 70 101 98 110 C133 120 157 93 190 102 C224 112 245 98 279 92 C306 87 331 94 360 82' />
        <path d='M78 86 L101 52 L95 82 L130 56' />
        <path d='M232 84 L258 45 L250 78 L291 51' />
        <circle cx='52' cy='91' r='1.8' />
        <circle cx='145' cy='63' r='1.3' />
        <circle cx='283' cy='72' r='1.7' />
      </svg>
      <span class='energy-haze'></span>`;
  }

  function metricRing(card, sizeClass = '') {
    return `
      <div class='ring-stage ${card.lightning}' style='--accent:${card.accent};--accent-soft:${card.accentSoft};--accent-deep:${card.accentDeep || card.accentSoft};--progress:${card.progress}%'>
        ${energyBolts()}
        <div class='metric-ring ${sizeClass}'>
          <div class='ring-core'>
            <strong>${card.ringValue}</strong>
            <span>${card.ringLabel}</span>
          </div>
        </div>
      </div>`;
  }

  function topCards() {
    return data.kpis
      .map(
        (card) => `
          <article class='metric-card panel-soft'>
            <div class='metric-card-head'>
              <h2>${card.label}</h2>
              <span class='live-pill'>Live</span>
            </div>
            <strong class='metric-main' style='color:${card.accent}'>${card.value}</strong>
            ${metricRing(card)}
            <div class='metric-foot'>
              <span>${card.footerLabel}</span>
              <strong>${card.footerValue}</strong>
            </div>
          </article>`
      )
      .join('');
  }

  function chartPath(values, width, height, top, left, right, bottom) {
    const max = Math.max(...values, data.chartTarget) + 2;
    const min = Math.max(0, Math.min(...values) - 2);
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const points = values.map((value, index) => {
      const x = left + (plotWidth / (values.length - 1)) * index;
      const y = top + plotHeight - ((value - min) / (max - min)) * plotHeight;
      return { x, y };
    });
    return points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
      .join(' ');
  }

  function visitsChart() {
    const anchors = data.visitsOverTime.map((item) => item.visits);
    const smoothValues = [];
    for (let index = 0; index < anchors.length - 1; index += 1) {
      const start = anchors[index];
      const end = anchors[index + 1];
      for (let step = 0; step < 9; step += 1) {
        const t = step / 9;
        const wave = Math.sin((index * 9 + step) * 1.7) * 0.35;
        smoothValues.push(start + (end - start) * t + wave);
      }
    }
    smoothValues.push(anchors[anchors.length - 1]);

    const width = 780;
    const height = 250;
    const top = 26;
    const left = 54;
    const right = 32;
    const bottom = 42;
    const targetY = 96;
    const linePath = chartPath(smoothValues, width, height, top, left, right, bottom);

    return `
      <section class='chart-card panel-soft'>
        <div class='chart-head'>
          <h3>Visits Over Time</h3>
          <div class='chart-legend'>
            <span class='dash'></span> Target
            <span class='solid'></span> Actual Visits
          </div>
        </div>
        <svg class='line-chart' viewBox='0 0 ${width} ${height}' role='img' aria-label='Visits over time May 12 to May 18'>
          <g class='grid-lines'>
            <line x1='54' x2='748' y1='32' y2='32'></line>
            <line x1='54' x2='748' y1='82' y2='82'></line>
            <line x1='54' x2='748' y1='132' y2='132'></line>
            <line x1='54' x2='748' y1='182' y2='182'></line>
          </g>
          <line class='target-line' x1='54' x2='748' y1='${targetY}' y2='${targetY}'></line>
          <path class='actual-line' d='${linePath}'></path>
          <g class='axis-labels'>
            <text x='14' y='36'>24</text>
            <text x='14' y='86'>18</text>
            <text x='14' y='136'>12</text>
            <text x='14' y='186'>6</text>
            ${data.visitsOverTime
              .map((item, index) => {
                const x = 70 + index * 108;
                return `<text class='date' x='${x}' y='232'>${item.date}</text>`;
              })
              .join('')}
          </g>
        </svg>
      </section>`;
  }

  function sparkline() {
    return `
      <svg class='sparkline' viewBox='0 0 180 42' aria-hidden='true'>
        <path d='M0 15 L12 17 L24 13 L35 24 L48 22 L62 27 L76 22 L92 23 L105 18 L120 25 L134 21 L148 12 L162 24 L180 30'></path>
      </svg>`;
  }

  function detailPanel() {
    const selected = data.selectedMetric;
    return `
      <section class='detail-panel'>
        <div class='detail-toolbar'>
          <button class='back-button' aria-label='Back to overview'>&larr; <span>Back to overview</span></button>
          <div class='toolbar-actions'>
            <div class='time-tabs'>
              <button class='active'>7D</button><button>30D</button><button>3M</button><button>YTD</button><button>1Y</button>
            </div>
            <button class='icon-button' aria-label='Calendar'>&#9633;</button>
            <button class='filter-button'>&#9661; Filters</button>
          </div>
        </div>
        <div class='detail-grid-main'>
          <div class='detail-left'>
            <div class='detail-title-row'>
              <div>
                <h2>${selected.label}</h2>
                <p>${selected.subtitle}</p>
              </div>
              <span class='live-pill'>Live</span>
            </div>
            <strong class='detail-value'>${selected.value}</strong>
            <div class='detail-body'>
              ${metricRing(selected, 'large')}
              <div class='metric-stats'>
                ${selected.stats
                  .map((item) => {
                    if (item.value === 'sparkline') {
                      return `<div class='stat-row spark-row'><span>${item.label}</span>${sparkline()}</div>`;
                    }
                    return `<div class='stat-row ${item.tone || ''}'><span>${item.label}</span><strong>${item.value}</strong></div>`;
                  })
                  .join('')}
              </div>
            </div>
          </div>
          ${visitsChart()}
        </div>
        <div class='detail-bottom'>
          ${providerPanel()}
          ${missedPanel()}
          ${insightsPanel()}
          ${alertsPanel()}
        </div>
      </section>`;
  }

  function providerPanel() {
    const maxVisits = Math.max(...data.providerProductivity.map((item) => item.visits));
    return `
      <section class='mini-panel panel-soft'>
        <h3>By Provider</h3>
        <div class='provider-list'>
          ${data.providerProductivity
            .map(
              (item) => `
              <div class='provider-row'>
                <span>${item.provider}</span>
                <div class='mini-bar'><i style='width:${(item.visits / maxVisits) * 100}%'></i></div>
                <strong>${item.visits}</strong>
                <em>${item.percent}%</em>
              </div>`
            )
            .join('')}
        </div>
      </section>`;
  }

  function missedPanel() {
    const total = data.missedVisits.reduce((sum, item) => sum + item.count, 0);
    const revenue = money.format(data.missedRevenue.total);
    let cursor = 0;
    const stops = data.missedVisits.map((item, index) => {
      const colors = ['#f05243', '#c6453d', '#8e302e', '#5c2228'];
      const start = cursor;
      cursor += item.percent;
      return `${colors[index]} ${start}% ${cursor}%`;
    });
    return `
      <section class='mini-panel panel-soft'>
        <h3>Missed Visits</h3>
        <div class='donut-row'>
          <div class='mini-donut' style='background:conic-gradient(${stops.join(', ')})'><span>${total}</span></div>
          <div class='donut-list'>
            ${data.missedVisits
              .map((item) => `<p><span>${item.reason}</span><strong>${item.count}</strong></p>`)
              .join('')}
          </div>
        </div>
        <div class='missed-revenue'>
          <span>Missed Revenue Opportunity</span>
          <strong>${revenue}</strong>
          <small>${data.missedRevenue.label}</small>
        </div>
      </section>`;
  }

  function insightsPanel() {
    return `
      <section class='mini-panel panel-soft'>
        <h3>Insights</h3>
        <div class='insight-copy'>
          <span class='bulb'>&#9728;</span>
          <div>
            ${data.insights.map((item) => `<p>${item}</p>`).join('')}
          </div>
        </div>
        <a href='#'>View recommendations &rsaquo;</a>
      </section>`;
  }

  function alertsPanel() {
    return `
      <section class='mini-panel panel-soft'>
        <h3>Recent Alerts</h3>
        <div class='alert-list'>
          ${data.alerts
            .map(
              (alert) => `
              <article class='alert ${alert.level}'>
                <span>${alert.level === 'high' ? '&#9651;' : '&#8599;'}</span>
                <div><strong>${alert.title}</strong><p>${alert.time}</p></div>
              </article>`
            )
            .join('')}
        </div>
        <a href='#'>View all alerts &rsaquo;</a>
      </section>`;
  }

  function render() {
    root.innerHTML = `
      <div class='reference-shell'>
        <header class='overview-top'>
          <h1>Overview</h1>
          <button class='view-button' aria-label='View dashboard'>
            <span class='grid-icon'>&#9638;</span>${data.viewLabel}<span>&#8964;</span>
          </button>
        </header>
        <section class='metric-grid'>${topCards()}</section>
        <div class='scroll-cue'>&darr;</div>
        ${detailPanel()}
      </div>`;
  }

  render();
})();
