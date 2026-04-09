import Link from 'next/link';
import SentinelBrand from '@/components/SentinelBrand';
import { IconArrowRight } from '@/components/icons/Arrows';
import LandingPricing from '@/components/landing/LandingPricing';

const gridBg = {
  position: 'fixed' as const,
  inset: 0,
  opacity: 0.03,
  backgroundImage:
    'linear-gradient(var(--border2) 1px, transparent 1px), linear-gradient(90deg, var(--border2) 1px, transparent 1px)',
  backgroundSize: '40px 40px',
  pointerEvents: 'none' as const,
};

const sectionTitle = (kicker: string, title: string, subtitle?: string) => (
  <div style={{ textAlign: 'center', marginBottom: '36px', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
    <h2
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.14em',
        color: 'var(--accent)',
        marginBottom: '12px',
      }}
    >
      {kicker}
    </h2>
    <h3
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'clamp(1.35rem, 3vw, 1.75rem)',
        fontWeight: 600,
        letterSpacing: '-0.03em',
        lineHeight: 1.25,
        color: 'var(--text)',
        marginBottom: subtitle ? '12px' : 0,
      }}
    >
      {title}
    </h3>
    {subtitle ? (
      <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--muted)' }}>{subtitle}</p>
    ) : null}
  </div>
);

function HeroDashboardMock() {
  const rows = [
    { name: 'endpoint-ejemplo-a', status: 'ok', last: 'hace 2m', heal: '—' },
    { name: 'endpoint-ejemplo-b', status: 'warn', last: 'hace 14m', heal: 'retry #2' },
    { name: 'endpoint-ejemplo-c', status: 'ok', last: 'en vivo', heal: '—' },
    { name: 'endpoint-ejemplo-d', status: 'healed', last: 'hace 1h', heal: 'regla #7' },
  ];
  return (
    <div
      className="sentinel-card"
      style={{
        marginTop: '40px',
        padding: 0,
        overflow: 'hidden',
        maxWidth: '920px',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: '12px',
        boxShadow: '0 24px 80px rgba(0,0,0,.45)',
      }}
    >
      <div
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg2)',
        }}
      >
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginLeft: '8px' }}>
          primary-sentinel · pipelines
        </span>
      </div>
      <div style={{ overflow: 'auto' }}>
        <table className="sentinel-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>Pipeline</th>
              <th>Estado</th>
              <th>Última corrida</th>
              <th>IA / acción</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{r.name}</td>
                <td>
                  <span
                    className="pill"
                    style={{
                      fontSize: '9px',
                      ...(r.status === 'ok'
                        ? { background: 'rgba(20,184,166,.12)', color: 'var(--teal)', border: '1px solid rgba(20,184,166,.25)' }
                        : r.status === 'warn'
                          ? { background: 'rgba(245,158,11,.1)', color: 'var(--amber)', border: '1px solid rgba(245,158,11,.25)' }
                          : { background: 'rgba(200,245,80,.1)', color: 'var(--accent)', border: '1px solid rgba(200,245,80,.25)' }),
                    }}
                  >
                    {r.status === 'ok' ? 'OK' : r.status === 'warn' ? 'DEGRADED' : 'REPARADO'}
                  </span>
                </td>
                <td style={{ color: 'var(--muted)', fontSize: '11px' }}>{r.last}</td>
                <td style={{ color: 'var(--muted)', fontSize: '11px' }}>{r.heal}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: '9px', color: 'var(--muted)', padding: '8px 14px 12px', margin: 0, fontFamily: 'var(--font-mono)' }}>
          Vista ilustrativa · En el panel autenticado verás tus endpoints y eventos reales.
        </p>
      </div>
    </div>
  );
}

