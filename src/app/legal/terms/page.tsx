import Link from 'next/link';
import { IconArrowLeft } from '@/components/icons/Arrows';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';
import { LegalTermsBody } from '@/components/legal/LegalTermsBody';

export default async function TermsPage() {
  const locale = await getLocaleFromCookie();
  const dict = getDictionary(locale);
  const lt = dict.legal.terms;

  return (
    <div className="legal-doc">
      <Link href="/" className="legal-doc__back">
        <IconArrowLeft size={14} />
        {lt.navBack}
      </Link>
      <LegalTermsBody lt={lt} />
    </div>
  );
}
