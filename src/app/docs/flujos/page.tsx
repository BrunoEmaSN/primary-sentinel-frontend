import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flujos',
  description: 'Gestión de endpoints, webhooks y pruebas de ingesta en Primary Sentinel.',
};

export default function DocsFlujosPage() {
  return (
    <>
      <h1>Flujos</h1>
      <p>
        En <code>/dashboard/flows</code> configurás los <strong>endpoints</strong> que el Sentinel debe vigilar. Cada
        endpoint tiene metadatos propios y una <strong>URL de webhook</strong> que tus sistemas pueden invocar para
        simular o enviar eventos reales.
      </p>

      <h2>Crear y editar endpoints</h2>
      <p>
        Desde el formulario podés dar de alta nuevos destinos y ajustar la configuración de los existentes. Los cambios
        quedan asociados a tu usuario (tenant) en el backend.
      </p>

      <h2>Webhook de prueba</h2>
      <p>
        El backend expone un endpoint de tipo <code>POST /webhook/:tenantId/:slug</code> para enviar cargas de prueba. La
        interfaz muestra la URL concreta que debés usar; las peticiones autenticadas al API REST usan el JWT de Supabase
        en la cabecera <code>Authorization</code> (ver <a href="/docs/api">API y webhooks</a>).
      </p>

      <h2>Eventos por endpoint</h2>
      <p>
        Podés inspeccionar eventos asociados a un endpoint concreto para depurar integraciones o entender qué está
        llegando al pipeline antes de que las reglas IA actúen.
      </p>
    </>
  );
}
