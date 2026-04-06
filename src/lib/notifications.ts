export interface Notification {
  id: string;
  type: 'healed' | 'dead' | 'rule_created' | 'rule_pending' | 'info';
  title: string;
  body?: string;
  created_at: string;
  read: boolean;
}

export const notificationTypeConfig = {
  healed:       { icon: '✦', color: 'var(--accent)' },
  dead:         { icon: '⚠', color: 'var(--red)' },
  rule_created: { icon: '★', color: 'var(--teal)' },
  rule_pending: { icon: '◎', color: 'var(--amber)' },
  info:         { icon: '●', color: 'var(--blue)' },
} as const;
