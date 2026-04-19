'use client';

import { Toaster } from 'sonner';

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      theme="dark"
      richColors
      closeButton
      duration={4000}
      style={{ zIndex: 10100 }}
    />
  );
}