const faqItems: { q: string; a: string }[] = [
  {
    q: '¿Qué es un “pipeline” en Primary Sentinel?',
    a: 'Es un flujo de datos configurable (origen, transformaciones y destino) que el sistema observa de punta a punta y puede intentar reparar cuando falla.',
  },
  {
    q: '¿La IA aplica cambios sin mi aprobación?',
    a: 'Podés empezar en modo sugerencias y pasar a acciones automáticas por pipeline o por tipo de error, con reglas y umbrales de confianza.',
  },
  {
    q: '¿Se integra con mi stack actual?',
    a: 'Soportamos conectores habituales (bases, colas, APIs) y añadimos nuevos según plan. En Empresa evaluamos integraciones a medida.',
  },
  {
    q: '¿Dónde se alojan los datos?',
    a: 'El panel y la metadata operativa viven en nuestra infraestructura; los datos sensibles pueden quedar en tu nube según configuración y plan.',
  },
  {
    q: '¿Hay período de prueba?',
    a: 'El plan Básico es gratuito con límites para validar el flujo. Profesional y Empresa incluyen onboarding según contratación.',
  },
  {
    q: '¿Cómo cancelo o cambio de plan?',
    a: 'Desde facturación en el panel o escribiendo a soporte. Los cambios de plan se prorratean según condiciones del momento.',
  },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
      <div style={gridBg} aria-hidden />

      <header
        style={{
          position: 'relative',
          zIndex: 1,
          borderBottom: '1px solid var(--border)',
          background: 'rgba(10, 11, 13, 0.85)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <SentinelBrand variant="landing" />
          </Link>
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            {[
              ['#producto', 'Producto'],
              ['#features', 'Capacidades'],
              ['#pricing', 'Precios'],
              ['#faq', 'FAQ'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--muted)',
                  textDecoration: 'none',
                  padding: '6px 10px',
                }}
              >
                {label}
              </a>
            ))}
            <Link href="/auth" className="btn-ghost" style={{ textDecoration: 'none', fontSize: '11px' }}>
              Iniciar sesión
            </Link>
          </nav>
        </div>
      </header>

      <main className="fade-up" style={{ position: 'relative', zIndex: 1 }}>
        <section
          id="producto"
          style={{
            maxWidth: '1040px',
            margin: '0 auto',
            padding: '72px 20px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <span className="pill pill-active" style={{ fontSize: '9px' }}>
              AUTO-HEALING AI PIPELINE
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(1.85rem, 4.5vw, 2.5rem)',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '16px',
              color: 'var(--text)',
              maxWidth: '720px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Monitoreá y repará tus pipelines con IA
          </h1>
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.65,
              color: 'var(--muted)',
              marginBottom: '28px',
              maxWidth: '560px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Primary Sentinel detecta fallos, propone correcciones y mantiene tus datos en marcha. Un solo panel para
            observabilidad y recuperación automática.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            <Link href="/auth" className="btn-primary" style={{ textDecoration: 'none', padding: '12px 22px' }}>
              Comenzar
            </Link>
            <a
              href="#features"
              className="btn-ghost"
              style={{ textDecoration: 'none', padding: '12px 22px', fontSize: '11px' }}
            >
              Ver capacidades
            </a>
          </div>
          <HeroDashboardMock />
        </section>

        {/* Métricas */}
        <section style={{ maxWidth: '1040px', margin: '0 auto', padding: '32px 20px 48px' }}>
          <div
            className="sentinel-card"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              padding: '28px 24px',
              textAlign: 'center',
            }}
          >
            {[
              { v: '99.95%', l: 'objetivo de disponibilidad del panel' },
              { v: '< 2 min', l: 'tiempo medio a primera alerta útil' },
              { v: 'IA + reglas', l: 'reparación guiada o automática' },
            ].map((m) => (
              <div key={m.l}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>
                  {m.v}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px', lineHeight: 1.45 }}>{m.l}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '10px', color: 'var(--muted)', marginTop: '12px', fontFamily: 'var(--font-mono)' }}>
            Cifras como objetivo de producto (beta) hasta publicar SLO medidos — ver <code style={{ fontSize: '10px' }}>/api/public/slo</code>.
          </p>
        </section>

        {/* Logo cloud */}
        <section style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 20px 56px' }}>
          {sectionTitle(
            'CONFIANZA',
            'Equipos que necesitan datos en producción, sin apagar el teléfono',
            'Logística, fintech, retail y SaaS B2B usan patrones similares: muchos orígenes, poco margen de error.',
          )}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '12px',
              opacity: 0.85,
            }}
          >
            {['Ejemplo sector A', 'Ejemplo sector B', 'Ejemplo sector C'].map((name) => (
              <div
                key={name}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--muted)',
                  padding: '10px 16px',
                  border: '1px solid var(--border2)',
                  borderRadius: '8px',
                  background: 'var(--bg2)',
                }}
              >
                {name}
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '10px', color: 'var(--muted)', marginTop: '14px', fontFamily: 'var(--font-mono)' }}>
            Marcas de ejemplo — sustituir por logos con acuerdo comercial (Fase 10 roadmap).
          </p>
        </section>

        {/* Capacidades: flujo 1–4 (antes “pilares” demasiado abstractos) */}
        <section
          id="features"
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '0 20px 64px',
          }}
        >
          {sectionTitle(
            'CUATRO PASOS',
            'Del incidente a la recuperación, en orden',
            'No son conceptos sueltos: es la secuencia que seguís cuando algo se rompe o tenés que tocar el esquema — registrar, coordinar, avisar y volver a ejecutar con control.',
          )}
          <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
            {/* 1 — Contexto humano */}
            <div className="sentinel-card" style={{ padding: '22px', minHeight: '220px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', fontWeight: 700 }}>PASO 1</span>
                <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Para el próximo turno</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>
                Registrá qué pasó en el incidente
              </h3>
              <p style={{ fontSize: '12px', lineHeight: 1.55, color: 'var(--muted)', marginBottom: '14px', flex: 1 }}>
                Cada fallo queda con notas: qué probaste, qué quedó pendiente y quién decidió. Así la persona que entra después no repite los mismos intentos.
              </p>
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '8px' }}>Tipos de problema que podés etiquetar:</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { t: 'Cola muerta', hint: 'mensajes atascados' },
                  { t: 'Reintentos', hint: 'backoff / reproceso' },
                  { t: 'Esquema', hint: 'columnas / tipos' },
                ].map((item, i) => (
                  <div
                    key={item.t}
                    title={item.hint}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      transform: `rotate(${i % 2 === 0 ? -1 : 0.8}deg)`,
                      background: i === 0 ? 'rgba(200,245,80,.12)' : i === 1 ? 'rgba(59,130,246,.12)' : 'rgba(245,158,11,.1)',
                      border: '1px solid var(--border2)',
                      color: 'var(--text)',
                    }}
                  >
                    {item.t}
                  </div>
                ))}
              </div>
            </div>

            {/* 2 — Ventanas */}
            <div className="sentinel-card" style={{ padding: '22px', minHeight: '220px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', fontWeight: 700 }}>PASO 2</span>
                <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Antes de tocar producción</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>
                Coordiná cambios con una ventana clara
              </h3>
              <p style={{ fontSize: '12px', lineHeight: 1.55, color: 'var(--muted)', marginBottom: '14px', flex: 1 }}>
                Los “contratos de datos” acá significan: acordás cuándo y cómo cambia una tabla o una API. Definís{' '}
                <strong style={{ color: 'var(--text)', fontWeight: 600 }}>ventana de mantenimiento</strong> y avisos, para que los jobs no choquen con un despliegue sorpresa.
              </p>
              <div style={{ background: 'var(--bg2)', borderRadius: '8px', padding: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '9px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                  EJEMPLO · VENTANA APROBADA
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text)', marginBottom: '10px', fontFamily: 'var(--font-mono)' }}>
                  Sáb 02:00–04:00 · cambio de esquema + verificación
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: 'var(--border2)', marginBottom: '8px', position: 'relative', overflow: 'hidden' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      width: '42%',
                      height: '100%',
                      background: 'rgba(200,245,80,.35)',
                      borderRadius: '3px',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ flex: 1, fontSize: '10px', color: 'var(--muted)' }}>Solicitud</div>
                  <div
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(200,245,80,.15)',
                      border: '1px solid rgba(200,245,80,.35)',
                      color: 'var(--accent)',
                    }}
                  >
                    Aprobado
                  </div>
                </div>
              </div>
            </div>

            {/* 3 — Mismo informe a todos */}
            <div className="sentinel-card" style={{ padding: '22px', minHeight: '220px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', fontWeight: 700 }}>PASO 3</span>
                <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Un solo número para todos</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>
                Enviá el mismo resumen a cada canal
              </h3>
              <p style={{ fontSize: '12px', lineHeight: 1.55, color: 'var(--muted)', marginBottom: '14px', flex: 1 }}>
                Generás <strong style={{ color: 'var(--text)', fontWeight: 600 }}>un informe del incidente</strong> y lo reenviás a Slack, correo o webhook. Finanzas y producto miran la misma cifra; no hay siglas que adivinar.
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px',
                  background: 'var(--bg2)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    background: 'var(--bg3)',
                    border: '1px solid var(--border2)',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text)',
                  }}
                >
                  1 informe
                </div>
                <IconArrowRight size={14} style={{ color: 'var(--muted)' }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Slack', 'Correo', 'Webhook'].map((name) => (
                    <div
                      key={name}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        background: 'var(--card)',
                        border: '1px solid var(--border2)',
                        color: 'var(--muted)',
                      }}
                    >
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4 — Recuperación */}
            <div className="sentinel-card" style={{ padding: '22px', minHeight: '220px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', fontWeight: 700 }}>PASO 4</span>
                <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Sabés en qué estado estás</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>
                Recuperá con instantánea y trazabilidad
              </h3>
              <p style={{ fontSize: '12px', lineHeight: 1.55, color: 'var(--muted)', marginBottom: '14px', flex: 1 }}>
                Volvés a un punto guardado del pipeline, comparás qué cambió respecto al intento fallido y disparás una nueva corrida solo de lo necesario — sin mezclar términos en inglés: es{' '}
                <strong style={{ color: 'var(--text)', fontWeight: 600 }}>copia de seguridad, comparación y re-ejecución</strong>.
              </p>
              <div style={{ marginBottom: '8px' }}>
                <div
                  style={{
                    height: '8px',
                    borderRadius: '4px',
                    background: 'linear-gradient(90deg, var(--red) 0%, var(--amber) 45%, var(--accent) 100%)',
                    opacity: 0.85,
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '9px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                  <span>Fallo</span>
                  <span>En curso</span>
                  <span>Listo</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {['Instantánea', 'Comparación', 'Nueva corrida'].map((label) => (
                  <span
                    key={label}
                    style={{
                      fontSize: '10px',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      background: 'rgba(200,245,80,.08)',
                      border: '1px solid rgba(200,245,80,.2)',
                      color: 'var(--text)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {label}
                  </span>
                ))}
                <span style={{ fontSize: '18px', color: 'var(--accent)' }} aria-hidden>↺</span>
              </div>
            </div>
          </div>
        </section>

        {/* Split operations */}
        <section id="operations" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 64px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
              alignItems: 'center',
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: 'var(--accent)',
                  marginBottom: '12px',
                }}
              >
                OPERACIONES
              </h2>
              <h3
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  marginBottom: '16px',
                  color: 'var(--text)',
                }}
              >
                Menos contexto perdido entre herramientas
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  'Mapa de dependencias entre fuentes y destinos.',
                  'Políticas por entorno (dev / staging / prod).',
                  'Historial de decisiones de la IA y overrides humanos.',
                  'Cuellos de botella visibles antes del ticket de NOC.',
                ].map((line) => (
                  <li key={line} style={{ display: 'flex', gap: '10px', fontSize: '13px', lineHeight: 1.55, color: 'var(--muted)' }}>
                    <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>—</span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="sentinel-card" style={{ padding: '20px', minHeight: '280px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '16px' }}>
                VISTA SIMPLIFICADA · FLUJO
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'API / CDC', w: '100%' },
                  { label: 'Cola · buffer', w: '85%' },
                  { label: 'Transform', w: '70%' },
                  { label: 'Warehouse', w: '95%' },
                ].map((step) => (
                  <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '72px', fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                      {step.label}
                    </div>
                    <div style={{ flex: 1, height: '36px', background: 'var(--bg2)', borderRadius: '8px', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: step.w,
                          background: 'linear-gradient(90deg, rgba(200,245,80,.15), rgba(59,130,246,.1))',
                          borderRight: '1px solid rgba(200,245,80,.25)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: '20px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(200,245,80,.06)',
                  border: '1px dashed rgba(200,245,80,.25)',
                  fontSize: '11px',
                  color: 'var(--muted)',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>SUGERENCIA IA</span>
                {' · '}
                Aumentar timeout en paso Transform durante ventana de batch nocturna.
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section style={{ maxWidth: '880px', margin: '0 auto', padding: '0 20px 64px' }}>
          <div
            className="sentinel-card"
            style={{
              padding: '36px 28px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '28px',
              alignItems: 'center',
            }}
          >
            <div>
              <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', lineHeight: 1.55, color: 'var(--text)', fontWeight: 500 }}>
                “En minutos pasamos de alertas genéricas a una cola priorizada y acciones concretas. El equipo de datos dejó de
                adivinar.”
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--border2), var(--bg3))',
                  border: '2px solid var(--border2)',
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text)' }}>Marina Ibarra</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Head of Data · fintech regional</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 20px 64px' }}>
          {sectionTitle(
            'PRECIOS',
            'Elegí el plan que encaje con tu etapa',
            'Empezá gratis y escalá cuando el tráfico y las integraciones lo pidan.',
          )}
          <LandingPricing />
        </section>

        {/* FAQ */}
        <section id="faq" style={{ maxWidth: '920px', margin: '0 auto', padding: '0 20px 64px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: 'var(--text)',
                  marginBottom: '8px',
                }}
              >
                Preguntas frecuentes
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.55 }}>
                Si tu caso es Enterprise (SSO, VPC, compliance), coordinamos una llamada corta desde el plan correspondiente.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {faqItems.map((item) => (
                <details
                  key={item.q}
                  className="sentinel-card"
                  style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                >
                  <summary
                    className="[&::-webkit-details-marker]:hidden"
                    style={{
                      padding: '14px 16px',
                      fontSize: '13px',
                      fontWeight: 500,
                      listStyle: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '12px',
                      alignItems: 'center',
                    }}
                  >
                    {item.q}
                    <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '14px' }}>+</span>
                  </summary>
                  <div style={{ padding: '0 16px 14px', fontSize: '12px', lineHeight: 1.6, color: 'var(--muted)' }}>{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section
          style={{
            position: 'relative',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            padding: '64px 20px',
            textAlign: 'center',
            background: 'var(--bg2)',
            backgroundImage:
              'linear-gradient(rgba(42,52,68,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(42,52,68,.35) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        >
          <div className="max-w-2xl mx-auto">
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.35rem, 3vw, 1.85rem)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                marginBottom: '20px',
                color: 'var(--text)',
              }}
            >
              ¿Listo para dejar de apagar incendios a mano?
            </h2>
            <Link href="/auth" className="btn-primary justify-center" style={{ textDecoration: 'none', padding: '14px 28px', fontSize: '12px' }}>
              Empezar ahora
            </Link>
          </div>
        </section>
      </main>

      <footer
        style={{
          position: 'relative',
          zIndex: 1,
          borderTop: '1px solid var(--border)',
          padding: '40px 20px 28px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '28px',
            marginBottom: '32px',
          }}
        >
          <div>
            <SentinelBrand variant="landing" />
            <p style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.55, marginTop: '12px', maxWidth: '240px' }}>
              Observabilidad y recuperación para pipelines de datos, con IA supervisada.
            </p>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '10px', letterSpacing: '0.1em' }}>
              PRODUCTO
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <a href="#features" style={{ fontSize: '12px', color: 'var(--text)', textDecoration: 'none' }}>
                  Capacidades
                </a>
              </li>
              <li>
                <a href="#pricing" style={{ fontSize: '12px', color: 'var(--text)', textDecoration: 'none' }}>
                  Precios
                </a>
              </li>
              <li>
                <a href="#faq" style={{ fontSize: '12px', color: 'var(--text)', textDecoration: 'none' }}>
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '10px', letterSpacing: '0.1em' }}>
              CUENTA
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <Link href="/auth" style={{ fontSize: '12px', color: 'var(--text)', textDecoration: 'none' }}>
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link href="/dashboard" style={{ fontSize: '12px', color: 'var(--text)', textDecoration: 'none' }}>
                  Panel
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '10px', letterSpacing: '0.1em' }}>
              LEGAL
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <Link href="/legal/terms" style={{ fontSize: '12px', color: 'var(--text)', textDecoration: 'none' }}>
                  Términos
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" style={{ fontSize: '12px', color: 'var(--text)', textDecoration: 'none' }}>
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textAlign: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          © {new Date().getFullYear()} Primary Sentinel · AI · SaaS
        </p>
      </footer>

    </div>
  );
}
