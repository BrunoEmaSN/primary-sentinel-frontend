import { redirect } from 'next/navigation';
import { createClientIfConfigured } from '@/lib/supabase/server';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { NotificationsProvider } from '@/components/layout/NotificationsProvider';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClientIfConfigured();
  if (!supabase) {
    redirect('/auth');
  }
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth');

  return (
    <NotificationsProvider>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Topbar user={user} />
          <main style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {children}
          </main>
        </div>
      </div>
    </NotificationsProvider>
  );
}
