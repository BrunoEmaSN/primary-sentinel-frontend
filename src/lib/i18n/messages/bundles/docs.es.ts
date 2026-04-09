/** Documentación — español */
export const docsEs = {
  layoutTitle: 'Documentación',
  layoutDescription:
    'Guía del producto SaaS Primary Sentinel: cuenta multi-tenant, panel, operaciones, DLQ, planes e integración API.',
  layoutOgTitle: 'Documentación — Primary Sentinel',
  layoutOgDescription:
    'SaaS de observabilidad y auto-reparación de pipelines: documentación para equipos y administradores de tenant.',
  nav: {
    intro: 'Intro',
    app: 'App',
    integration: 'Integración',
    backHome: 'Volver al inicio',
    goDashboard: 'Ir al panel',
    docsBadge: 'DOCS',
    closeMenu: 'Cerrar menú',
    openMenu: 'Abrir menú de documentación',
    close: 'Cerrar',
    menu: 'Menú',
    linkIntro: 'Introducción',
    linkEmpezar: 'Primeros pasos',
    linkDashboard: 'Dashboard',
    linkFlujos: 'Flujos',
    linkOperaciones: 'Operaciones',
    linkReglas: 'Reglas IA',
    linkDlq: 'Dead Letter',
    linkNotif: 'Notificaciones',
    linkConfig: 'Configuración',
    linkBilling: 'Facturación',
    linkApi: 'API y webhooks',
  },
  pages: {
    intro: {
      metaTitle: 'Introducción',
      metaDesc:
        'Primary Sentinel como SaaS: multi-tenant, observabilidad de pipelines y auto-reparación asistida por IA.',
      title: 'Introducción',
      p1:
        '<strong>Primary Sentinel</strong> es un <strong>SaaS</strong> para equipos que necesitan <strong>observabilidad y gobierno</strong> sobre pipelines de datos: ingesta por webhooks, reglas de reparación asistidas por IA, colas de incidentes y alertas. Cada cliente trabaja en su propio <strong>tenant</strong> (aislamiento lógico de datos y configuración); el panel y la API usan la sesión de Supabase para aplicar esos límites.',
      hWhat: 'Qué resuelve el producto',
      liWhat: [
        '<strong>Visibilidad</strong> — Métricas, diagrama de flujo y operaciones sin montar tu propio stack de monitorización genérico.',
        '<strong>Acción</strong> — Reglas que corrigen o enrutan eventos problemáticos; lo que no se puede sanar va a <strong>Dead Letter</strong> para revisión humana.',
        '<strong>Integración</strong> — API REST y webhooks de ingesta documentados; el backend desplegado (p. ej. Cloudflare Worker) escala con el servicio.',
      ],
      hFlow: 'Flujo general en el panel',
      liFlow: [
        '<strong>Monitor</strong> — En el <strong>Dashboard</strong> ves métricas, el diagrama de flujo y eventos recientes.',
        '<strong>Conectar datos</strong> — En <strong>Flujos</strong> definís endpoints y la URL de webhook por tenant.',
        '<strong>Operaciones</strong> — En <strong>Operaciones</strong> revisás dependencias, historial IA y métricas de pipeline.',
        '<strong>Reglas IA</strong> — Gestionás reglas de reparación (aprobar, editar o eliminar).',
        '<strong>Incidentes</strong> — Lo que no se sanó automáticamente aparece en <strong>Dead Letter</strong> para reintento o descarte.',
        '<strong>Alertas</strong> — <strong>Notificaciones</strong> en el panel (Realtime) y canales configurables en <strong>Configuración</strong> (email, Slack, webhook firmado).',
        '<strong>Plan</strong> — <strong>Facturación</strong> resume tu plan SaaS y el roadmap de pagos.',
      ],
      hStack: 'Stack resumido',
      pStack:
        'El frontend (Next.js) usa autenticación <strong>Supabase</strong> y llama al <strong>API del producto</strong> con JWT. Las variables públicas (<code>NEXT_PUBLIC_*</code>) y la URL del API se configuran por entorno (local o Vercel). Guía paso a paso en <a href="/docs/empezar">Primeros pasos</a>.',
    },
    empezar: {
      metaTitle: 'Primeros pasos',
      metaDesc: 'Alta en el SaaS, variables de entorno, Supabase, API y despliegue de Primary Sentinel.',
      title: 'Primeros pasos',
      p1:
        'Primary Sentinel se usa como <strong>servicio</strong>: creás una cuenta (email/contraseña u OAuth), obtenés un <strong>tenant</strong> implícito ligado a tu usuario de Supabase, y el panel habla con el backend desplegado que expone la API REST. En desarrollo, corrés el frontend y apuntás al Worker local o a un entorno compartido.',
      h1: '1. Instalar dependencias',
      pInstall: 'Para contribuir o ejecutar el panel en local, en el directorio del frontend:',
      h2: '2. Variables de entorno',
      pEnv:
        'Copiá <code>.env.example</code> a <code>.env.local</code> y completá los valores reales (sin placeholders). Las claves <code>NEXT_PUBLIC_*</code> se inyectan en el bundle del cliente: usá solo la clave <strong>anon</strong> de Supabase, nunca <code>service_role</code>.',
      pEnvExample: 'Ejemplo de contenido:',
      h3: '3. Arrancar en local',
      h4: '4. Cuenta e inicio de sesión',
      pAuth:
        'Tras abrir el sitio, si no hay sesión se redirige a <code>/auth</code>. Podés registrarte con email y contraseña o con el proveedor OAuth configurado en Supabase (p. ej. Google). Con un login correcto accedés al <a href="/dashboard">panel</a> (<code>/dashboard</code>), donde todas las rutas API llevan tu JWT y el backend resuelve el <strong>tenant</strong>.',
      pAuthFail:
        'Si el login falla, revisá <code>NEXT_PUBLIC_SUPABASE_URL</code> y <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, y reiniciá el servidor de desarrollo tras cambiar <code>.env.local</code>.',
      h5: '5. Producción (Vercel u otro host)',
      pProd:
        'Definí las mismas variables <code>NEXT_PUBLIC_*</code> en el panel del proveedor (p. ej. Vercel). <code>NEXT_PUBLIC_API_URL</code> debe apuntar al Worker o API en producción. Configurá también <code>NEXT_PUBLIC_SITE_URL</code> si usás OAuth, alineado con las URL permitidas en Supabase y con <code>ALLOWED_ORIGINS</code> / CORS en el backend.',
      codeInstall: 'npm install',
      codeCpEnv: 'cp .env.example .env.local',
      codeEnvExample: `# Supabase — Settings / API (clave anon / public)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# URL pública del sitio (producción: mismo origen que en Supabase Redirect URLs)
# NEXT_PUBLIC_SITE_URL=https://tu-app.vercel.app

# Backend del SaaS (Worker local o URL desplegada)
NEXT_PUBLIC_API_URL=http://localhost:8787`,
      codeDev: `npm run dev
# Luego abrí http://localhost:3000 en el navegador`,
    },
    dashboard: {
      metaTitle: 'Dashboard',
      metaDesc: 'Vista principal del tenant en Primary Sentinel: métricas, flujo y actividad.',
      title: 'Dashboard',
      p1:
        '<code>/dashboard</code> es la entrada al producto tras iniciar sesión. Resume el estado de <strong>tu</strong> cuenta SaaS (métricas del día, DLQ, reglas y actividad) antes de profundizar en flujos, operaciones o incidentes.',
      hMetrics: 'Tarjetas de métricas',
      pMetrics:
        'Indicadores como eventos del día, reglas sanadas o pendientes, volumen en Dead Letter y una tasa de sanación aproximada. Sirven para un control rápido de salud del tenant.',
      hDiagram: 'Diagrama de flujo',
      pDiagram:
        'Relaciona tus <strong>endpoints</strong> con el flujo de eventos y el estado de los nodos. Es la vista “mapa” antes de abrir <a href="/docs/flujos">Flujos</a> o <a href="/docs/operaciones">Operaciones</a>.',
      hRecent: 'Eventos recientes',
      pRecent: 'Listado compacto de última actividad. Para inspección por endpoint o pruebas de webhook, usá la sección Flujos.',
      hActivity: 'Gráfico de actividad y agente',
      pActivity: 'Evolución temporal de eventos y un bloque de estado del agente de reglas IA asociado a tus pipelines.',
    },
    flujos: {
      metaTitle: 'Flujos',
      metaDesc: 'Endpoints, webhooks de ingesta por tenant y pruebas en Primary Sentinel.',
      title: 'Flujos',
      p1:
        'En <code>/dashboard/flows</code> administrás los <strong>endpoints</strong> del SaaS: cada uno pertenece a tu <strong>tenant</strong> y tiene metadatos, esquema, destinos y una <strong>URL de webhook</strong> que tus sistemas invocan para enviar eventos (prueba o producción).',
      hCreate: 'Crear y editar endpoints',
      pCreate:
        'Los cambios quedan persistidos en el backend multi-tenant; el panel usa el JWT de sesión para que solo veas y modifiques recursos de tu cuenta.',
      hWebhook: 'Webhook de ingesta',
      pWebhook:
        'El backend expone <code>POST /webhook/:tenantId/:slug</code>. El <code>tenantId</code> coincide con el identificador de usuario/tenant que mostramos en <a href="/docs/configuracion">Configuración</a>. Las llamadas al API REST autenticado usan <code>Authorization: Bearer &lt;JWT&gt;</code> (ver <a href="/docs/api">API y webhooks</a>).',
      hEvents: 'Eventos por endpoint',
      pEvents:
        'Podés listar y revisar eventos asociados a un endpoint para depurar integraciones antes de que actúen las reglas IA o terminen en DLQ.',
    },
    operaciones: {
      metaTitle: 'Operaciones',
      metaDesc:
        'Mapa de dependencias, historial IA, métricas de pipeline y sugerencias heurísticas en Primary Sentinel.',
      title: 'Operaciones',
      p1Before: 'La vista <code>/dashboard/operations</code> está pensada para <strong>operadores</strong> del SaaS: resume cómo se conectan tus endpoints con destinos, qué decisiones tomó el motor de IA recientemente y cómo evolucionan las métricas por etapa (Worker',
      p1After:
        'Supabase). Los datos son <strong>por tenant</strong>: solo ves lo asociado a tu cuenta.',
      hMap: 'Mapa endpoint → destinos',
      pMap:
        'Muestra nodos (tus pipelines) y aristas que relacionan orígenes con destinos. Sirve para entender el grafo de dependencias sin abrir cada flujo por separado. Si aún no creaste endpoints, verás un estado vacío hasta que configures <a href="/docs/flujos">Flujos</a>.',
      hAi: 'Historial de decisiones IA',
      pAi:
        'Lista eventos recientes del historial de razonamiento o acciones automáticas, acotado en tiempo. Complementa el detalle que más adelante podés ver en reglas o en eventos concretos.',
      hMetrics: 'Métricas de pipeline',
      pMetrics:
        'Serie temporal de métricas por ventana de horas (por defecto un rango amplio) para detectar picos, caídas o estancamiento. El backend agrega datos; la UI las presenta de forma compacta.',
      hSuggest: 'Sugerencias heurísticas',
      pSuggest:
        'El API puede devolver sugerencias basadas en muestras recientes (severidad + texto). Son orientativas para priorizar mejoras de esquema, reglas o conectividad, no sustituyen el juicio del equipo.',
      hApi: 'API relacionada',
      pApi:
        'Las rutas usadas por esta pantalla incluyen <code>GET /api/operations/dependency-graph</code>, <code>GET /api/operations/ai-history</code>, <code>GET /api/metrics/pipeline</code> y <code>GET /api/suggestions/heuristics</code>. Requieren JWT de sesión; detalle en <a href="/docs/api">API y webhooks</a>.',
    },
    reglas: {
      metaTitle: 'Reglas IA',
      metaDesc: 'Reglas de reparación por tenant en Primary Sentinel SaaS.',
      title: 'Reglas IA',
      p1:
        'En <code>/dashboard/rules</code> gestionás las <strong>reglas de transformación / reparación</strong> del producto. El motor puede proponer reglas a partir del análisis de eventos; vos las revisás en el contexto de tu <strong>tenant</strong> antes de activarlas en producción.',
      hState: 'Estados',
      pState:
        'Las reglas pueden mostrarse como pendientes de aprobación, activas u otros estados según el backend. El panel usa píldoras de color coherentes con el resto del SaaS para identificar el estado de un vistazo.',
      hApprove: 'Aprobar y editar',
      pApprove:
        'Podés revisar el contenido sugerido, aprobar para que entre en vigor o ajustar condiciones y acciones antes de activar. Todo queda acotado a tu organización en el modelo multi-tenant.',
      hDelete: 'Eliminar',
      pDelete:
        'Las reglas obsoletas o erróneas se pueden eliminar desde el gestor; suelen pedirse confirmaciones para evitar borrados accidentales.',
    },
    dlq: {
      metaTitle: 'Dead Letter',
      metaDesc: 'Cola DLQ por tenant, reinyección, snapshots y descarte en Primary Sentinel.',
      title: 'Dead Letter Queue',
      p1:
        '<code>/dashboard/dlq</code> lista los eventos que el sistema <strong>no pudo sanar</strong> de forma automática. Es la cola de revisión humana del SaaS: inspeccionás el payload, el motivo del fallo y, cuando el backend lo permite, podés <strong>reinyectar</strong> el evento o <strong>descartarlo</strong>. Solo ves ítems de tu tenant.',
      hWhen: 'Cuándo aparece un ítem',
      pWhen:
        'Suelen ser errores recurrentes, datos fuera de esquema o situaciones no cubiertas por las reglas actuales. Es el lugar para priorizar mejoras de reglas o correcciones en los productores upstream.',
      hReinject: 'Reinyección y snapshots',
      pReinject:
        'La API expone reinyección con payload corregido opcional (<code>POST /api/dlq/:id/reinject</code>), listado de snapshots por evento y comparación entre versiones para auditoría. El comportamiento exacto depende de la versión desplegada del Worker.',
      hDiscard: 'Descarte',
      pDiscard:
        'Podés eliminar un registro DLQ cuando decidís no reprocesarlo (<code>DELETE /api/dlq/:id</code>), de acuerdo con las políticas de retención del backend.',
    },
    notificaciones: {
      metaTitle: 'Notificaciones',
      metaDesc: 'Centro de notificaciones en el panel y canales del tenant en Primary Sentinel.',
      title: 'Notificaciones en el panel',
      p1:
        'La ruta <code>/dashboard/notifications</code> concentra alertas <strong>en tiempo real</strong> dentro del producto. El frontend se suscribe a la tabla <code>notifications</code> en Supabase mediante <strong>Realtime</strong>, de modo que los avisos aparecen sin recargar cuando el backend inserta filas para tu <strong>tenant</strong>.',
      hBackend: 'Qué debe hacer el backend',
      pBackend:
        'La API del SaaS debe insertar filas en <code>notifications</code> ante hitos relevantes (reglas, sanaciones, casos irrecuperables, etc.). El <code>tenant_id</code> debe alinearse con el usuario autenticado para que las políticas <strong>RLS</strong> solo entreguen las notificaciones propias.',
      hSchema: 'Esquema sugerido (SQL)',
      pAfterSchema:
        'Los tipos pueden extenderse si el producto lo requiere; mantené coherencia con lo que el panel muestra.',
      hChannels: 'Email, Slack y webhooks',
      pChannels:
        'Además del centro en pantalla, podés activar <strong>Resend</strong>, <strong>Slack</strong> y un <strong>webhook de alertas firmado</strong> desde <a href="/docs/configuracion">Configuración</a>, para llevar el mismo tipo de incidentes a los canales de tu equipo.',
    },
    configuracion: {
      metaTitle: 'Configuración',
      metaDesc: 'Cuenta SaaS, tenant, notificaciones e infraestructura en Primary Sentinel.',
      title: 'Configuración',
      p1:
        '<code>/dashboard/settings</code> agrupa la <strong>cuenta del tenant</strong>, preferencias de notificación e información de infraestructura del servicio. Los cambios sensibles se guardan vía API autenticada (<code>PUT /api/settings</code>).',
      hAccount: 'Cuenta y plan',
      pAccount:
        'Ves tu email, el <strong>Tenant ID</strong> (útil para componer URLs de webhook de ingesta) y el <strong>plan</strong> actual del SaaS. El plan free incluye límites en API (p. ej. pipelines activos); más detalle en <a href="/docs/facturacion">Facturación</a>.',
      hNotif: 'Notificaciones: Resend, Slack y webhook firmado',
      pNotif:
        'Podés activar envío por <strong>email</strong> (reparaciones, DLQ, reglas pendientes), un <strong>Incoming Webhook de Slack</strong> para resúmenes de incidente, y un <strong>webhook HTTPS propio</strong> con firma <code>HMAC-SHA256</code> en la cabecera <code>X-Sentinel-Signature</code> (secreto compartido configurable). Son canales paralelos al centro de notificaciones en el panel.',
      hInfra: 'Infraestructura (referencia)',
      pInfra:
        'La pantalla resume el origen del <strong>API</strong> (URL del Worker), y el stack típico del producto: Supabase (Postgres), cache (p. ej. Redis/Upstash), almacenamiento para DLQ (p. ej. R2) y email (Resend). Es informativo para soporte y transparencia operativa; no sustituye el panel del proveedor cloud.',
      hEnv: 'Variables de entorno del frontend',
      pEnv:
        'Las claves públicas (<code>NEXT_PUBLIC_*</code>) se definen en build o en Vercel; no se editan desde esta pantalla. Para desarrollo local usá <code>.env.local</code> como en <a href="/docs/empezar">Primeros pasos</a>.',
    },
    facturacion: {
      metaTitle: 'Facturación',
      metaDesc: 'Planes, límites del plan free y roadmap de pagos en Primary Sentinel SaaS.',
      title: 'Facturación y planes',
      p1:
        'Primary Sentinel es un <strong>producto SaaS multi-tenant</strong>: cada organización o equipo trabaja en su propio espacio aislado (tenant), con límites y facturación asociados al plan contratado.',
      hScreen: 'Pantalla Facturación',
      pScreen:
        'En <code>/dashboard/billing</code> ves el <strong>plan actual</strong> y notas que devuelve el backend (por ejemplo estado del proveedor de pagos o mensajes operativos). Desde ahí podés volver a <a href="/docs/configuracion">Configuración</a> para revisar el mismo plan en el resumen de cuenta.',
      hFree: 'Plan free y límites',
      pFree:
        'En la fase actual, el plan gratuito aplica <strong>límites en la API</strong> (por ejemplo un número acotado de pipelines activos). Los límites concretos pueden evolucionar; la pantalla de configuración y la respuesta del API de facturación reflejan lo que aplica a tu tenant.',
      hRoadmap: 'Roadmap: Stripe y portal de cliente',
      pRoadmap:
        'La integración con <strong>Stripe</strong> y un <strong>portal de cliente</strong> para cambiar plan, método de pago y facturas está prevista en el roadmap del producto. Hasta entonces, los upgrades o acuerdos enterprise se gestionan fuera de la app o con el equipo de Primary Sentinel.',
      hApi: 'API',
      pApi:
        'El estado de facturación expuesto al panel proviene de <code>GET /api/billing/status</code> (autenticado). Más detalle en <a href="/docs/api">API y webhooks</a>.',
    },
    api: {
      metaTitle: 'API y webhooks',
      metaDesc: 'Autenticación JWT, rutas REST del SaaS Primary Sentinel y webhooks de ingesta.',
      title: 'API y webhooks',
      p1:
        'El panel es un cliente del <strong>API del producto</strong> (p. ej. Cloudflare Worker). Las peticiones autenticadas envían el <strong>JWT de sesión de Supabase</strong> en <code>Authorization: Bearer &lt;token&gt;</code>; el backend valida el usuario y aplica el aislamiento por <strong>tenant</strong>. Las rutas públicas de ingesta por webhook no usan ese JWT (usan el path con <code>tenantId</code> y el slug del endpoint).',
      hClient: 'Cliente en el código',
      pClient:
        'La capa HTTP está centralizada en <code>src/lib/api.ts</code>: ahí conviene mantener paths, reintentos y cabeceras para no duplicar lógica en los componentes.',
      hRest: 'Endpoints habituales (REST)',
      pRest: 'Patrones expuestos por el Worker (prefijo según tu despliegue de <code>NEXT_PUBLIC_API_URL</code>):',
      thMethod: 'Método',
      thPath: 'Ruta',
      thUse: 'Uso',
      rows: [
        { method: 'POST', path: '/api/endpoints', use: 'Crear endpoint' },
        { method: 'PATCH', path: '/api/endpoints/:id', use: 'Actualizar endpoint' },
        { method: 'DELETE', path: '/api/endpoints/:id', use: 'Eliminar endpoint' },
        { method: 'GET', path: '/api/endpoints', use: 'Listar endpoints del tenant' },
        { method: 'GET', path: '/api/endpoints/:id/events', use: 'Eventos del endpoint' },
        { method: 'GET', path: '/api/endpoints/:id/rules', use: 'Reglas IA del endpoint' },
        { method: 'PATCH', path: '/api/endpoints/:endpointId/rules/:ruleId', use: 'Actualizar regla' },
        { method: 'DELETE', path: '/api/endpoints/:endpointId/rules/:ruleId', use: 'Eliminar regla' },
        { method: 'GET', path: '/api/dlq', use: 'Listar Dead Letter' },
        { method: 'POST', path: '/api/dlq/:id/reinject', use: 'Reinyectar evento DLQ' },
        { method: 'DELETE', path: '/api/dlq/:id', use: 'Descartar ítem DLQ' },
        { method: 'GET', path: '/api/dlq/:eventId/snapshots', use: 'Snapshots de un evento' },
        { method: 'GET', path: '/api/settings', use: 'Preferencias del tenant' },
        { method: 'PUT', path: '/api/settings', use: 'Guardar preferencias' },
        { method: 'GET', path: '/api/billing/status', use: 'Plan y notas de facturación' },
        { method: 'GET', path: '/api/operations/dependency-graph', use: 'Mapa endpoint → destinos' },
        { method: 'GET', path: '/api/operations/ai-history', use: 'Historial de decisiones IA' },
        { method: 'GET', path: '/api/metrics/pipeline', use: 'Métricas de pipeline (query hours)' },
        { method: 'GET', path: '/api/suggestions/heuristics', use: 'Sugerencias heurísticas' },
        { method: 'GET', path: '/api/public/slo', use: 'SLO público (sin JWT)' },
      ],
      hWebhook: 'Webhook de ingesta',
      pWebhookIngest: 'Ingesta de eventos (cuerpo JSON)',
      hCors: 'Base URL y CORS',
      pCors:
        'La URL base la define <code>NEXT_PUBLIC_API_URL</code> en cada entorno. El backend debe permitir el origen del frontend (p. ej. tu dominio Vercel) en la configuración CORS / <code>ALLOWED_ORIGINS</code>.',
    },
  },
} as const;
