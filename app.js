(() => {
  const data = window.dashboardData;
  const root = document.getElementById('dashboard-root');
  const money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  const byId = (id) => document.getElementById(id);
  const totalMissed = data.missedVisits.reduce((sum, item) => sum + item.count, 0);
  const maxProviderVisits = Math.max(...data.providerProductivity.map((item) => item.visits));

  byId('company-name').textContent = data.companyName;
  byId('dashboard-title').textContent = data.dashboardTitle;
  byId('period-label').textContent = data.periodLabel;
  byId('snapshot-label').textContent = data.snapshotLabel;

  function kpiCards() {
    return data.kpis
      .map(
        (kpi) => `
          <article class='panel kpi-card' style='--accent:${kpi.accent};--progress:${kpi.progress}%'>
            <div class='kpi-copy'>
              <p class='panel-label'>${kpi.label}</p>
              <strong class='kpi-value'>${kpi.value}</strong>
              <span class='kpi-summary'>${kpi.summary}</span>
              <span class='kpi-detail'>${kpi.detail}</span>
            </div>
            <div class='metric-ring' aria-label='${kpi.label}: ${kpi.progress}%'>
              <span>${kpi.progress}%</span>
            </div>
            <div class='kpi-footnote'>${kpi.footnote}</div>
          </article>`
      )
      .join('');
  }

  function trendChart() {
    const values = data.visitsOverTime.map((item) => item.visits);
    const max = Math.max(...values, 20);
    const min = Math.min(...values, 0);
    const left = 52;
    const right = 20;
    const top = 26;
    const bottom = 52;
    const width = 640 - left - right;
    const height = 300 - top - bottom;
    const points = data.visitsOverTime.map((item, index) => {
      const x = left + (width / (data.visitsOverTime.length - 1)) * index;
      const y = top + height - ((item.visits - min) / (max - min)) * height;
      return { ...item, x, y };
    });
    const linePath = points.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ');
    const areaPath = `M ${points[0].x} ${top + height} ${points
      .map((point) => `L ${point.x} ${point.y}`)
      .join(' ')} L ${points.at(-1).x} ${top + height} Z`;
    const grid = [0, 1, 2, 3]
      .map((index) => {
        const y = top + (height / 3) * index;
        return `<line class='chart-gridline' x1='${left}' x2='${640 - right}' y1='${y}' y2='${y}' />`;
      })
      .join('');
    const dots = points
      .map(
        (point) => `
          <circle class='chart-dot' cx='${point.x}' cy='${point.y}' r='6' />
          <text class='chart-value' x='${point.x}' y='${point.y - 14}'>${point.visits}</text>
          <text class='chart-label' x='${point.x}' y='278'>${point.date.replace('May ', '5/')}</text>`
      )
      .join('');

    return `
      <svg class='line-chart' viewBox='0 0 640 300' role='img' aria-label='Visits over time from May 12 to May 18'>
        ${grid}
        <path class='chart-area' d='${areaPath}' />
        <path class='chart-line' d='${linePath}' />
        ${dots}
      </svg>`;
  }

  function providerBars() {
    return data.providerProductivity
      .map(
        (item) => `
          <div class='bar-row' style='--accent:${item.accent};--bar-width:${(item.visits / maxProviderVisits) * 100}%'>
            <div class='bar-meta'>
              <span>${item.provider}</span>
              <strong>${item.visits} visits</strong>
            </div>
            <div class='bar-track'><span></span></div>
          </div>`
      )
      .join('');
  }

  function missedVisitDonut() {
    let start = 0;
    const stops = data.missedVisits.map((item) => {
      const end = start + (item.count / totalMissed) * 100;
      const stop = `${item.accent} ${start}% ${end}%`;
      start = end;
      return stop;
    });
    const legend = data.missedVisits
      .map(
        (item) => `
          <div class='legend-row'>
            <span style='--accent:${item.accent}'>${item.reason}</span>
            <strong>${item.count}</strong>
          </div>`
      )
      .join('');

    return `
      <div class='donut-layout'>
        <div class='donut-chart' style='background:conic-gradient(${stops.join(', ')})'>
          <strong>${totalMissed}</strong>
          <span>Missed</span>
        </div>
        <div class='donut-legend'>${legend}</div>
      </div>`;
  }

  function insights(items, className) {
    return items
      .map((item) => {
        const level = item.level ? `<span class='alert-level ${item.level.toLowerCase()}'>${item.level}</span>` : '';
        return `
          <article class='${className}'>
            ${level}
            <h3>${item.title}</h3>
            <p>${item.body}</p>
          </article>`;
      })
      .join('');
  }

  root.innerHTML = `
    <section class='kpi-grid' aria-label='Daily KPI cards'>${kpiCards()}</section>

    <section class='detail-grid'>
      <section class='panel visits-detail' aria-labelledby='visits-detail-title'>
        <div class='panel-heading'>
          <div>
            <p class='panel-label'>Visits Completed Detail</p>
            <h2 id='visits-detail-title'>${data.visitsCompletedDetail.completed} of ${data.visitsCompletedDetail.goal} Completed</h2>
          </div>
          <span class='status-pill'>${data.visitsCompletedDetail.progress}% Goal</span>
        </div>
        <div class='visits-detail-body'>
          <div class='detail-ring' style='--progress:${data.visitsCompletedDetail.progress}%'>
            <strong>${data.visitsCompletedDetail.progress}%</strong>
            <span>Daily Goal</span>
          </div>
          <div class='detail-stats'>
            <div><span>Scheduled</span><strong>${data.visitsCompletedDetail.scheduled}</strong></div>
            <div><span>Remaining</span><strong>${data.visitsCompletedDetail.remaining}</strong></div>
            <div><span>Completion</span><strong>${data.visitsCompletedDetail.completionRate}</strong></div>
            <p>${data.visitsCompletedDetail.routeNote}</p>
          </div>
        </div>
      </section>

      <section class='panel chart-panel' aria-labelledby='trend-title'>
        <div class='panel-heading'>
          <div>
            <p class='panel-label'>Visits Over Time</p>
            <h2 id='trend-title'>${data.periodLabel}</h2>
          </div>
          <span class='status-pill alt'>Weekly Trend</span>
        </div>
        ${trendChart()}
      </section>
    </section>

    <section class='operations-grid'>
      <section class='panel provider-panel' aria-labelledby='provider-title'>
        <p class='panel-label'>By Provider</p>
        <h2 id='provider-title'>Provider Productivity</h2>
        <div class='bar-list'>${providerBars()}</div>
      </section>

      <section class='panel missed-panel' aria-labelledby='missed-title'>
        <p class='panel-label'>Missed Visits</p>
        <h2 id='missed-title'>${totalMissed} Total</h2>
        ${missedVisitDonut()}
      </section>

      <section class='panel revenue-panel' aria-labelledby='revenue-title'>
        <p class='panel-label'>Missed Revenue Opportunity</p>
        <h2 id='revenue-title'>${money.format(data.missedRevenue.total)}</h2>
        <p>${data.missedRevenue.label} = ${money.format(data.missedRevenue.total)}</p>
        <div class='revenue-metrics'>
          <div><span>Missed Visits</span><strong>${data.missedRevenue.missedVisits}</strong></div>
          <div><span>Per Visit</span><strong>${money.format(data.missedRevenue.reimbursementPerVisit)}</strong></div>
        </div>
      </section>
    </section>

    <section class='insight-grid'>
      <section class='panel insights-panel' aria-labelledby='insights-title'>
        <p class='panel-label'>Insights</p>
        <h2 id='insights-title'>Care and Revenue Signals</h2>
        <div class='text-list'>${insights(data.insights, 'insight-item')}</div>
      </section>
      <section class='panel alerts-panel' aria-labelledby='alerts-title'>
        <p class='panel-label'>Recent Alerts</p>
        <h2 id='alerts-title'>Needs Attention</h2>
        <div class='text-list'>${insights(data.alerts, 'alert-item')}</div>
      </section>
    </section>`;
})();
