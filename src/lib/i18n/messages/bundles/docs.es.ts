/** Documentación — español */
export const docsEs = {
  layoutTitle: 'Documentación',
  layoutDescription:
    'Guía del producto SaaS Primary Sentinel: cuenta multi-tenant, panel, operaciones, DLQ, planes e integración API.',
  layoutOgTitle: 'Documentación — Primary Sentinel',
  layoutOgDescription:
    'SaaS de observabilidad e inteligencia autónoma de fiabilidad y seguridad sobre ingesta y cargas de trabajo: documentación para equipos y administradores de tenant.',
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
        'Primary Sentinel como SaaS: multi-tenant, observabilidad de endpoints y cargas de trabajo e inteligencia autónoma de fiabilidad y seguridad asistida por IA.',
      title: 'Introducción',
      p1:
        '<strong>Primary Sentinel</strong> es un <strong>SaaS</strong> para equipos que necesitan <strong>observabilidad y gobierno</strong> sobre ingesta por webhooks y destinos: reglas de reparación asistidas por IA, colas de incidentes y alertas. Cada cliente trabaja en su propio <strong>tenant</strong> (aislamiento lógico de datos y configuración); el panel y la API aplican esos límites según tu sesión y permisos de cuenta.',
      hWhat: 'Qué resuelve el producto',
      liWhat: [
        '<strong>Visibilidad</strong> — Métricas, diagrama de flujo y operaciones sin montar tu propio stack de monitorización genérico.',
        '<strong>Acción</strong> — Reglas que corrigen o enrutan eventos problemáticos; lo que no se puede sanar va a <strong>Dead Letter</strong> para revisión humana.',
        '<strong>Integración</strong> — API REST y webhooks de ingesta documentados; el servicio escala con tu volumen de eventos.',
      ],
      hFlow: 'Flujo general en el panel',
      liFlow: [
        '<strong>Monitor</strong> — En el <strong>Dashboard</strong> ves métricas, el diagrama de flujo y eventos recientes.',
        '<strong>Conectar datos</strong> — En <strong>Flujos</strong> definís endpoints y la URL de webhook por tenant.',
        '<strong>Operaciones</strong> — En <strong>Operaciones</strong> revisás dependencias, historial IA y métricas por etapa.',
        '<strong>Reglas IA</strong> — Gestionás reglas de reparación (aprobar, editar o eliminar).',
        '<strong>Incidentes</strong> — Lo que no se sanó automáticamente aparece en <strong>Dead Letter</strong> para reintento o descarte.',
        '<strong>Alertas</strong> — <strong>Notificaciones</strong> en el panel en tiempo real y canales configurables en <strong>Configuración</strong> (email, Slack, webhook firmado).',
        '<strong>Plan</strong> — <strong>Facturación</strong> resume tu plan SaaS y el roadmap de pagos.',
      ],
      hStack: 'Documentación por tema',
      pStack:
        'Profundizá desde la propia app: <a href="/docs/empezar">Primeros pasos</a>, <a href="/docs/dashboard">Dashboard</a>, <a href="/docs/flujos">Flujos</a>, <a href="/docs/operaciones">Operaciones</a>, <a href="/docs/reglas">Reglas IA</a>, <a href="/docs/dlq">Dead Letter</a>, <a href="/docs/notificaciones">Notificaciones</a>, <a href="/docs/configuracion">Configuración</a>, <a href="/docs/facturacion">Facturación</a> e <a href="/docs/api">API y webhooks</a>. No necesitás conocer el stack interno para operar el producto.',
    },
    empezar: {
      metaTitle: 'Primeros pasos',
      metaDesc: 'Alta en el SaaS, primer acceso al panel y mapa de la documentación en la app.',
      title: 'Primeros pasos',
      p1:
        'Primary Sentinel es un <strong>servicio en la nube</strong>: creás tu cuenta (email/contraseña u OAuth), obtenés un espacio aislado para tu organización (<strong>tenant</strong>) y el panel te guía para conectar datos, revisar operaciones y gestionar incidentes. No necesitás instalar software para usar el producto.',
      hExplore: 'Documentación por tema en la app',
      pExplore:
        'Cada guía vive bajo <code>/docs/…</code>. Podés abrir directamente: <a href="/docs">introducción</a> (<code>/docs</code>), <a href="/docs/dashboard">panel principal</a> (<code>/docs/dashboard</code>), <a href="/docs/flujos">flujos y webhooks</a> (<code>/docs/flujos</code>), <a href="/docs/operaciones">operaciones</a> (<code>/docs/operaciones</code>), <a href="/docs/reglas">reglas IA</a> (<code>/docs/reglas</code>), <a href="/docs/dlq">Dead Letter</a> (<code>/docs/dlq</code>), <a href="/docs/notificaciones">notificaciones</a> (<code>/docs/notificaciones</code>), <a href="/docs/configuracion">configuración</a> (<code>/docs/configuracion</code>), <a href="/docs/facturacion">facturación</a> (<code>/docs/facturacion</code>) e <a href="/docs/api">API y webhooks</a> (<code>/docs/api</code>).',
      hSignIn: 'Cuenta e inicio de sesión',
      pAuth:
        'Si no hay sesión activa, la app te lleva a <code>/auth</code>. Tras iniciar sesión accedés al <a href="/dashboard">panel</a> (<code>/dashboard</code>), donde todo lo que ves queda acotado a tu <strong>tenant</strong>.',
      pAuthHelp:
        'Si no podés entrar, verificá credenciales y el flujo de recuperación de acceso. Para integraciones técnicas seguí con <a href="/docs/api">API y webhooks</a> y <a href="/docs/flujos">Flujos</a>; si el problema persiste, contactá a soporte.',
      hSupport: 'Instalación o entorno propio',
      pSupport:
        'El aprovisionamiento de entornos, claves y despliegues lo maneja tu organización o acuerdos con Primary Sentinel; esos detalles no forman parte de la documentación pública del producto.',
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
      pActivity: 'Evolución temporal de eventos y un bloque de estado del agente de reglas IA asociado a tus endpoints.',
    },
    flujos: {
      metaTitle: 'Flujos',
      metaDesc: 'Endpoints, webhooks de ingesta por tenant y pruebas en Primary Sentinel.',
      title: 'Flujos',
      p1:
        'En <code>/dashboard/flows</code> administrás los <strong>endpoints</strong> del SaaS: cada uno pertenece a tu <strong>tenant</strong> y tiene metadatos, esquema, destinos y una <strong>URL de webhook</strong> que tus sistemas invocan para enviar eventos (prueba o producción).',
      hCreate: 'Crear y editar endpoints',
      pCreate:
        'Los cambios quedan persistidos en el backend multi-tenant; con tu sesión activa solo ves y modificás recursos de tu cuenta.',
      hWebhook: 'Webhook de ingesta',
      pWebhook:
        'El servicio expone <code>POST /webhook/:tenantId/:slug</code>. El <code>tenantId</code> coincide con el identificador que mostramos en <a href="/docs/configuracion">Configuración</a>. Las llamadas al API REST autenticado envían un token de sesión en <code>Authorization: Bearer …</code> (ver <a href="/docs/api">API y webhooks</a>).',
      hEvents: 'Eventos por endpoint',
      pEvents:
        'Podés listar y revisar eventos asociados a un endpoint para depurar integraciones antes de que actúen las reglas IA o terminen en DLQ.',
    },
    operaciones: {
      metaTitle: 'Operaciones',
      metaDesc:
        'Mapa de dependencias, historial IA, métricas por etapa y sugerencias heurísticas en Primary Sentinel.',
      title: 'Operaciones',
      p1:
        'La vista <code>/dashboard/operations</code> está pensada para <strong>operadores</strong> del SaaS: resume cómo se conectan tus endpoints con destinos, qué decisiones tomó el motor de IA recientemente y cómo evolucionan las métricas por etapa. Los datos son <strong>por tenant</strong>: solo ves lo asociado a tu cuenta.',
      hMap: 'Mapa endpoint → destinos',
      pMap:
        'Muestra nodos (tus endpoints) y aristas que relacionan orígenes con destinos. Sirve para entender el grafo de dependencias sin abrir cada flujo por separado. Si aún no creaste endpoints, verás un estado vacío hasta que configures <a href="/docs/flujos">Flujos</a>.',
      hAi: 'Historial de decisiones IA',
      pAi:
        'Lista eventos recientes del historial de razonamiento o acciones automáticas, acotado en tiempo. Complementa el detalle que más adelante podés ver en reglas o en eventos concretos.',
      hMetrics: 'Métricas por etapa',
      pMetrics:
        'Serie temporal de métricas por ventana de horas (por defecto un rango amplio) para detectar picos, caídas o estancamiento. El backend agrega datos; la UI las presenta de forma compacta.',
      hSuggest: 'Sugerencias heurísticas',
      pSuggest:
        'El API puede devolver sugerencias basadas en muestras recientes (severidad + texto). Son orientativas para priorizar mejoras de esquema, reglas o conectividad, no sustituyen el juicio del equipo.',
      hApi: 'API relacionada',
      pApi:
        'Las rutas usadas por esta pantalla incluyen <code>GET /api/operations/dependency-graph</code>, <code>GET /api/operations/ai-history</code>, <code>GET /api/metrics/stages</code> y <code>GET /api/suggestions/heuristics</code>. Requieren sesión autenticada; detalle en <a href="/docs/api">API y webhooks</a>.',
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
        'La API expone reinyección con payload corregido opcional (<code>POST /api/dlq/:id/reinject</code>), listado de snapshots por evento y comparación entre versiones para auditoría. El comportamiento exacto puede variar según la versión del servicio.',
      hDiscard: 'Descarte',
      pDiscard:
        'Podés eliminar un registro DLQ cuando decidís no reprocesarlo (<code>DELETE /api/dlq/:id</code>), de acuerdo con las políticas de retención del backend.',
    },
    notificaciones: {
      metaTitle: 'Notificaciones',
      metaDesc: 'Centro de notificaciones en el panel y canales del tenant en Primary Sentinel.',
      title: 'Notificaciones en el panel',
      p1:
        'La ruta <code>/dashboard/notifications</code> concentra alertas <strong>en tiempo real</strong> dentro del producto: los avisos aparecen sin recargar cuando el servicio registra novedades para tu <strong>tenant</strong>.',
      hBackend: 'Qué debe hacer el backend',
      pBackend:
        'El servicio debe registrar notificaciones ante hitos relevantes (reglas, sanaciones, casos irrecuperables, etc.), siempre asociadas al tenant correcto para que solo veas las tuyas.',
      hSchema: 'Contenido típico de una notificación',
      pSchema:
        'Suele incluir tipo de evento (p. ej. sanado, Dead Letter, regla nueva o pendiente), título, cuerpo opcional, marca de leído y marca de tiempo. Los valores concretos deben alinearse con lo que muestra el panel.',
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
        'Ves tu email, el <strong>Tenant ID</strong> (útil para componer URLs de webhook de ingesta) y el <strong>plan</strong> actual del SaaS. El plan free incluye límites en API (p. ej. endpoints activos); más detalle en <a href="/docs/facturacion">Facturación</a>.',
      hNotif: 'Notificaciones: Resend, Slack y webhook firmado',
      pNotif:
        'Podés activar envío por <strong>email</strong> (reparaciones, DLQ, reglas pendientes), un <strong>Incoming Webhook de Slack</strong> para resúmenes de incidente, y un <strong>webhook HTTPS propio</strong> con firma <code>HMAC-SHA256</code> en la cabecera <code>X-Sentinel-Signature</code> (secreto compartido configurable). Son canales paralelos al centro de notificaciones en el panel.',
      hInfra: 'Señales operativas',
      pInfra:
        'Podés ver un resumen orientativo del endpoint del API y otros datos útiles para soporte. Es información de contexto dentro del producto; no reemplaza la documentación contractual ni los detalles técnicos internos, que no se publican en estas guías.',
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
        'En la fase actual, el plan gratuito aplica <strong>límites en la API</strong> (por ejemplo un número acotado de endpoints activos). Los límites concretos pueden evolucionar; la pantalla de configuración y la respuesta del API de facturación reflejan lo que aplica a tu tenant.',
      hRoadmap: 'Roadmap: Stripe y portal de cliente',
      pRoadmap:
        'La integración con <strong>Stripe</strong> y un <strong>portal de cliente</strong> para cambiar plan, método de pago y facturas está prevista en el roadmap del producto. Hasta entonces, los upgrades o acuerdos enterprise se gestionan fuera de la app o con el equipo de Primary Sentinel.',
      hApi: 'API',
      pApi:
        'El estado de facturación expuesto al panel proviene de <code>GET /api/billing/status</code> (autenticado). Más detalle en <a href="/docs/api">API y webhooks</a>.',
    },
    api: {
      metaTitle: 'API y webhooks',
      metaDesc: 'Sesión autenticada, rutas REST del SaaS Primary Sentinel y webhooks de ingesta.',
      title: 'API y webhooks',
      p1:
        'El panel consume el <strong>API del producto</strong> con tu sesión iniciada. Las peticiones autenticadas envían un <strong>token de sesión</strong> en <code>Authorization: Bearer &lt;token&gt;</code>; el servicio valida el usuario y aplica el aislamiento por <strong>tenant</strong>. Los webhooks de ingesta no usan esa cabecera: identifican el tenant y el endpoint en la propia ruta.',
      hCliente: 'Buenas prácticas de integración',
      pClient:
        'Centralizá paths, reintentos y cabeceras en un único cliente HTTP en tu aplicación para evitar duplicar lógica y facilitar rotación de credenciales.',
      hRest: 'Endpoints habituales (REST)',
      pRest: 'Patrones habituales del API (la URL base es la del entorno Primary Sentinel que estés usando):',
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
        { method: 'GET', path: '/api/metrics/stages', use: 'Métricas por etapa (query hours)' },
        { method: 'GET', path: '/api/suggestions/heuristics', use: 'Sugerencias heurísticas' },
        { method: 'GET', path: '/api/public/slo', use: 'SLO público (sin sesión)' },
      ],
      hWebhook: 'Webhook de ingesta',
      pWebhookIngest: 'Ingesta de eventos (cuerpo JSON)',
      hCors: 'Base URL y CORS',
      pCors:
        'Usá HTTPS y la URL base que te proporcione tu administrador o el despliegue oficial. En integraciones servidor a servidor, acordá orígenes y políticas CORS con quien gestione el entorno.',
    },
  },
} as const;
