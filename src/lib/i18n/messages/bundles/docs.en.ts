/** Documentation — English */
export const docsEn = {
  layoutTitle: 'Documentation',
  layoutDescription:
    'Primary Sentinel SaaS guide: multi-tenant account, dashboard, operations, DLQ, plans, and API integration.',
  layoutOgTitle: 'Documentation — Primary Sentinel',
  layoutOgDescription:
    'Observability and autonomous reliability & security intelligence for ingestion and workloads: documentation for teams and tenant administrators.',
  nav: {
    intro: 'Intro',
    app: 'App',
    integration: 'Integration',
    backHome: 'Back to home',
    goDashboard: 'Open dashboard',
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
        'Primary Sentinel as SaaS: multi-tenant, observability over endpoints and workloads, and AI-assisted autonomous reliability & security intelligence.',
      title: 'Introduction',
      p1:
        '<strong>Primary Sentinel</strong> is a <strong>SaaS</strong> for teams that need <strong>observability and governance</strong> over webhook ingestion and destinations: AI-assisted repair rules, incident queues, and alerts. Each customer works in their own <strong>tenant</strong> (logical isolation of data and settings); the dashboard and API use the Supabase session to enforce those boundaries.',
      hWhat: 'What the product solves',
      liWhat: [
        '<strong>Visibility</strong> — Metrics, flow diagram, and operations without building a generic monitoring stack yourself.',
        '<strong>Action</strong> — Rules that fix or route problematic events; what cannot be healed goes to <strong>Dead Letter</strong> for human review.',
        '<strong>Integration</strong> — Documented REST API and ingestion webhooks; the deployed backend (e.g. Cloudflare Worker) scales with the service.',
      ],
      hFlow: 'Typical flow in the dashboard',
      liFlow: [
        '<strong>Monitor</strong> — On the <strong>Dashboard</strong> you see metrics, the flow diagram, and recent events.',
        '<strong>Connect data</strong> — Under <strong>Flows</strong> you define endpoints and the per-tenant webhook URL.',
        '<strong>Operations</strong> — Under <strong>Operations</strong> you review dependencies, AI history, and stage metrics.',
        '<strong>AI rules</strong> — You manage repair rules (approve, edit, or delete).',
        '<strong>Incidents</strong> — Anything the system could not repair automatically appears in <strong>Dead Letter</strong> for retry or discard.',
        '<strong>Alerts</strong> — <strong>Notifications</strong> in the app (Realtime) and channels configured under <strong>Settings</strong> (email, Slack, signed webhook).',
        '<strong>Plan</strong> — <strong>Billing</strong> summarizes your SaaS plan and payment roadmap.',
      ],
      hStack: 'Stack overview',
      pStack:
        'The frontend (Next.js) uses <strong>Supabase</strong> authentication and calls the <strong>product API</strong> with a JWT. Public variables (<code>NEXT_PUBLIC_*</code>) and the API URL are set per environment (local or Vercel). Step-by-step setup in <a href="/docs/empezar">Getting started</a>.',
    },
    empezar: {
      metaTitle: 'Getting started',
      metaDesc: 'Sign-up, environment variables, Supabase, API, and deploying Primary Sentinel.',
      title: 'Getting started',
      p1:
        'Primary Sentinel is used as a <strong>service</strong>: you create an account (email/password or OAuth), get an implicit <strong>tenant</strong> tied to your Supabase user, and the dashboard talks to the deployed backend that exposes the REST API. In development you run the frontend and point it at a local Worker or a shared environment.',
      h1: '1. Install dependencies',
      pInstall: 'To contribute or run the dashboard locally, in the frontend directory:',
      h2: '2. Environment variables',
      pEnv:
        'Copy <code>.env.example</code> to <code>.env.local</code> and fill in real values (no placeholders). <code>NEXT_PUBLIC_*</code> keys are injected into the client bundle: use only the Supabase <strong>anon</strong> key, never <code>service_role</code>.',
      pEnvExample: 'Example contents:',
      h3: '3. Run locally',
      h4: '4. Account and sign-in',
      pAuth:
        'After opening the site, if there is no session you are redirected to <code>/auth</code>. You can register with email and password or the OAuth provider configured in Supabase (e.g. Google). With a successful login you reach the <a href="/dashboard">dashboard</a> (<code>/dashboard</code>), where all API routes carry your JWT and the backend resolves the <strong>tenant</strong>.',
      pAuthFail:
        'If login fails, check <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and restart the dev server after changing <code>.env.local</code>.',
      h5: '5. Production (Vercel or other host)',
      pProd:
        'Set the same <code>NEXT_PUBLIC_*</code> variables in your host’s dashboard (e.g. Vercel). <code>NEXT_PUBLIC_API_URL</code> must point to the Worker or API in production. Also set <code>NEXT_PUBLIC_SITE_URL</code> if you use OAuth, aligned with Supabase allowed URLs and with <code>ALLOWED_ORIGINS</code> / CORS on the backend.',
      codeInstall: 'npm install',
      codeCpEnv: 'cp .env.example .env.local',
      codeEnvExample: `# Supabase — Settings / API (anon / public key)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Public site URL (production: same origin as in Supabase Redirect URLs)
# NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app

# SaaS backend (local Worker or deployed URL)
NEXT_PUBLIC_API_URL=http://localhost:8787`,
      codeDev: `npm run dev
# Then open http://localhost:3000 in the browser`,
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
        'Changes are persisted in the multi-tenant backend; the dashboard uses the session JWT so you only see and modify resources for your account.',
      hWebhook: 'Ingestion webhook',
      pWebhook:
        'The backend exposes <code>POST /webhook/:tenantId/:slug</code>. <code>tenantId</code> matches the user/tenant id shown under <a href="/docs/configuracion">Settings</a>. Authenticated REST calls use <code>Authorization: Bearer &lt;JWT&gt;</code> (see <a href="/docs/api">API & webhooks</a>).',
      hEvents: 'Events per endpoint',
      pEvents:
        'You can list and inspect events for an endpoint to debug integrations before AI rules run or items land in DLQ.',
    },
    operaciones: {
      metaTitle: 'Operations',
      metaDesc: 'Dependency map, AI history, stage metrics, and heuristic suggestions.',
      title: 'Operations',
      p1Before:
        'The <code>/dashboard/operations</code> view is for SaaS <strong>operators</strong>: it summarizes how your endpoints connect to destinations, recent AI engine decisions, and per-stage metrics (Worker',
      p1After:
        'Supabase). Data is <strong>per tenant</strong>: you only see what belongs to your account.',
      hMap: 'Endpoint → destinations map',
      pMap:
        'Shows nodes (your endpoints) and edges linking sources to destinations. Use it to understand the dependency graph without opening each flow separately. If you have not created endpoints yet, you see an empty state until you configure <a href="/docs/flujos">Flows</a>.',
      hAi: 'AI decision history',
      pAi:
        'Lists recent events from the reasoning or automatic-action history, bounded in time. It complements detail you may see later in rules or specific events.',
      hMetrics: 'Stage metrics',
      pMetrics:
        'Time series of metrics over hourly windows (default: a wide range) to spot spikes, drops, or stagnation. The backend aggregates; the UI presents it compactly.',
      hSuggest: 'Heuristic suggestions',
      pSuggest:
        'The API may return suggestions from recent samples (severity + text). They are hints to prioritize schema, rule, or connectivity improvements—not a substitute for team judgment.',
      hApi: 'Related API',
      pApi:
        'Routes used by this screen include <code>GET /api/operations/dependency-graph</code>, <code>GET /api/operations/ai-history</code>, <code>GET /api/metrics/stages</code>, and <code>GET /api/suggestions/heuristics</code>. They require a session JWT; details in <a href="/docs/api">API & webhooks</a>.',
    },
    reglas: {
      metaTitle: 'AI rules',
      metaDesc: 'Per-tenant repair rules in Primary Sentinel SaaS.',
      title: 'AI rules',
      p1:
        'At <code>/dashboard/rules</code> you manage <strong>transformation / repair</strong> rules. The engine may propose rules from event analysis; you review them in your <strong>tenant</strong> context before activating them in production.',
      hState: 'States',
      pState:
        'Rules may appear as pending approval, active, or other states depending on the backend. The dashboard uses color pills consistent with the rest of the SaaS for quick scanning.',
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
        '<code>/dashboard/dlq</code> lists events the system <strong>could not repair automatically</strong>. This is the human review queue: you inspect the payload and failure reason and, when the backend allows, you can <strong>reinject</strong> the event or <strong>discard</strong> it. You only see your tenant’s items.',
      hWhen: 'When an item appears',
      pWhen:
        'Usually recurrent errors, out-of-schema data, or situations not covered by current rules. Use it to prioritize rule improvements or fixes upstream.',
      hReinject: 'Reinjection and snapshots',
      pReinject:
        'The API exposes reinjection with optional corrected payload (<code>POST /api/dlq/:id/reinject</code>), listing snapshots per event, and diffing versions for audit. Exact behavior depends on the deployed Worker version.',
      hDiscard: 'Discard',
      pDiscard:
        'You can remove a DLQ record when you decide not to reprocess it (<code>DELETE /api/dlq/:id</code>), according to backend retention policies.',
    },
    notificaciones: {
      metaTitle: 'Notifications',
      metaDesc: 'In-app notification center and tenant channels in Primary Sentinel.',
      title: 'In-app notifications',
      p1:
        'The <code>/dashboard/notifications</code> route concentrates <strong>real-time</strong> alerts inside the product. The frontend subscribes to the <code>notifications</code> table in Supabase via <strong>Realtime</strong>, so alerts appear without reload when the backend inserts rows for your <strong>tenant</strong>.',
      hBackend: 'What the backend must do',
      pBackend:
        'The SaaS API should insert rows into <code>notifications</code> on relevant milestones (rules, healings, unrecoverable cases, etc.). <code>tenant_id</code> must align with the authenticated user so <strong>RLS</strong> policies only return your notifications.',
      hSchema: 'Suggested schema (SQL)',
      pAfterSchema:
        'Types can be extended if the product requires; keep them consistent with what the dashboard shows.',
      hChannels: 'Email, Slack, and webhooks',
      pChannels:
        'Beyond the on-screen center, you can enable <strong>Resend</strong>, <strong>Slack</strong>, and a <strong>signed alert webhook</strong> from <a href="/docs/configuracion">Settings</a> to route the same incidents to your team’s channels.',
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
      hNotif: 'Notifications: Resend, Slack, and signed webhook',
      pNotif:
        'You can enable <strong>email</strong> (healings, DLQ, pending rules), a Slack <strong>Incoming Webhook</strong> for incident summaries, and your own <strong>HTTPS webhook</strong> with <code>HMAC-SHA256</code> in the <code>X-Sentinel-Signature</code> header (shared secret). These run in parallel with the in-app notification center.',
      hInfra: 'Infrastructure (reference)',
      pInfra:
        'The screen summarizes the <strong>API</strong> origin (Worker URL) and the typical stack: Supabase (Postgres), cache (e.g. Redis/Upstash), DLQ storage (e.g. R2), and email (Resend). It is informational for support and operational transparency; it does not replace your cloud provider’s console.',
      hEnv: 'Frontend environment variables',
      pEnv:
        'Public keys (<code>NEXT_PUBLIC_*</code>) are set at build time or in Vercel; they are not edited from this screen. For local development use <code>.env.local</code> as in <a href="/docs/empezar">Getting started</a>.',
    },
    facturacion: {
      metaTitle: 'Billing',
      metaDesc: 'Plans, free-tier limits, and payment roadmap in Primary Sentinel SaaS.',
      title: 'Billing and plans',
      p1:
        'Primary Sentinel is a <strong>multi-tenant SaaS product</strong>: each organization or team works in an isolated space (tenant), with limits and billing tied to the subscribed plan.',
      hScreen: 'Billing screen',
      pScreen:
        'At <code>/dashboard/billing</code> you see the <strong>current plan</strong> and notes returned by the backend (e.g. payment provider status or operational messages). From there you can return to <a href="/docs/configuracion">Settings</a> to review the same plan in the account summary.',
      hFree: 'Free plan and limits',
      pFree:
        'In the current phase, the free plan applies <strong>API limits</strong> (e.g. a capped number of active endpoints). Exact limits may evolve; the settings screen and billing API response reflect what applies to your tenant.',
      hRoadmap: 'Roadmap: Stripe and customer portal',
      pRoadmap:
        '<strong>Stripe</strong> integration and a <strong>customer portal</strong> to change plan, payment method, and invoices are on the product roadmap. Until then, upgrades or enterprise agreements are handled outside the app or with the Primary Sentinel team.',
      hApi: 'API',
      pApi:
        'Billing state shown in the dashboard comes from <code>GET /api/billing/status</code> (authenticated). More detail in <a href="/docs/api">API & webhooks</a>.',
    },
    api: {
      metaTitle: 'API & webhooks',
      metaDesc: 'Supabase JWT auth, Primary Sentinel REST routes, and ingestion webhooks.',
      title: 'API & webhooks',
      p1:
        'The dashboard is a client of the <strong>product API</strong> (e.g. Cloudflare Worker). Authenticated requests send the <strong>Supabase session JWT</strong> as <code>Authorization: Bearer &lt;token&gt;</code>; the backend validates the user and enforces <strong>tenant</strong> isolation. Public ingestion webhooks do not use that JWT (they use the path <code>tenantId</code> and endpoint slug).',
      hClient: 'Client code',
      pClient:
        'HTTP is centralized in <code>src/lib/api.ts</code>: keep paths, retries, and headers there to avoid duplicating logic in components.',
      hRest: 'Common REST endpoints',
      pRest: 'Patterns exposed by the Worker (prefix from your <code>NEXT_PUBLIC_API_URL</code> deployment):',
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
        { method: 'GET', path: '/api/public/slo', use: 'Public SLO (no JWT)' },
      ],
      hWebhook: 'Ingestion webhook',
      pWebhookIngest: 'Event ingestion (JSON body)',
      hCors: 'Base URL and CORS',
      pCors:
        'The base URL comes from <code>NEXT_PUBLIC_API_URL</code> per environment. The backend must allow the frontend origin (e.g. your Vercel domain) in CORS / <code>ALLOWED_ORIGINS</code>.',
    },
  },
} as const;
