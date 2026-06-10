(() => {
  const baseData = window.dashboardData;
  const data = baseData.ownerDashboard;
  const routing = baseData.roleRouting;
  const root = document.getElementById('dashboard-root');
  const accessKey = 'smpOwnerAccess';
  let officeMarkup = root.innerHTML;
  let activeFilter = 'all';

  function normalizeRole(role) {
    return String(role || routing.defaultRole).trim().toLowerCase().replace(/\s+/g, '_');
  }

  function currentUser() {
    return window.SMP_AUTH_USER || baseData.currentUser || {};
  }

  function roleFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const role = params.get(routing.demoRoleParam);
    if (!role) return '';
    const normalized = normalizeRole(role);
    try {
      window.sessionStorage.setItem(routing.storageKey, normalized);
    } catch (error) {
      return normalized;
    }
    return normalized;
  }

  function currentRole() {
    const user = currentUser();
    try {
      return normalizeRole(roleFromQuery() || user.role || window.sessionStorage.getItem(routing.storageKey));
    } catch (error) {
      return normalizeRole(roleFromQuery() || user.role);
    }
  }

  function rolePermissions() {
    const user = currentUser();
    const configured = routing.roles[currentRole()];
    return new Set([...(configured ? configured.permissions : []), ...(user.permissions || [])]);
  }

  function canAccessExecutive() {
    return rolePermissions().has('executive_dashboard') || isUnlocked();
  }

  function defaultLanding() {
    const configured = routing.roles[currentRole()];
    return configured ? configured.landing : 'office';
  }

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
    if (!canAccessExecutive()) return;
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
    const codes = data.codeOpportunities.map((item) => ({
      type: 'Code',
      title: `${item.code} - ${item.title}`,
      meta: `${item.category} - ${item.trigger}`,
      value: item.status
    }));
    const revenue = data.revenue.opportunities.map((item) => ({
      type: 'Revenue',
      title: item.label,
      meta: item.detail,
      value: item.value
    }));
    return [...providers, ...tasks, ...followUps, ...reviews, ...revenue, ...codes];
  }

  function renderSearch(filter = activeFilter) {
    activeFilter = filter;
    const input = document.getElementById('executive-search');
    const results = document.getElementById('executive-search-results');
    if (!input || !results) return;
    const query = input.value.trim().toLowerCase();
    if (!query && filter === 'all') {
      results.hidden = true;
      results.innerHTML = '';
      return;
    }
    results.hidden = false;
    const rows = searchItems()
      .filter((item) => {
        const type = item.type.toLowerCase().replace(' ', '-');
        const haystack = `${item.type} ${item.title} ${item.meta} ${item.value}`.toLowerCase();
        return (filter === 'all' || type === filter) && (!query || haystack.includes(query));
      })
      .slice(0, 6);
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

  function executiveKpis() {
    return data.kpis
      .map((item) => `
        <article class='exec-kpi panel-soft ${item.tone}'>
          <span>${item.label}</span>
          <strong>${item.value}</strong>
          <small>${item.detail}</small>
        </article>`)
      .join('');
  }

  function ownerPriority() {
    return `
      <section class='owner-priority panel-soft'>
        <span class='status-chip'>Owner Focus</span>
        <h2>Start with the exceptions.</h2>
        <p>${data.kpis[0].value} providers need review, ${data.manager.overdueItems} office items are overdue, ${data.revenue.missedRecoverable} may be recoverable from missed visits, and ${data.revenue.addOnReview} is queued for billing review.</p>
        <div class='priority-strip'>
          <span>Review NP Brown</span>
          <span>Clear overdue follow-ups</span>
          <span>Check revenue exceptions</span>
        </div>
      </section>`;
  }

  function ownerSearch() {
    return `
      <section class='owner-search panel-soft'>
        <label>
          <span>Search</span>
          <input id='executive-search' type='search' placeholder='Provider, task, facility, status...' />
        </label>
        <div class='search-filters'>
          <button class='active' data-owner-filter='all'>All</button>
          <button data-owner-filter='provider'>Providers</button>
          <button data-owner-filter='task'>Tasks</button>
          <button data-owner-filter='missed-visit'>Missed</button>
          <button data-owner-filter='revenue'>Revenue</button>
          <button data-owner-filter='code'>Codes</button>
          <button data-owner-filter='review'>Reviews</button>
        </div>
        <div class='search-results' id='executive-search-results' hidden></div>
      </section>`;
  }

  function revenueCommand() {
    return `
      <section class='revenue-command'>
        <section class='exec-panel panel-soft revenue-panel'>
          <div class='exec-panel-head'>
            <div><h2>Revenue Command</h2><p>${data.revenue.period} view of money collected, held, and still recoverable.</p></div>
            <span class='status-chip'>${data.revenue.cleanClaimRate} Clean</span>
          </div>
          <div class='revenue-summary'>
            <article>
              <span>Collected</span>
              <strong>${data.revenue.collected}</strong>
              <p>Projected ${data.revenue.projected}</p>
            </article>
            <article>
              <span>Billing Holds</span>
              <strong>${data.revenue.billingHolds}</strong>
              <p>Documentation or coding review</p>
            </article>
          </div>
          <div class='revenue-opportunities'>
            ${data.revenue.opportunities.map((item) => `
              <article class='${item.tone}'>
                <div><strong>${item.label}</strong><p>${item.detail}</p></div>
                <span>${item.value}</span>
              </article>`).join('')}
          </div>
          <p class='revenue-note'>${data.revenue.note}</p>
        </section>
        <section class='exec-panel panel-soft code-panel'>
          <div class='exec-panel-head'>
            <div><h2>Add-On Code Review</h2><p>Suggestions for your biller to look into before anything is billed.</p></div>
            <span class='status-chip'>Review Only</span>
          </div>
          <div class='code-opportunity-list'>
            ${data.codeOpportunities.map((item) => `
              <article>
                <code>${item.code}</code>
                <div>
                  <strong>${item.title}</strong>
                  <p>${item.trigger}</p>
                  <small>${item.review}</small>
                </div>
                <span>${item.status}</span>
              </article>`).join('')}
          </div>
          <p class='compliance-note'>Use this as a billing-worklist prompt only. Your billing team should verify payer rules, medical necessity, documentation, scope, modifiers, and edit conflicts before billing.</p>
        </section>
      </section>`;
  }

  function focusPanel() {
    return `
      <section class='exec-panel panel-soft focus-panel'>
        <div class='exec-panel-head'>
          <div><h2>Needs My Review</h2><p>Three items worth your attention first.</p></div>
          <span class='status-chip'>Today</span>
        </div>
        <div class='focus-list'>
          ${data.reviews.map((item, index) => `
            <article>
              <span>${index + 1}</span>
              <div><strong>${item.title}</strong><p>${item.detail}</p></div>
              <button>${item.action}</button>
            </article>`).join('')}
        </div>
      </section>`;
  }

  function managerSnapshot() {
    return `
      <section class='exec-panel panel-soft manager-panel'>
        <div class='exec-panel-head'>
          <div><h2>Office Manager Snapshot</h2><p>Backlog, speed, and overdue work.</p></div>
          <span class='status-chip'>Score ${data.manager.score}</span>
        </div>
        <div class='manager-stats compact'>
          <div><strong>${data.manager.resolvedToday}</strong><span>Resolved Today</span></div>
          <div><strong>${data.manager.openItems}</strong><span>Open</span></div>
          <div><strong>${data.manager.overdueItems}</strong><span>Overdue</span></div>
          <div><strong>${data.manager.averageResolution}</strong><span>Avg Resolution</span></div>
        </div>
        <div class='task-summary'>
          ${data.tasks.slice(0, 3).map((task) => `
            <article>
              <div><strong>${task.task}</strong><p>${task.status} - ${task.due}</p></div>
              <span class='priority ${task.priority.toLowerCase()}'>${task.priority}</span>
            </article>`).join('')}
        </div>
      </section>`;
  }

  function providerWatchlist() {
    return `
      <section class='exec-panel panel-soft provider-watch-panel'>
        <div class='exec-panel-head'>
          <div><h2>Provider Watchlist</h2><p>Simple view of who is fine and who needs follow-up.</p></div>
          <span class='status-chip'>${data.providers.length} Providers</span>
        </div>
        <div class='provider-watchlist'>
          ${data.providers.map((provider) => `
            <article>
              <div>
                <strong>${provider.name}</strong>
                <p>${provider.route}</p>
              </div>
              <span class='provider-score-pill'>${provider.score}</span>
              <span>${provider.visits}/${provider.scheduled} visits</span>
              <span>${provider.missed} missed</span>
              <span>${provider.docs}</span>
              <em>${provider.status}</em>
            </article>`).join('')}
        </div>
      </section>`;
  }

  function followUpPanel() {
    return `
      <section class='exec-panel panel-soft follow-panel'>
        <div class='exec-panel-head'>
          <div><h2>Missed Visit Follow-Up</h2><p>Who owns the next action and when it is due.</p></div>
          <span class='status-chip'>${data.followUps.length} Open</span>
        </div>
        <div class='follow-up-list'>
          ${data.followUps.map((item) => `
            <article>
              <div><strong>${item.patient}</strong><p>${item.facility} - ${item.reason}</p></div>
              <span>${item.owner}</span>
              <span>${item.status}</span>
              <strong>${item.due}</strong>
            </article>`).join('')}
        </div>
      </section>`;
  }

  function executiveView() {
    const lockButton = isUnlocked() && !rolePermissions().has('executive_dashboard')
      ? `<button class='view-button' type='button' data-owner-route='lock'>Lock Owner View</button>`
      : '';
    root.innerHTML = `
      <div class='reference-shell executive-shell'>
        <header class='overview-top executive-top'>
          <div><h1>${data.title}</h1><p>${data.subtitle}</p></div>
          <div class='executive-actions'>
            <button class='view-button' type='button' data-owner-route='office'>Office Manager Dashboard</button>
            ${lockButton}
          </div>
        </header>
        <section class='owner-command'>
          ${ownerPriority()}
          ${ownerSearch()}
        </section>
        <section class='executive-kpis compact'>${executiveKpis()}</section>
        ${revenueCommand()}
        <section class='owner-dashboard-grid'>
          ${focusPanel()}
          ${managerSnapshot()}
        </section>
        <section class='owner-dashboard-grid lower'>
          ${providerWatchlist()}
          ${followUpPanel()}
        </section>
      </div>`;
    renderSearch();
  }

  function route() {
    const hash = window.location.hash;
    if (hash === '#executive') {
      if (canAccessExecutive()) executiveView();
      else gateView();
    } else if (hash === '#office') {
      root.innerHTML = officeMarkup;
      addOwnerButton();
    } else if (defaultLanding() === 'executive' && canAccessExecutive()) {
      executiveView();
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
      if (routeName === 'office') window.location.hash = 'office';
      if (routeName === 'lock') {
        setUnlocked(false);
        window.location.hash = '';
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
