(() => {
  const baseData = window.dashboardData;
  const data = baseData.ownerDashboard;
  const root = document.getElementById('dashboard-root');
  const accessKey = 'smpOwnerAccess';
  let officeMarkup = root.innerHTML;
  let activeFilter = 'all';

  function isUnlocked() {
    try {
      return window.sessionStorage.getItem(accessKey) === 'true';
    } catch (error) {
      return false;
    }
  }

  function setUnlocked(value) {
    try {
      if (value) {
        window.sessionStorage.setItem(accessKey, 'true');
      } else {
        window.sessionStorage.removeItem(accessKey);
      }
    } catch (error) {
      return;
    }
  }

  function addOwnerButton() {
    const actions = document.querySelector('.overview-top .executive-actions') || document.querySelector('.overview-top');
    if (!actions || actions.querySelector('[data-owner-route="open"]')) return;
    const button = document.createElement('button');
    button.className = 'view-button owner-access-button';
    button.type = 'button';
    button.dataset.ownerRoute = 'open';
    button.textContent = data.accessLabel;
    actions.appendChild(button);
  }

  function searchItems() {
    const providers = data.providers.map((provider) => ({
      type: 'Provider',
      title: provider.name,
      meta: `${provider.route} - ${provider.status}`,
      value: `${provider.score} score, ${provider.missed} missed`
    }));
    const tasks = data.tasks.map((task) => ({
      type: 'Task',
      title: task.task,
      meta: `${task.owner} - ${task.status} - ${task.due}`,
      value: `${task.priority} priority`
    }));
    const followUps = data.followUps.map((item) => ({
      type: 'Missed Visit',
      title: `${item.patient} - ${item.reason}`,
      meta: `${item.provider} - ${item.facility} - ${item.owner}`,
      value: `${item.status}, ${item.value}`
    }));
    const reviews = data.reviews.map((item) => ({
      type: 'Review',
      title: item.title,
      meta: item.detail,
      value: item.action
    }));
    return [...providers, ...tasks, ...followUps, ...reviews];
  }

  function renderSearch(filter = activeFilter) {
    activeFilter = filter;
    const input = document.getElementById('executive-search');
    const results = document.getElementById('executive-search-results');
    if (!input || !results) return;
    const query = input.value.trim().toLowerCase();
    if (!query && filter === 'all') {
      results.innerHTML = `
        <article class='search-empty'>
          <span>Search Ready</span>
          <strong>Find providers, office manager tasks, missed visits, facilities, or owner reviews.</strong>
          <p>Try NP Brown, scheduling errors, South Plant, patient refusals, or overdue.</p>
        </article>`;
      return;
    }
    const rows = searchItems()
      .filter((item) => {
        const type = item.type.toLowerCase().replace(' ', '-');
        const haystack = `${item.type} ${item.title} ${item.meta} ${item.value}`.toLowerCase();
        return (filter === 'all' || type === filter) && (!query || haystack.includes(query));
      })
      .slice(0, 8);
    results.innerHTML = rows.length
      ? rows.map((item) => `
          <article>
            <span>${item.type}</span>
            <strong>${item.title}</strong>
            <p>${item.meta}</p>
            <em>${item.value}</em>
          </article>`).join('')
      : `<article class='search-empty'><span>No Matches</span><strong>Try a provider, facility, task, or status.</strong></article>`;
  }

  function gateView() {
    root.innerHTML = `
      <div class='reference-shell executive-shell'>
        <header class='overview-top executive-top'>
          <h1>${data.accessLabel}</h1>
          <button class='view-button' type='button' data-owner-route='office'>Office Manager Dashboard</button>
        </header>
        <section class='owner-gate panel-soft'>
          <span class='status-chip'>Owner Only</span>
          <h2>${data.title}</h2>
          <p>${data.subtitle}</p>
          <label><span>Access Code</span><input id='owner-code' type='password' autocomplete='off' placeholder='Enter owner code' /></label>
          <button type='button' data-owner-route='unlock'>Unlock Executive View</button>
          <p class='owner-error' id='owner-error' hidden>Access code did not match.</p>
        </section>
      </div>`;
  }

  function executiveView() {
    root.innerHTML = `
      <div class='reference-shell executive-shell'>
        <header class='overview-top executive-top'>
          <div><h1>${data.title}</h1><p>${data.subtitle}</p></div>
          <div class='executive-actions'>
            <button class='view-button' type='button' data-owner-route='office'>Office Manager Dashboard</button>
            <button class='view-button' type='button' data-owner-route='lock'>Lock Owner View</button>
          </div>
        </header>
        <section class='executive-search panel-soft'>
          <label><span>Search providers, tasks, missed visits, facilities, or alerts</span><input id='executive-search' type='search' placeholder='Search NP Brown, scheduling errors, South Plant...' /></label>
          <div class='search-filters'>
            <button class='active' data-owner-filter='all'>All</button>
            <button data-owner-filter='provider'>Providers</button>
            <button data-owner-filter='task'>Tasks</button>
            <button data-owner-filter='missed-visit'>Missed Visits</button>
            <button data-owner-filter='review'>Reviews</button>
          </div>
          <div class='search-results' id='executive-search-results'></div>
        </section>
        <section class='executive-kpis'>${data.kpis.map((item) => `<article class='exec-kpi panel-soft ${item.tone}'><span>${item.label}</span><strong>${item.value}</strong><small>${item.detail}</small></article>`).join('')}</section>
        <section class='executive-grid'>
          <section class='exec-panel panel-soft'>
            <div class='exec-panel-head'><div><h2>Needs My Review</h2><p>Only the items that need owner attention.</p></div><span class='status-chip'>3 Items</span></div>
            <div class='review-list'>${data.reviews.map((item) => `<article><div><strong>${item.title}</strong><p>${item.detail}</p></div><button>${item.action}</button></article>`).join('')}</div>
          </section>
          <section class='exec-panel panel-soft'>
            <div class='exec-panel-head'><div><h2>Office Manager Control</h2><p>${data.manager.note}</p></div><span class='status-chip'>Score ${data.manager.score}</span></div>
            <div class='manager-stats'>
              <div><strong>${data.manager.resolvedToday}</strong><span>Resolved Today</span></div>
              <div><strong>${data.manager.openItems}</strong><span>Open Items</span></div>
              <div><strong>${data.manager.overdueItems}</strong><span>Overdue</span></div>
              <div><strong>${data.manager.averageResolution}</strong><span>Avg Resolution</span></div>
            </div>
            <div class='task-list'>${data.tasks.map((task) => `<article><div><strong>${task.task}</strong><p>${task.owner} - ${task.status} - ${task.due}</p></div><span class='priority ${task.priority.toLowerCase()}'>${task.priority}</span><em>${task.count}</em></article>`).join('')}</div>
          </section>
        </section>
        <section class='exec-panel panel-soft'>
          <div class='exec-panel-head'><div><h2>Provider Scorecards</h2><p>Weekly productivity, missed visits, revenue, documentation, and coaching flags.</p></div><span class='status-chip'>4 Providers</span></div>
          <div class='provider-score-grid'>${data.providers.map((provider) => `<article class='provider-card'><div><h3>${provider.name}</h3><p>${provider.route}</p></div><div class='provider-score'><strong>${provider.score}</strong><span>score</span></div><dl><div><dt>Visits</dt><dd>${provider.visits}/${provider.scheduled}</dd></div><div><dt>Missed</dt><dd>${provider.missed}</dd></div><div><dt>Revenue</dt><dd>${provider.revenue}</dd></div><div><dt>Docs</dt><dd>${provider.docs}</dd></div></dl><footer><span class='status-chip'>${provider.status}</span><em>${provider.trend}</em></footer></article>`).join('')}</div>
        </section>
        <section class='executive-grid lower'>
          <section class='exec-panel panel-soft'>
            <div class='exec-panel-head'><div><h2>Missed Visit Follow-Up Tracker</h2><p>Owner, reason, next action, due date, and revenue impact.</p></div><span class='status-chip'>Live Queue</span></div>
            <div class='follow-table'>${data.followUps.map((item) => `<article><span>${item.patient}<small>${item.facility}</small></span><span>${item.provider}<small>${item.owner}</small></span><span>${item.reason}</span><span>${item.status}</span><span>${item.due}</span><strong>${item.value}</strong></article>`).join('')}</div>
          </section>
          <section class='exec-panel panel-soft'>
            <div class='exec-panel-head'><div><h2>Daily Accountability</h2><p>Who is on pace, who needs help, and where to follow up.</p></div></div>
            <div class='accountability-list'>${data.providers.map((provider) => `<article><strong>${provider.name}</strong><span>${provider.visits} completed</span><span>${provider.missed} missed</span><span>${provider.docs}</span><em>${provider.trend}</em></article>`).join('')}</div>
          </section>
        </section>
      </div>`;
    renderSearch();
  }

  function route() {
    if (window.location.hash === '#executive') {
      if (isUnlocked()) executiveView();
      else gateView();
    } else {
      root.innerHTML = officeMarkup;
      addOwnerButton();
    }
  }

  document.addEventListener('click', (event) => {
    const routeButton = event.target.closest('[data-owner-route]');
    if (routeButton) {
      const routeName = routeButton.dataset.ownerRoute;
      if (routeName === 'open') window.location.hash = 'executive';
      if (routeName === 'office') window.location.hash = '';
      if (routeName === 'lock') {
        setUnlocked(false);
        route();
      }
      if (routeName === 'unlock') {
        const input = document.getElementById('owner-code');
        const error = document.getElementById('owner-error');
        if (input && input.value.trim() === data.accessCode) {
          setUnlocked(true);
          executiveView();
        } else if (error) {
          error.hidden = false;
        }
      }
    }

    const filterButton = event.target.closest('[data-owner-filter]');
    if (filterButton) {
      document.querySelectorAll('[data-owner-filter]').forEach((button) => button.classList.remove('active'));
      filterButton.classList.add('active');
      renderSearch(filterButton.dataset.ownerFilter);
    }
  });

  document.addEventListener('input', (event) => {
    if (event.target.id === 'executive-search') renderSearch(activeFilter);
  });

  window.addEventListener('hashchange', route);
  route();
})();
