import { redirect } from 'next/navigation';
import { allowPrices } from '@/lib/allowPrices';
import BillingPageClient from './BillingPageClient';

export default function BillingPage() {
  if (!allowPrices) {
    redirect('/dashboard/settings');
  }
  return <BillingPageClient />;
}
