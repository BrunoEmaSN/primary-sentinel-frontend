import Link from 'next/link';
import { IconArrowLeft } from '@/components/icons/Arrows';
import { getDictionary } from '@/lib/i18n/messages';
import { getLocaleFromCookie } from '@/lib/i18n/getLocale';
import type { Dictionary } from '@/lib/i18n/messages';

type TermsCopy = Dictionary['legal']['terms'];

function DefinitionList({ lt }: { lt: TermsCopy }) {
  return (
    <ul>
      {lt.definitions.map((d, i) => (
        <li key={i}>
          {'kind' in d && d.kind === 'withSiteLink' ? (
            <p>
              <strong>{d.term}</strong> {d.before}{' '}
              <a href={lt.siteUrl} rel="external nofollow noopener" target="_blank">
                {lt.siteUrl}
              </a>
              {d.after}
            </p>
          ) : 'body' in d ? (
            <p>
              <strong>{d.term}</strong> {d.body}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export default async function TermsPage() {
  const locale = await getLocaleFromCookie();
  const dict = getDictionary(locale);
  const lt = dict.legal.terms;

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 20px', lineHeight: 1.65 }}>
      <Link
        href="/"
        style={{ fontSize: '12px', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
      >
        <IconArrowLeft size={14} />
        {lt.navBack}
      </Link>
      <h1>{lt.title}</h1>
      <p>{lt.lastUpdated}</p>
      <p>{lt.intro}</p>

      <h2>{lt.hInterpretationDefs}</h2>
      <h3>{lt.hInterpretation}</h3>
      <p>{lt.interpP}</p>

      <h3>{lt.hDefinitions}</h3>
      <p>{lt.defIntro}</p>
      <DefinitionList lt={lt} />

      <h2>{lt.hAck}</h2>
      <p>{lt.ackP1}</p>
      <p>{lt.ackP2}</p>
      <p>{lt.ackP3}</p>

      <h2>{lt.hSubBilling}</h2>
      <h3>{lt.hSubPeriod}</h3>
      <p>{lt.subPeriodP}</p>
      <h3>{lt.hFeeChanges}</h3>
      <p>{lt.feeChangesP}</p>

      <h2>{lt.hPromo}</h2>
      <p>{lt.promoP}</p>

      <h2>{lt.hUserAccounts}</h2>
      <h3>{lt.hUserContent}</h3>
      <p>{lt.userContentP}</p>
      <h3>{lt.hBackups}</h3>
      <p>{lt.backupsP}</p>

      <h2>{lt.hIP}</h2>
      <h3>{lt.hOurIP}</h3>
      <p>{lt.ourIPP}</p>

      <h3>{lt.hFeedbackUs}</h3>
      <p>{lt.feedbackP}</p>

      <h2>{lt.hLiability}</h2>
      <p>{lt.liabilityP}</p>

      <h2>{lt.hAsIs}</h2>
      <p>{lt.asIsP}</p>

      <h2>{lt.hGovLaw}</h2>
      <p>{lt.govLawP}</p>

      <h2>{lt.hChangesTerms}</h2>
      <p>{lt.changesP}</p>

      <h2>{lt.hContact}</h2>
      <p>{lt.contactP}</p>
      <ul>
        <li>
          {lt.contactEmailLabel} <a href={`mailto:${lt.contactEmail}`}>{lt.contactEmail}</a>
        </li>
      </ul>
    </div>
  );
}
