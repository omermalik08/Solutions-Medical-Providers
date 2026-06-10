window.dashboardData.ownerDashboard = {
  accessLabel: 'Owner Access',
  accessCode: 'OWNER',
  title: 'Executive Dashboard',
  subtitle: 'Provider and office manager command center',
  kpis: [
    { label: 'At-Risk Providers', value: '2', detail: 'Need review today', tone: 'red' },
    { label: 'Open Follow-Ups', value: '18', detail: '4 overdue', tone: 'blue' },
    { label: 'Office Backlog', value: '11', detail: 'Scheduling and billing', tone: 'purple' },
    { label: 'Revenue at Risk', value: '$11,700', detail: 'Missed visits this period', tone: 'green' }
  ],
  revenue: {
    period: 'Month to date',
    collected: '$58.4k',
    projected: '$74.8k',
    cleanClaimRate: '92%',
    billingHolds: '$6.2k',
    missedRecoverable: '$4.7k',
    addOnReview: '$3.1k',
    note: 'Revenue numbers are mock estimates and should reconcile against Tebra once connected.',
    opportunities: [
      { label: 'Missed visit recovery', value: '$4.7k', detail: '26 visits to reschedule or close out', tone: 'red' },
      { label: 'Billing holds', value: '$6.2k', detail: '12 charts missing notes, signatures, or diagnosis details', tone: 'purple' },
      { label: 'Add-on review', value: '$3.1k', detail: 'Potential services for billing team review only', tone: 'blue' }
    ]
  },
  codeOpportunities: [
    {
      code: '+99439',
      title: 'CCM additional clinical staff time',
      category: 'Chronic care management',
      trigger: 'Look for eligible CCM patients with documented time beyond the first 20 minutes.',
      review: 'Confirm consent, care plan, monthly minutes, payer rules, and supervision.',
      status: 'High yield'
    },
    {
      code: '+99437',
      title: 'CCM additional provider time',
      category: 'Chronic care management',
      trigger: 'Flag NP-managed CCM time beyond the first 30 minutes when personally performed.',
      review: 'Validate practitioner time, no conflicting CCM bundle, and documentation support.',
      status: 'Review'
    },
    {
      code: '+99489',
      title: 'Complex CCM additional time',
      category: 'Complex chronic care management',
      trigger: 'Review complex patients with moderate or high decision-making and extended staff time.',
      review: 'Confirm complex CCM base requirements before considering any add-on unit.',
      status: 'Review'
    },
    {
      code: '+99498',
      title: 'Advance care planning extra time',
      category: 'Advance care planning',
      trigger: 'Find voluntary ACP discussions that continue beyond the first 30 minutes.',
      review: 'Confirm face-to-face time, patient/surrogate participation, and payer modifier rules.',
      status: 'Quick check'
    },
    {
      code: '+G3003',
      title: 'Chronic pain management extra time',
      category: 'Chronic pain management',
      trigger: 'Only review if chronic pain management is actually part of the visit model.',
      review: 'Confirm the initiating face-to-face visit, time threshold, and scope of service.',
      status: 'Explore'
    }
  ],
  providers: [
    { name: 'NP Smith', route: 'North Plant route', score: 96, visits: 10, scheduled: 10, missed: 0, revenue: '$1,800', docs: 'Current', trend: '+8%', status: 'On pace' },
    { name: 'NP Jones', route: 'South Plant route', score: 87, visits: 8, scheduled: 9, missed: 1, revenue: '$1,440', docs: '1 note open', trend: '-2%', status: 'Watch' },
    { name: 'NP Brown', route: 'West Plant route', score: 72, visits: 6, scheduled: 9, missed: 3, revenue: '$1,080', docs: '3 notes open', trend: '-9%', status: 'Review' },
    { name: 'NP Taylor', route: 'East Plant route', score: 80, visits: 4, scheduled: 5, missed: 1, revenue: '$720', docs: 'Current', trend: '+1%', status: 'Coaching' }
  ],
  manager: {
    score: 78,
    resolvedToday: 9,
    openItems: 11,
    overdueItems: 4,
    averageResolution: '5.2 hrs',
    note: 'Track office manager throughput, unresolved blockers, and follow-up quality.'
  },
  tasks: [
    { task: 'Patient refusals', owner: 'Office Manager', status: 'Needs call notes', due: 'Today', count: 8, priority: 'High' },
    { task: 'Scheduling errors', owner: 'Office Manager', status: 'Fix route gaps', due: 'Today', count: 5, priority: 'High' },
    { task: 'Tebra billing holds', owner: 'Billing queue', status: 'Missing documentation', due: 'Tomorrow', count: 4, priority: 'Medium' },
    { task: 'Facility issue notes', owner: 'Office Manager', status: 'Waiting on facilities', due: 'Friday', count: 2, priority: 'Medium' }
  ],
  followUps: [
    { patient: 'Patient A', facility: 'North Plant', provider: 'NP Jones', reason: 'Refused visit', owner: 'Office Manager', status: 'Call back today', due: '4:00 PM', value: '$180' },
    { patient: 'Patient B', facility: 'West Plant', provider: 'NP Brown', reason: 'Scheduling error', owner: 'Office Manager', status: 'Needs reschedule', due: 'Today', value: '$180' },
    { patient: 'Patient C', facility: 'South Plant', provider: 'NP Brown', reason: 'Hospitalized', owner: 'NP Brown', status: 'Verify discharge', due: 'Tomorrow', value: '$180' },
    { patient: 'Patient D', facility: 'East Plant', provider: 'NP Taylor', reason: 'Facility issue', owner: 'Office Manager', status: 'Escalated', due: 'Friday', value: '$180' }
  ],
  reviews: [
    { title: 'NP Brown missed-visit trend', detail: '3 missed visits and 3 open notes this week.', action: 'Review provider' },
    { title: 'Office manager backlog', detail: '11 open items with 4 overdue follow-ups.', action: 'Review workload' },
    { title: 'Patient refusals', detail: 'Largest missed-visit category and rising.', action: 'Review script' }
  ]
};

window.dashboardData.roleRouting = {
  defaultRole: 'office_manager',
  demoRoleParam: 'role',
  storageKey: 'smpUserRole',
  roles: {
    owner: {
      landing: 'executive',
      permissions: ['office_dashboard', 'executive_dashboard']
    },
    office_manager: {
      landing: 'office',
      permissions: ['office_dashboard']
    }
  }
};
