/** Documentation — English */
export const docsEn = {
  layoutTitle: 'Documentation',
  layoutDescription:
    'Primary Sentinel SaaS guide: multi-tenant account, dashboard, operations, DLQ, plans, and product API usage.',
  layoutOgTitle: 'Documentation — Primary Sentinel',
  layoutOgDescription:
    'Observability and autonomous reliability & security intelligence for ingestion and workloads: documentation for teams and tenant administrators.',
  nav: {
    intro: 'Intro',
    app: 'App',
    integration: 'Connect',
    back: 'Back',
    docsBadge: 'DOCS',
    closeMenu: 'Close menu',
    openMenu: 'Open documentation menu',
    close: 'Close',
    menu: 'Menu',
    linkIntro: 'Introduction',
    linkEmpezar: 'Getting started',
    linkDashboard: 'Dashboard',
    linkFlujos: 'Flows',
    linkOperaciones: 'Operations',
    linkReglas: 'AI rules',
    linkDlq: 'Dead Letter',
    linkNotif: 'Notifications',
    linkConfig: 'Settings',
    linkBilling: 'Billing',
    linkApi: 'API & webhooks',
  },
  pages: {
    intro: {
      metaTitle: 'Introduction',
      metaDesc:
        'Multi-tenant SaaS to observe and auto-repair webhook ingestion—AI rules, DLQ, and alerts—without acting as a generic business data access layer.',
      title: 'Introduction',
      p1:
        '<strong>Primary Sentinel</strong> is a <strong>SaaS</strong> for teams that need <strong>observability and governance</strong> over webhook ingestion and destinations: AI-assisted repair rules, incident queues, and alerts. Each customer works in their own <strong>tenant</strong> (logical isolation of <strong>pipeline configuration and telemetry</strong>); the dashboard and API enforce those boundaries from your account session and permissions.<br/><br/><strong>Scope:</strong> the product is built to <strong>auto-repair ingestion</strong> toward your destinations; it is not a generic data-access layer into your business stores or a replacement for analytics tools. <strong>Minimal</strong> ingestion-related artifacts the service <strong>persists</strong>—<strong>event</strong> payloads, <strong>DLQ</strong> archive copies, and <strong>reinject snapshots</strong>—are stored <strong>encrypted at rest</strong> with <strong>strict separation between organizations</strong>.',
      hWhat: 'What the product solves',
      liWhat: [
        '<strong>Visibility</strong> — Metrics, flow diagram, and operations without assembling your own generic monitoring system from scratch.',
        '<strong>Action</strong> — Rules that fix or route problematic events; what cannot be healed goes to <strong>Dead Letter</strong> for human review.',
        '<strong>Connectivity</strong> — Documented HTTP API and ingestion webhooks; the service scales with your event volume.',
      ],
      hFlow: 'Typical flow in the dashboard',
      liFlow: [
        '<strong>Monitor</strong> — On the <strong>Dashboard</strong> you see metrics, the flow diagram, and recent events.',
        '<strong>Configure ingestion</strong> — Under <strong>Flows</strong> you define endpoints and the per-tenant webhook URL.',
        '<strong>Operations</strong> — Under <strong>Operations</strong> you review dependencies, AI history, and stage metrics.',
        '<strong>AI rules</strong> — You manage repair rules (approve, edit, or delete).',
        '<strong>Incidents</strong> — Anything the system could not repair automatically appears in <strong>Dead Letter</strong> for retry or discard.',
        '<strong>Alerts</strong> — <strong>Notifications</strong> in the app in real time and channels configured under <strong>Settings</strong> (email, optional team chat if you enable it, signed outbound webhook to your URL).',
        '<strong>Plan</strong> — <strong>Billing</strong> summarizes your SaaS plan and payment roadmap.',
      ],
      liFlowNoPrices: [
        '<strong>Monitor</strong> — On the <strong>Dashboard</strong> you see metrics, the flow diagram, and recent events.',
        '<strong>Configure ingestion</strong> — Under <strong>Flows</strong> you define endpoints and the per-tenant webhook URL.',
        '<strong>Operations</strong> — Under <strong>Operations</strong> you review dependencies, AI history, and stage metrics.',
        '<strong>AI rules</strong> — You manage repair rules (approve, edit, or delete).',
        '<strong>Incidents</strong> — Anything the system could not repair automatically appears in <strong>Dead Letter</strong> for retry or discard.',
        '<strong>Alerts</strong> — <strong>Notifications</strong> in the app in real time and channels configured under <strong>Settings</strong> (email, optional team chat if you enable it, signed outbound webhook to your URL).',
        '<strong>Limits</strong> — In this phase you can run <strong>one trial endpoint</strong> active at a time; the app does not publish prices, purchases, or billing.',
      ],
      hStack: 'Documentation by topic',
      pStack:
        'Go deeper from the app itself: <a href="/docs/empezar">Getting started</a>, <a href="/docs/dashboard">Dashboard</a>, <a href="/docs/flujos">Flows</a>, <a href="/docs/operaciones">Operations</a>, <a href="/docs/reglas">AI rules</a>, <a href="/docs/dlq">Dead Letter</a>, <a href="/docs/notificaciones">Notifications</a>, <a href="/docs/configuracion">Settings</a>, <a href="/docs/facturacion">Billing</a>, and <a href="/docs/api">API & webhooks</a>. You do not need internal implementation details to operate the product.',
      pStackNoPrices:
        'Go deeper from the app itself: <a href="/docs/empezar">Getting started</a>, <a href="/docs/dashboard">Dashboard</a>, <a href="/docs/flujos">Flows</a>, <a href="/docs/operaciones">Operations</a>, <a href="/docs/reglas">AI rules</a>, <a href="/docs/dlq">Dead Letter</a>, <a href="/docs/notificaciones">Notifications</a>, <a href="/docs/configuracion">Settings</a>, and <a href="/docs/api">API & webhooks</a>. You do not need internal implementation details to operate the product.',
    },
    empezar: {
      metaTitle: 'Getting started',
      metaDesc: 'Sign-up, first access to the dashboard, and map of in-app documentation.',
      title: 'Getting started',
      p1:
        'Primary Sentinel is a <strong>cloud service</strong>: you create an account from the sign-in screen (according to the options available to you), get an isolated space for your organization (<strong>tenant</strong>), and the dashboard guides you to <strong>configure ingestion</strong>, review operations, and manage pipeline incidents. You do not need to install software to use the product.',
      hExplore: 'Documentation by topic in the app',
      pExplore:
        'Each guide lives under <code>/docs/…</code>. You can open directly: <a href="/docs">introduction</a> (<code>/docs</code>), <a href="/docs/dashboard">main dashboard</a> (<code>/docs/dashboard</code>), <a href="/docs/flujos">flows and webhooks</a> (<code>/docs/flujos</code>), <a href="/docs/operaciones">operations</a> (<code>/docs/operaciones</code>), <a href="/docs/reglas">AI rules</a> (<code>/docs/reglas</code>), <a href="/docs/dlq">Dead Letter</a> (<code>/docs/dlq</code>), <a href="/docs/notificaciones">notifications</a> (<code>/docs/notificaciones</code>), <a href="/docs/configuracion">settings</a> (<code>/docs/configuracion</code>), <a href="/docs/facturacion">billing</a> (<code>/docs/facturacion</code>), and <a href="/docs/api">API & webhooks</a> (<code>/docs/api</code>).',
      pExploreNoPrices:
        'Each guide lives under <code>/docs/…</code>. You can open directly: <a href="/docs">introduction</a> (<code>/docs</code>), <a href="/docs/dashboard">main dashboard</a> (<code>/docs/dashboard</code>), <a href="/docs/flujos">flows and webhooks</a> (<code>/docs/flujos</code>), <a href="/docs/operaciones">operations</a> (<code>/docs/operaciones</code>), <a href="/docs/reglas">AI rules</a> (<code>/docs/reglas</code>), <a href="/docs/dlq">Dead Letter</a> (<code>/docs/dlq</code>), <a href="/docs/notificaciones">notifications</a> (<code>/docs/notificaciones</code>), <a href="/docs/configuracion">settings</a> (<code>/docs/configuracion</code>), and <a href="/docs/api">API & webhooks</a> (<code>/docs/api</code>).',
      hSignIn: 'Account and sign-in',
      pAuth:
        'If there is no active session, the app sends you to <code>/auth</code>. After sign-in you reach the <a href="/dashboard">dashboard</a> (<code>/dashboard</code>), where everything you see is scoped to your <strong>tenant</strong>.',
      pAuthHelp:
        'If you cannot sign in, verify credentials and the account recovery flow. To connect your systems to the product, continue with <a href="/docs/api">API & webhooks</a> and <a href="/docs/flujos">Flows</a>; if the issue persists, contact support.',
      hSupport: 'Private installs or custom environments',
      pSupport:
        'Environment provisioning, keys, and deployments are handled by your organization or enterprise agreements with Primary Sentinel; those details are not part of the public product documentation.',
    },
    dashboard: {
      metaTitle: 'Dashboard',
      metaDesc: 'Main tenant view in Primary Sentinel: metrics, flow, and activity.',
      title: 'Dashboard',
      p1:
        '<code>/dashboard</code> is the product entry after sign-in. It summarizes <strong>your</strong> SaaS account (same-day metrics, DLQ, rules, and activity) before you drill into flows, operations, or incidents.',
      hMetrics: 'Metric cards',
      pMetrics:
        'Indicators such as today’s events, healed or pending rules, Dead Letter volume, and an approximate healing rate. They give a quick health check for the tenant.',
      hDiagram: 'Flow diagram',
      pDiagram:
        'Maps your <strong>endpoints</strong> to the event flow and node status. It is the “map” view before opening <a href="/docs/flujos">Flows</a> or <a href="/docs/operaciones">Operations</a>.',
      hRecent: 'Recent events',
      pRecent: 'A compact list of latest activity. For per-endpoint inspection or webhook tests, use Flows.',
      hActivity: 'Activity chart and agent',
      pActivity: 'Time series of events and a status block for the AI rules agent tied to your endpoints.',
    },
    flujos: {
      metaTitle: 'Flows',
      metaDesc: 'Endpoints, per-tenant ingestion webhooks, and testing in Primary Sentinel.',
      title: 'Flows',
      p1:
        'At <code>/dashboard/flows</code> you manage SaaS <strong>endpoints</strong>: each belongs to your <strong>tenant</strong> and has metadata, schema, destinations, and a <strong>webhook URL</strong> your systems call to send events (test or production).',
      hCreate: 'Create and edit endpoints',
      pCreate:
        'Changes are saved in the service; with an active session you only see and modify resources for your account.',
      hWebhook: 'Ingestion webhook',
      pWebhook:
        'The service exposes <code>POST /webhook/:tenantId/:slug</code>. <code>tenantId</code> matches the identifier shown under <a href="/docs/configuracion">Settings</a>. Authenticated API calls send a session token in <code>Authorization: Bearer …</code> (see <a href="/docs/api">API & webhooks</a>).',
      hEvents: 'Events per endpoint',
      pEvents:
        'You can list and review <strong>operational ingestion history</strong> per endpoint to debug the pipeline before AI rules run or items land in DLQ.',
    },
    operaciones: {
      metaTitle: 'Operations',
      metaDesc: 'Dependency map, AI history, stage metrics, and heuristic suggestions.',
      title: 'Operations',
      p1:
        'The <code>/dashboard/operations</code> view is for SaaS <strong>operators</strong>: it summarizes how your endpoints connect to destinations, recent AI engine decisions, and per-stage metrics. What you see is <strong>pipeline telemetry and state</strong>, always scoped to your <strong>tenant</strong>.',
      hMap: 'Endpoint → destinations map',
      pMap:
        'Shows nodes (your endpoints) and edges linking sources to destinations. Use it to understand the dependency graph without opening each flow separately. If you have not created endpoints yet, you see an empty state until you configure <a href="/docs/flujos">Flows</a>.',
      hAi: 'AI decision history',
      pAi:
        'Lists recent events from the reasoning or automatic-action history, bounded in time. It complements detail you may see later in rules or specific events.',
      hMetrics: 'Stage metrics',
      pMetrics:
        'Time series of metrics over hourly windows (default: a wide range) to spot spikes, drops, or stagnation. The service aggregates <strong>pipeline metrics</strong>; the UI presents them compactly.',
      hSuggest: 'Heuristic suggestions',
      pSuggest:
        'The API may return suggestions from recent samples (severity + text). They are hints to prioritize schema, rule, or connectivity improvements—not a substitute for team judgment.',
      hApi: 'Related API',
      pApi:
        'Routes used by this screen include <code>GET /api/operations/dependency-graph</code>, <code>GET /api/operations/ai-history</code>, <code>GET /api/metrics/stages</code>, and <code>GET /api/suggestions/heuristics</code>. They require an authenticated session; details in <a href="/docs/api">API & webhooks</a>.',
    },
    reglas: {
      metaTitle: 'AI rules',
      metaDesc: 'Per-tenant repair rules in Primary Sentinel SaaS.',
      title: 'AI rules',
      p1:
        'At <code>/dashboard/rules</code> you manage <strong>transformation / repair</strong> rules. The engine may propose rules from event analysis; you review them in your <strong>tenant</strong> context before activating them in production.',
      hState: 'States',
      pState:
        'Rules may appear as pending approval, active, or other states depending on service state. The dashboard uses color pills consistent with the rest of the SaaS for quick scanning.',
      hApprove: 'Approve and edit',
      pApprove:
        'You can review suggested content, approve for activation, or adjust conditions and actions before enabling. Everything is scoped to your organization in the multi-tenant model.',
      hDelete: 'Delete',
      pDelete:
        'Obsolete or incorrect rules can be removed from the manager; confirmations are usually required to avoid accidental deletion.',
    },
    dlq: {
      metaTitle: 'Dead Letter',
      metaDesc: 'Per-tenant DLQ queue, reinjection, snapshots, and discard in Primary Sentinel.',
      title: 'Dead Letter Queue',
      p1:
        '<code>/dashboard/dlq</code> lists events the system <strong>could not repair automatically</strong>. This is the human review queue: you review <strong>failure context</strong> in the pipeline and, when the service allows, you can <strong>reinject</strong> the event or <strong>discard</strong> it. You only see your tenant’s items.',
      hWhen: 'When an item appears',
      pWhen:
        'Usually recurrent errors, <strong>out-of-schema payloads</strong>, or situations not covered by current rules. Use it to prioritize rule improvements or fixes in the systems that send data.',
      hReinject: 'Reinjection and snapshots',
      pReinject:
        'The API exposes reinjection with optional corrected payload (<code>POST /api/dlq/:id/reinject</code>), listing snapshots per event, and diffing versions for audit. Exact behavior may vary with the product version.',
      hDiscard: 'Discard',
      pDiscard:
        'You can remove a DLQ record when you decide not to reprocess it (<code>DELETE /api/dlq/:id</code>), according to service retention policies.',
    },
    notificaciones: {
      metaTitle: 'Notifications',
      metaDesc: 'In-app notification center and tenant channels in Primary Sentinel.',
      title: 'In-app notifications',
      p1:
        'The <code>/dashboard/notifications</code> route concentrates <strong>real-time</strong> alerts inside the product: items appear without reload when the service records updates for your <strong>tenant</strong>.',
      hBackend: 'When alerts appear',
      pBackend:
        'The product records notifications on relevant milestones (rules, healings, unrecoverable cases, etc.), always tied to the correct tenant so you only see your own.',
      hSchema: 'Typical notification content',
      pSchema:
        'Usually includes event type (e.g. healed, Dead Letter, new or pending rule), title, optional body, read flag, and timestamp. Concrete values should match what the dashboard displays.',
      hChannels: 'Email and other channels',
      pChannels:
        'Beyond the on-screen center, you can enable <strong>email</strong>, a <strong>team chat channel</strong> (if configured), and a <strong>signed alert webhook</strong> to your systems from <a href="/docs/configuracion">Settings</a> to route the same incidents to your team.',
    },
    configuracion: {
      metaTitle: 'Settings',
      metaDesc: 'SaaS account, tenant, notifications, and infrastructure in Primary Sentinel.',
      title: 'Settings',
      p1:
        '<code>/dashboard/settings</code> groups <strong>tenant account</strong>, notification preferences, and service infrastructure. Sensitive changes are saved via authenticated API (<code>PUT /api/settings</code>).',
      hAccount: 'Account and plan',
      pAccount:
        'You see your email, <strong>Tenant ID</strong> (useful for ingestion webhook URLs), and the current SaaS <strong>plan</strong>. The free plan includes API limits (e.g. active endpoints); more in <a href="/docs/facturacion">Billing</a>.',
      pAccountNoPrices:
        'You see your email and <strong>Tenant ID</strong> (useful for ingestion webhook URLs). With public pricing and billing disabled in this deployment, <strong>API limits</strong> apply (e.g. one <strong>trial endpoint</strong> active at a time).',
      hNotif: 'Notifications: email and webhooks',
      pNotif:
        'You can enable <strong>email</strong> (healings, DLQ, pending rules), alerts to a <strong>team chat channel</strong> if you set it up in the UI, and your own <strong>HTTPS webhook</strong> URL with a signature in the <code>X-Sentinel-Signature</code> header (shared secret). These run in parallel with the in-app notification center.',
      hInfra: 'Operational signals',
      pInfra:
        'You may see a contextual summary of the API endpoint and other <strong>support-oriented fields</strong>. It is in-product context only; it does not replace contractual documentation or internal technical details, which are not published in these guides.',
    },
    facturacion: {
      metaTitle: 'Billing',
      metaDesc: 'Plans, free-tier limits, and payment roadmap in Primary Sentinel SaaS.',
      title: 'Billing and plans',
      p1:
        'Primary Sentinel is a <strong>multi-tenant SaaS product</strong>: each organization or team works in an isolated space (tenant), with limits and billing tied to the subscribed plan.',
      hScreen: 'Billing screen',
      pScreen:
        'At <code>/dashboard/billing</code> you see the <strong>current plan</strong> and operational notes shown in the product (e.g. billing status or account messages). From there you can return to <a href="/docs/configuracion">Settings</a> to review the same plan in the account summary.',
      hFree: 'Free plan and limits',
      pFree:
        'In the current phase, the free plan applies <strong>API limits</strong> (e.g. one <strong>trial endpoint</strong> active at a time). Exact limits may evolve; the settings screen and billing API response reflect what applies to your tenant.',
      hRoadmap: 'Roadmap: self-service billing',
      pRoadmap:
        'A <strong>billing portal</strong> to change plan, payment method, and invoices is on the product roadmap. Until then, upgrades or enterprise agreements are handled outside the app or with the Primary Sentinel team.',
      hApi: 'API',
      pApi:
        'Billing state shown in the dashboard comes from <code>GET /api/billing/status</code> (authenticated). More detail in <a href="/docs/api">API & webhooks</a>.',
    },
    api: {
      metaTitle: 'API & webhooks',
      metaDesc: 'Authenticated session, Primary Sentinel product API routes, and ingestion webhooks.',
      title: 'API & webhooks',
      p1:
        'The dashboard consumes the <strong>product API</strong> with your signed-in session. Authenticated requests send a <strong>session token</strong> as <code>Authorization: Bearer &lt;token&gt;</code>; the service validates the user and enforces <strong>tenant</strong> isolation. Ingestion webhooks do not use that header: they identify tenant and endpoint in the path itself.',
      hCliente: 'Integration best practices',
      pClient:
        'Centralize paths, retries, and headers in a single HTTP client in your application to avoid duplicating logic and to make credential rotation easier.',
      hRest: 'Common endpoints',
      pRest: 'Common API patterns (base URL is the Primary Sentinel environment you are using):',
      thMethod: 'Method',
      thPath: 'Path',
      thUse: 'Purpose',
      rows: [
        { method: 'POST', path: '/api/endpoints', use: 'Create endpoint' },
        { method: 'PATCH', path: '/api/endpoints/:id', use: 'Update endpoint' },
        { method: 'DELETE', path: '/api/endpoints/:id', use: 'Delete endpoint' },
        { method: 'GET', path: '/api/endpoints', use: 'List tenant endpoints' },
        { method: 'GET', path: '/api/endpoints/:id/events', use: 'Endpoint events' },
        { method: 'GET', path: '/api/endpoints/:id/rules', use: 'Endpoint AI rules' },
        { method: 'PATCH', path: '/api/endpoints/:endpointId/rules/:ruleId', use: 'Update rule' },
        { method: 'DELETE', path: '/api/endpoints/:endpointId/rules/:ruleId', use: 'Delete rule' },
        { method: 'GET', path: '/api/dlq', use: 'List Dead Letter' },
        { method: 'POST', path: '/api/dlq/:id/reinject', use: 'Reinject DLQ event' },
        { method: 'DELETE', path: '/api/dlq/:id', use: 'Discard DLQ item' },
        { method: 'GET', path: '/api/dlq/:eventId/snapshots', use: 'Snapshots for an event' },
        { method: 'GET', path: '/api/settings', use: 'Tenant preferences' },
        { method: 'PUT', path: '/api/settings', use: 'Save preferences' },
        { method: 'GET', path: '/api/billing/status', use: 'Plan and billing notes' },
        { method: 'GET', path: '/api/operations/dependency-graph', use: 'Endpoint → destinations map' },
        { method: 'GET', path: '/api/operations/ai-history', use: 'AI decision history' },
        { method: 'GET', path: '/api/metrics/stages', use: 'Stage metrics (query hours)' },
        { method: 'GET', path: '/api/suggestions/heuristics', use: 'Heuristic suggestions' },
        { method: 'GET', path: '/api/public/slo', use: 'Public SLO (no session)' },
      ],
      hWebhook: 'Ingestion webhook',
      pWebhookIngest: 'Event ingestion (JSON body)',
      hCors: 'Base URL and access from your systems',
      pCors:
        'Use HTTPS and the base URL your administrator or the official product environment gives you. If you call from a browser, coordinate allowed origins with whoever runs the environment; for server-to-server calls, HTTPS and the right credentials are usually enough.',
    },
  },
} as const;
