import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Primeros pasos',
  description: 'Configuración de entorno, Supabase, API y primer acceso a Primary Sentinel.',
};

export default function DocsEmpezarPage() {
  return (
    <>
      <h1>Primeros pasos</h1>
      <p>
        Para usar el panel en desarrollo necesitás un proyecto Supabase (auth), el frontend de Primary Sentinel y la URL
        de tu backend que expone la API REST.
      </p>

      <h2>1. Instalar dependencias</h2>
      <p>En el directorio del frontend:</p>
      <pre>
        <code>{`npm install`}</code>
      </pre>

      <h2>2. Variables de entorno</h2>
      <p>
        Copiá <code>.env.example</code> a <code>.env.local</code> y completá los valores reales (sin placeholders).
      </p>
      <pre>
        <code>{`cp .env.example .env.local`}</code>
      </pre>
      <p>Ejemplo de contenido:</p>
      <pre>
        <code>{`# Supabase — Settings → API del proyecto
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Backend (Worker local o URL desplegada)
NEXT_PUBLIC_API_URL=http://localhost:8787`}</code>
      </pre>

      <h2>3. Arrancar en local</h2>
      <pre>
        <code>{`npm run dev
# → http://localhost:3000`}</code>
      </pre>

      <h2>4. Crear cuenta e iniciar sesión</h2>
      <p>
        Al abrir la raíz del sitio, si no hay sesión activa se redirige a <code>/auth</code>. Podés registrarte con
        email y contraseña o con el proveedor OAuth que tengas habilitado en Supabase (por ejemplo Google).
      </p>
      <p>
        Tras un login correcto accedés al <a href="/dashboard">panel</a> (<code>/dashboard</code>). Si algo falla,
        revisá que la URL y la anon key de Supabase en <code>.env.local</code> coincidan con el proyecto activo.
      </p>

      <h2>5. Producción (Vercel)</h2>
      <p>
        En el dashboard de Vercel definí las mismas variables <code>NEXT_PUBLIC_*</code> para el entorno de producción, en
        particular <code>NEXT_PUBLIC_API_URL</code> apuntando al Worker o API desplegados.
      </p>
    </>
  );
}
