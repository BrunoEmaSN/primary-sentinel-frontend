import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Primeros pasos',
  description: 'Alta en el SaaS, variables de entorno, Supabase, API y despliegue de Primary Sentinel.',
};

export default function DocsEmpezarPage() {
  return (
    <>
      <h1>Primeros pasos</h1>
      <p>
        Primary Sentinel se usa como <strong>servicio</strong>: creás una cuenta (email/contraseña u OAuth), obtenés un{' '}
        <strong>tenant</strong> implícito ligado a tu usuario de Supabase, y el panel habla con el backend desplegado que
        expone la API REST. En desarrollo, corrés el frontend y apuntás al Worker local o a un entorno compartido.
      </p>

      <h2>1. Instalar dependencias</h2>
      <p>Para contribuir o ejecutar el panel en local, en el directorio del frontend:</p>
      <pre>
        <code>{`npm install`}</code>
      </pre>

      <h2>2. Variables de entorno</h2>
      <p>
        Copiá <code>.env.example</code> a <code>.env.local</code> y completá los valores reales (sin placeholders). Las
        claves <code>NEXT_PUBLIC_*</code> se inyectan en el bundle del cliente: usá solo la clave <strong>anon</strong> de
        Supabase, nunca <code>service_role</code>.
      </p>
      <pre>
        <code>{`cp .env.example .env.local`}</code>
      </pre>
      <p>Ejemplo de contenido:</p>
      <pre>
        <code>{`# Supabase — Settings / API (clave anon / public)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# URL pública del sitio (producción: mismo origen que en Supabase Redirect URLs)
# NEXT_PUBLIC_SITE_URL=https://tu-app.vercel.app

# Backend del SaaS (Worker local o URL desplegada)
NEXT_PUBLIC_API_URL=http://localhost:8787`}</code>
      </pre>

      <h2>3. Arrancar en local</h2>
      <pre>
        <code>{`npm run dev
# Luego abrí http://localhost:3000 en el navegador`}</code>
      </pre>

      <h2>4. Cuenta e inicio de sesión</h2>
      <p>
        Tras abrir el sitio, si no hay sesión se redirige a <code>/auth</code>. Podés registrarte con email y contraseña o
        con el proveedor OAuth configurado en Supabase (p. ej. Google). Con un login correcto accedés al{' '}
        <a href="/dashboard">panel</a> (<code>/dashboard</code>), donde todas las rutas API llevan tu JWT y el backend
        resuelve el <strong>tenant</strong>.
      </p>
      <p>
        Si el login falla, revisá <code>NEXT_PUBLIC_SUPABASE_URL</code> y <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, y
        reiniciá el servidor de desarrollo tras cambiar <code>.env.local</code>.
      </p>

      <h2>5. Producción (Vercel u otro host)</h2>
      <p>
        Definí las mismas variables <code>NEXT_PUBLIC_*</code> en el panel del proveedor (p. ej. Vercel).{' '}
        <code>NEXT_PUBLIC_API_URL</code> debe apuntar al Worker o API en producción. Configurá también{' '}
        <code>NEXT_PUBLIC_SITE_URL</code> si usás OAuth, alineado con las URL permitidas en Supabase y con{' '}
        <code>ALLOWED_ORIGINS</code> / CORS en el backend.
      </p>
    </>
  );
}
