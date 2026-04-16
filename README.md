<div align="center">
  <img width="1888" height="544" alt="background_front" src="https://github.com/user-attachments/assets/34fe35be-c037-434a-bd6e-4147ebb7b07a" />
  <br />
  <div>
    <img src="https://img.shields.io/badge/-Nextjs-black?style=for-the-badge&logo=next.js&logoColor=white&color=000000" alt="next.js" />
    <img src="https://img.shields.io/badge/-Cloudflare-black?style=for-the-badge&logo=cloudflare&logoColor=EB7D20&color=000000" alt="cloudflare" />
    <img src="https://img.shields.io/badge/-Tailwindcss-black?style=for-the-badge&logo=tailwindcss&logoColor=36B7F0&color=000000" alt="tailwind" />
    <img src="https://img.shields.io/badge/-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white&color=000000" alt="vercel" />
  </div>
  
  <h3 align="center">
    <img width="15" height="15" alt="logo" src="https://github.com/user-attachments/assets/84318606-0d4d-4461-8bd3-1c11b746946a" />
    PRIMARY SENTINEL FRONTEND
  </h3>
</div>

Panel de control para inteligencia autónoma de fiabilidad y seguridad (*Autonomous Reliability & Security Intelligence*).  
Backend: [sentinel-saas-backend](https://github.com/BrunoEmaSN/sentinel-saas-backend)

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Auth | Sesión con JWT en cookie (SSR); variables públicas según `.env.example` |
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

Editá `.env.local` siguiendo **`.env.example`**: incluye la URL base del API (Worker) y las variables públicas de autenticación que use tu despliegue. Esta guía no detalla proveedores concretos de identidad ni almacenes externos.

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
│   └── …                  # utilidades de sesión del panel (ver código)
├── types/                 # Tipos TypeScript del backend
└── middleware.ts          # Protección de rutas
```

---

## Cómo conecta con el backend

Todas las llamadas HTTP se hacen en `src/lib/api.ts`:

```
Frontend (Next.js)
  └── Bearer JWT de sesión
       └── POST /api/endpoints         → Crear endpoint
       └── GET  /api/endpoints         → Listar endpoints
       └── GET  /api/endpoints/:id/events → Ver eventos
       └── GET  /api/endpoints/:id/rules  → Ver reglas IA
       └── GET  /api/dlq               → Dead Letter Queue
       └── POST /webhook/:tenantId/:slug  → Enviar webhook de prueba
```

El token de sesión del usuario se adjunta como `Authorization: Bearer <token>` en las llamadas al API del producto.

---

## Deploy en Vercel

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel

# Variables de entorno en Vercel Dashboard:
# Replicá las claves de `.env.example` (URL del API, variables públicas de sesión, etc.).
```

---

## Notificaciones en tiempo real

El centro de notificaciones del panel usa el **canal en tiempo real del propio producto**. El modelo de datos, retención y políticas de acceso son internos al servicio Primary Sentinel y no se documentan aquí como integración con terceros.

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
