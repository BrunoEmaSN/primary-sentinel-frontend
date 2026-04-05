# 🛡️ Sentinel SaaS — Frontend

Panel de control para el sistema de auto-reparación IA.  
Backend: [sentinel-saas-backend](https://github.com/BrunoEmaSN/sentinel-saas-backend)

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Auth | Supabase Auth + SSR |
| API calls | Cloudflare Worker (tu backend) |
| UI | Tailwind CSS + CSS Variables |
| Charts | Recharts |
| Deploy | Vercel (gratis) |

---

## Setup en 5 minutos

### 1. Clonar e instalar

```bash
git clone <este-repo>
cd sentinel-frontend
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

Editá `.env.local`:

```env
# De tu proyecto Supabase (Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://XXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Tu Cloudflare Worker (local o deployed)
NEXT_PUBLIC_API_URL=http://localhost:8787
```

### 3. Correr en desarrollo

```bash
npm run dev
# → http://localhost:3000
```

### 4. Crear cuenta

Abrí `http://localhost:3000` → te lleva a `/auth` → Registrate con email + password.

---

## Estructura del proyecto

```
src/
├── app/
│   ├── auth/              # Login / Signup
│   ├── dashboard/
│   │   ├── page.tsx       # Dashboard principal (métricas + flow)
│   │   ├── flows/         # Gestión de endpoints
│   │   ├── rules/         # Gestor de reglas IA
│   │   ├── dlq/           # Dead Letter Queue
│   │   ├── notifications/ # Notificaciones (Realtime)
│   │   └── settings/      # Configuración
│   └── layout.tsx
├── components/
│   ├── layout/            # Sidebar, Topbar
│   └── dashboard/         # Cards, Chart, Flow diagram
├── lib/
│   ├── api.ts             # Cliente HTTP → tu backend
│   └── supabase/          # Browser + Server clients
├── types/                 # Tipos TypeScript del backend
└── middleware.ts          # Protección de rutas
```

---

## Cómo conecta con el backend

Todas las llamadas HTTP se hacen en `src/lib/api.ts`:

```
Frontend (Next.js)
  └── Bearer JWT (Supabase)
       └── POST /api/endpoints         → Crear endpoint
       └── GET  /api/endpoints         → Listar endpoints
       └── GET  /api/endpoints/:id/events → Ver eventos
       └── GET  /api/endpoints/:id/rules  → Ver reglas IA
       └── GET  /api/dlq               → Dead Letter Queue
       └── POST /webhook/:tenantId/:slug  → Enviar webhook de prueba
```

El JWT viene de `supabase.auth.getSession()` y se envía como `Authorization: Bearer <token>`.

---

## Deploy en Vercel

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel

# Variables de entorno en Vercel Dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# NEXT_PUBLIC_API_URL  ← tu Worker URL en producción
```

---

## Realtime (Notificaciones)

La página de notificaciones se suscribe a la tabla `notifications` de Supabase usando Realtime.  
Asegurate de que tu backend inserte en esa tabla cuando genere una regla o encuentre un evento irrecuperable.

Schema sugerido para la tabla `notifications`:

```sql
create table notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references auth.users(id),
  type text check (type in ('healed','dead','rule_created','rule_pending','info')),
  title text not null,
  body text,
  read boolean default false,
  created_at timestamptz default now()
);

-- RLS
alter table notifications enable row level security;
create policy "Own notifications" on notifications
  for all using (auth.uid() = tenant_id);
```

---

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/auth` | Login / Signup |
| `/dashboard` | Métricas, flujo de agentes, eventos recientes |
| `/dashboard/flows` | Gestión de endpoints + URL de webhook |
| `/dashboard/rules` | Reglas IA: aprobar, editar, eliminar |
| `/dashboard/dlq` | Eventos irrecuperables + reinyección manual |
| `/dashboard/notifications` | Alertas en tiempo real |
| `/dashboard/settings` | Config del Sentinel + estado de infraestructura |
