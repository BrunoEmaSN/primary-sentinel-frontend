'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import SentinelSalesModal from '@/components/SentinelSalesModal';

type SalesContactContextValue = {
  /** Abre el modal de contacto comercial (no hace nada si no hay Worker configurado). */
  openSalesContact: () => void;
  isSalesContactConfigured: boolean;
};

const SalesContactContext = createContext<SalesContactContextValue | null>(null);

export function SalesContactProvider({
  workerUrl,
  children,
}: {
  workerUrl: string;
  children: ReactNode;
}) {
  const configured = workerUrl.trim() !== '';
  const [open, setOpen] = useState(false);

  const openSalesContact = useCallback(() => {
    if (configured) setOpen(true);
  }, [configured]);

  const value = useMemo(
    () => ({
      openSalesContact,
      isSalesContactConfigured: configured,
    }),
    [openSalesContact, configured],
  );

  return (
    <SalesContactContext.Provider value={value}>
      {children}
      {configured ? (
        <SentinelSalesModal workerUrl={workerUrl} open={open} onClose={() => setOpen(false)} />
      ) : null}
    </SalesContactContext.Provider>
  );
}

export function useSalesContact(): SalesContactContextValue {
  const ctx = useContext(SalesContactContext);
  if (!ctx) {
    throw new Error('useSalesContact debe usarse dentro de SalesContactProvider');
  }
  return ctx;
}
