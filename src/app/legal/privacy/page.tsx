import Link from 'next/link';
import { IconArrowLeft } from '@/components/icons/Arrows';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';
import { LegalPrivacyBody } from '@/components/legal/LegalPrivacyBody';

export default async function PrivacyPage() {
  const locale = await getLocaleFromCookie();
  const dict = getDictionary(locale);
  const lp = dict.legal.privacy;

  return (
    <div className="legal-doc">
      <Link href="/" className="legal-doc__back">
        <IconArrowLeft size={14} />
        {lp.navBack}
      </Link>
      <LegalPrivacyBody lp={lp} />
    </div>
  );
}
