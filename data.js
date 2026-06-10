window.dashboardData = {
  companyName: 'Solutions Medical Providers',
  dashboardTitle: 'Mobile NP Dashboard',
  viewLabel: 'View Dashboard',
  periodLabel: 'May 12 to May 18',
  kpis: [
    {
      id: 'visits-completed',
      label: 'Visits Completed',
      value: '18',
      ringValue: '90%',
      ringLabel: 'Target',
      progress: 90,
      footerLabel: 'Daily goal',
      footerValue: '20',
      accent: '#f05243',
      accentSoft: 'rgba(240, 82, 67, 0.34)',
      accentDeep: 'rgba(240, 82, 67, 0.1)',
      lightning: 'red'
    },
    {
      id: 'scheduled-visits',
      label: 'Scheduled Visits',
      value: '22',
      ringValue: '88%',
      ringLabel: 'Utilization',
      progress: 88,
      footerLabel: 'Capacity',
      footerValue: '25',
      accent: '#69e8ff',
      accentSoft: 'rgba(105, 232, 255, 0.34)',
      accentDeep: 'rgba(105, 232, 255, 0.1)',
      lightning: 'blue'
    },
    {
      id: 'revenue-today',
      label: 'Revenue Today',
      value: '$3,240',
      ringValue: '95%',
      ringLabel: 'Vs Plan',
      progress: 95,
      footerLabel: 'Plan',
      footerValue: '$3,400',
      accent: '#835cff',
      accentSoft: 'rgba(131, 92, 255, 0.36)',
      accentDeep: 'rgba(131, 92, 255, 0.1)',
      lightning: 'purple'
    },
    {
      id: 'completion-rate',
      label: 'Completion Rate',
      value: '82%',
      ringValue: '-3%',
      ringLabel: 'Vs Last Wk',
      progress: 82,
      footerLabel: 'Last week',
      footerValue: '85%',
      accent: '#7af36c',
      accentSoft: 'rgba(122, 243, 108, 0.34)',
      accentDeep: 'rgba(122, 243, 108, 0.1)',
      lightning: 'green'
    }
  ],
  selectedMetric: {
    label: 'Visits Completed',
    subtitle: 'Track completed mobile NP visits against target',
    value: '18',
    ringValue: '90%',
    ringLabel: 'Target',
    progress: 90,
    accent: '#f05243',
    accentSoft: 'rgba(240, 82, 67, 0.34)',
    accentDeep: 'rgba(240, 82, 67, 0.1)',
    lightning: 'red',
    stats: [
      { label: 'Daily Goal', value: '20' },
      { label: 'Remaining', value: '2', tone: 'negative' },
      { label: '% of Target', value: '90%', tone: 'negative' },
      { label: 'Trend (last 7 days)', value: 'sparkline' }
    ]
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
  chartTarget: 18,
  providerProductivity: [
    { provider: 'NP Smith', visits: 10, percent: 96 },
    { provider: 'NP Jones', visits: 8, percent: 87 },
    { provider: 'NP Brown', visits: 6, percent: 84 },
    { provider: 'NP Taylor', visits: 4, percent: 80 }
  ],
  missedVisits: [
    { reason: 'Patient Refused', count: 25, percent: 38 },
    { reason: 'Hospitalized', count: 15, percent: 23 },
    { reason: 'Facility Issue', count: 10, percent: 15 },
    { reason: 'Scheduling Error', count: 15, percent: 24 }
  ],
  missedRevenue: {
    missedVisits: 65,
    reimbursementPerVisit: 180,
    total: 11700,
    label: '65 missed visits x $180'
  },
  insights: [
    'Completion rate is 3% below last week.',
    'Patient refusals are the largest missed-visit category.'
  ],
  alerts: [
    {
      title: 'Scheduling errors need review',
      time: 'May 18 - 8:45 AM',
      level: 'high'
    },
    {
      title: 'Patient refusal trend increased',
      time: 'May 18 - 7:15 AM',
      level: 'medium'
    }
  ]
};
