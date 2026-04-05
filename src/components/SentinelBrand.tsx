'use client';

import Image from 'next/image';

type SentinelBrandProps = {
  variant: 'sidebar' | 'auth';
};

const cfg = {
  sidebar: { size: 28, title: '13px', subtitle: '9px', gap: '8px', letter: '1.5px' as const },
  auth: { size: 36, title: '16px', subtitle: '9px', gap: '10px', letter: '2px' as const },
};

export default function SentinelBrand({ variant }: SentinelBrandProps) {
  const c = cfg[variant];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: c.gap,
        ...(variant === 'auth' ? { marginBottom: '40px', justifyContent: 'center' } : {}),
      }}
    >
      <Image
        src="/logo.svg"
        alt="logo"
        width={c.size}
        height={c.size}
        priority={variant === 'auth'}
        className="dark:invert"
        unoptimized
      />
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: c.title, fontWeight: 700 }}>SENTINEL</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: c.subtitle, color: 'var(--muted)', letterSpacing: c.letter }}>AI · SAAS</div>
      </div>
    </div>
  );
}
