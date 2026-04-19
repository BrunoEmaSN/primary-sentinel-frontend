'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Notification } from '@/lib/notifications';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n/I18nProvider';

export function useNotifications() {
  const { dict } = useI18n();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setNotifications(data as Notification[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void load();

    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [load, supabase]);

  const markAllRead = useCallback(async () => {
    setMarkingAllRead(true);
    try {
      const { error } = await supabase.from('notifications').update({ read: true }).eq('read', false);
      if (error) {
        toast.error(dict.dashboard.notificationsPage.markReadFailed);
        return;
      }
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } finally {
      setMarkingAllRead(false);
    }
  }, [supabase, dict.dashboard.notificationsPage.markReadFailed]);

  const unread = notifications.filter((n) => !n.read).length;

  return { notifications, loading, load, markAllRead, markingAllRead, unread };
}
