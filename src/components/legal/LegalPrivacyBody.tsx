import type { Dictionary } from '@/lib/i18n/messages';
import { allowPrices } from '@/lib/allowPrices';

type PrivacyCopy = Dictionary['legal']['privacy'];

function DefinitionList({ lp }: { lp: PrivacyCopy }) {
  return (
    <ul>
      {lp.definitions.map((d, i) => (
        <li key={i}>
          {'kind' in d && d.kind === 'withSiteLink' ? (
            <p>
              <strong>{d.term}</strong> {d.before}{' '}
              <a href={lp.siteUrl} rel="external nofollow noopener" target="_blank">
                {lp.siteUrl}
              </a>
              {d.after}
            </p>
          ) : 'body' in d ? (
            <>
              <p>
                <strong>{d.term}</strong> {d.body}
              </p>
              {'extra' in d && d.extra ? <p>{d.extra}</p> : null}
            </>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function LegalPrivacyBody({ lp }: { lp: PrivacyCopy }) {
  const useLi = allowPrices ? lp.useLi : lp.useLiNoPrices;
  const shareLi = allowPrices ? lp.shareLi : lp.shareLiNoPrices;
  const trackP3 = allowPrices ? lp.trackP3 : lp.trackP3NoPrices;
  const retBeyond = allowPrices ? lp.retBeyond : lp.retBeyondNoPrices;

  return (
    <>
      <h1>{lp.title}</h1>
      <p className="legal-doc__meta">{lp.lastUpdated}</p>
      <p className="legal-doc__intro">{lp.intro1}</p>
      <p className="legal-doc__intro">
        {lp.intro2a}
        <a href={lp.generatorHref} target="_blank" rel="noreferrer">
          {lp.intro2Link}
        </a>
        {lp.intro2b}
      </p>
      <h2>{lp.hInterpretationDefs}</h2>
      <h3>{lp.hInterpretation}</h3>
      <p>{lp.interpP}</p>
      <h3>{lp.hDefinitions}</h3>
      <p>{lp.defIntro}</p>
      <DefinitionList lp={lp} />
      <h2>{lp.hCollect}</h2>
      <h3>{lp.hTypes}</h3>
      <h4>{lp.hPersonal}</h4>
      <p>{lp.personalIntro}</p>
      <ul>
        <li>{lp.personalLi1}</li>
        <li>{lp.personalLi2}</li>
      </ul>
      <h4>{lp.hUsageData}</h4>
      <p>{lp.usageP1}</p>
      <p>{lp.usageP2}</p>
      <p>{lp.usageP3}</p>
      <p>{lp.usageP4}</p>
      <h4>{lp.hTracking}</h4>
      <p>{lp.trackP1}</p>
      <ul>
        <li>{lp.trackLi1}</li>
        <li>{lp.trackLi2}</li>
      </ul>
      <p>{lp.trackP2}</p>
      <p>{trackP3}</p>
      <p>{lp.trackP4}</p>
      <ul>
        <li>
          <p>
            <strong>{lp.cookieNecTitle}</strong>
          </p>
          <p>{lp.cookieNecType}</p>
          <p>{lp.cookieNecAdmin}</p>
          <p>{lp.cookieNecPurpose}</p>
        </li>
        <li>
          <p>
            <strong>{lp.cookiePolTitle}</strong>
          </p>
          <p>{lp.cookiePolType}</p>
          <p>{lp.cookiePolAdmin}</p>
          <p>{lp.cookiePolPurpose}</p>
        </li>
        <li>
          <p>
            <strong>{lp.cookieFnTitle}</strong>
          </p>
          <p>{lp.cookieFnType}</p>
          <p>{lp.cookieFnAdmin}</p>
          <p>{lp.cookieFnPurpose}</p>
        </li>
      </ul>
      <p>{lp.trackP5}</p>
      <h3>{lp.hUse}</h3>
      <p>{lp.useIntro}</p>
      <ul>
        {useLi.map((text, i) => (
          <li key={i}>
            <p>{text}</p>
          </li>
        ))}
      </ul>
      <p>{lp.shareIntro}</p>
      <ul>
        {shareLi.map((text, i) => {
          const idx = text.indexOf(':');
          return (
            <li key={i}>
              {idx === -1 ? (
                text
              ) : (
                <>
                  <strong>{text.slice(0, idx)}:</strong>
                  {text.slice(idx + 1)}
                </>
              )}
            </li>
          );
        })}
      </ul>
      {allowPrices ? (
        <>
          <h3>{lp.hPayments}</h3>
          <p>{lp.payP1}</p>
          <p>{lp.payP2}</p>
          <ul>
            <li>
              <strong>{lp.payStripeName}</strong>
              <p>
                {lp.payStripePrivacyBefore}{' '}
                <a href={lp.stripePrivacyUrl} target="_blank" rel="noreferrer">
                  {lp.stripePrivacyUrl}
                </a>
              </p>
            </li>
          </ul>
        </>
      ) : null}
      <h3>{lp.hRetention}</h3>
      <p>{lp.retP1}</p>
      <p>{lp.retP2}</p>
      <ul>
        <li>
          <p>{lp.retAccountH}</p>
          <ul>
            <li>{lp.retAccountLi}</li>
          </ul>
        </li>
        <li>
          <p>{lp.retSupportH}</p>
          <ul>
            <li>{lp.retSupportLi1}</li>
            <li>{lp.retSupportLi2}</li>
          </ul>
        </li>
        <li>
          <p>{lp.retUsageH}</p>
          <ul>
            <li>
              <p>{lp.retUsageLi1}</p>
            </li>
            <li>
              <p>{lp.retUsageLi2}</p>
            </li>
          </ul>
        </li>
      </ul>
      <p>{lp.retP3}</p>
      <p>{lp.retP4}</p>
      <ul>
        {retBeyond.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
      <p>{lp.retP5}</p>
      <p>{lp.retP6}</p>
      <ul>
        {lp.retProc.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
      <h3>{lp.hTransfer}</h3>
      <p>{lp.transP1}</p>
      <p>{lp.transP2}</p>
      <h3>{lp.hDelete}</h3>
      <p>{lp.delP1}</p>
      <p>{lp.delP2}</p>
      <p>{lp.delP3}</p>
      <p>{lp.delP4}</p>
      <h3>{lp.hDisclose}</h3>
      <h4>{lp.hBiz}</h4>
      <p>{lp.bizP}</p>
      <h4>{lp.hLawEnf}</h4>
      <p>{lp.lawEnfP}</p>
      <h4>{lp.hOtherLegal}</h4>
      <p>{lp.otherLegalP}</p>
      <ul>
        {lp.otherLegalLi.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
      <h3>{lp.hSecurity}</h3>
      <p>{lp.secP}</p>
      <h2>{lp.hChildren}</h2>
      <p>{lp.childP1}</p>
      <p>{lp.childP2}</p>
      <h2>{lp.hLinks}</h2>
      <p>{lp.linksP1}</p>
      <p>{lp.linksP2}</p>
      <h2>{lp.hChanges}</h2>
      <p>{lp.chgP1}</p>
      <p>{lp.chgP2}</p>
      <p>{lp.chgP3}</p>
      <h2>{lp.hContact}</h2>
      <p>{lp.contactP}</p>
      <ul>
        <li>
          {lp.contactEmailLabel} <a href={`mailto:${lp.contactEmail}`}>{lp.contactEmail}</a>
        </li>
      </ul>
    </>
  );
}
