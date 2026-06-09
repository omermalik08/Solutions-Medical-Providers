window.dashboardData = {
  companyName: 'Solutions Medical Providers',
  dashboardTitle: 'Mobile NP Dashboard',
  periodLabel: 'May 12 to May 18',
  snapshotLabel: 'Daily Operations',
  kpis: [
    {
      id: 'visits-completed',
      label: 'Visits Completed',
      value: '18',
      progress: 90,
      summary: '90% of goal',
      detail: 'Daily goal 20',
      footnote: '2 visits remaining',
      accent: '#35f5ff'
    },
    {
      id: 'scheduled-visits',
      label: 'Scheduled Visits',
      value: '22',
      progress: 88,
      summary: '88% utilization',
      detail: 'Capacity 25',
      footnote: '3 open slots',
      accent: '#adff45'
    },
    {
      id: 'revenue-today',
      label: 'Revenue Today',
      value: '$3,240',
      progress: 95,
      summary: '95% vs plan',
      detail: 'Plan $3,400',
      footnote: '$160 to plan',
      accent: '#ffcf4a'
    },
    {
      id: 'completion-rate',
      label: 'Completion Rate',
      value: '82%',
      progress: 82,
      summary: '-3% vs last week',
      detail: 'Last week 85%',
      footnote: 'Watch missed visits',
      accent: '#ff5ec4'
    }
  ],
  visitsCompletedDetail: {
    completed: 18,
    goal: 20,
    progress: 90,
    scheduled: 22,
    remaining: 2,
    completionRate: '82%',
    routeNote: 'Balanced for a small mobile NP team covering daily facility rounds.'
  },
  visitsOverTime: [
    { date: 'May 12', visits: 14 },
    { date: 'May 13', visits: 16 },
    { date: 'May 14', visits: 17 },
    { date: 'May 15', visits: 19 },
    { date: 'May 16', visits: 15 },
    { date: 'May 17', visits: 20 },
    { date: 'May 18', visits: 18 }
  ],
  providerProductivity: [
    { provider: 'NP Smith', visits: 10, accent: '#35f5ff' },
    { provider: 'NP Jones', visits: 8, accent: '#adff45' },
    { provider: 'NP Brown', visits: 6, accent: '#ffcf4a' },
    { provider: 'NP Taylor', visits: 4, accent: '#ff5ec4' }
  ],
  missedVisits: [
    { reason: 'Patient Refused', count: 25, accent: '#ff5ec4' },
    { reason: 'Hospitalized', count: 15, accent: '#35f5ff' },
    { reason: 'Facility Issue', count: 10, accent: '#adff45' },
    { reason: 'Scheduling Error', count: 15, accent: '#ffcf4a' }
  ],
  missedRevenue: {
    missedVisits: 65,
    reimbursementPerVisit: 180,
    total: 11700,
    label: '65 missed visits x $180'
  },
  insights: [
    {
      title: 'Completion rate slipped',
      body: 'Completion rate is 82%, down 3% from last week. Patient refusals and scheduling errors are the fastest places to recover visits.'
    },
    {
      title: 'Top providers are carrying volume',
      body: 'NP Smith and NP Jones completed 18 visits together. Keep lower-volume routes visible before adding more scheduled capacity.'
    },
    {
      title: 'Revenue gap is manageable',
      body: 'Revenue is $160 under plan today, while missed visits show a larger $11,700 recovery opportunity for the week.'
    }
  ],
  alerts: [
    {
      level: 'High',
      title: 'Scheduling error misses',
      body: '15 missed visits need route review and same-week rescheduling.'
    },
    {
      level: 'Medium',
      title: 'Patient refusal trend',
      body: '25 refusals make up the largest missed-visit category.'
    },
    {
      level: 'Low',
      title: 'Capacity still available',
      body: '3 visit slots remain open against a daily capacity of 25.'
    }
  ]
};
