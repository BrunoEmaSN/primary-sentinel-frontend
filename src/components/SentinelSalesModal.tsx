"use client";

/**
 * Modal de contacto comercial (Lema) — POST {workerUrl}/email/contact
 */

import {
  useState,
  useRef,
  useEffect,
  type CSSProperties,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/I18nProvider";

const PLAN_VALUES = ["unknown", "free", "starter", "pro", "enterprise"] as const;

/** Ilustración de éxito: sobre centrado con check (estilo line art + acento lima). */
function EmailSuccessIllustration() {
  const acc = "var(--ss-accent)";
  return (
    <svg
      className="ssm-success-art-svg"
      viewBox="0 0 240 168"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g className="ssm-mail-wrap" transform="translate(72 36)">
        <rect
          x="4"
          y="20"
          width="88"
          height="56"
          rx="8"
          stroke={acc}
          strokeWidth="2.25"
          fill="rgba(200,245,80,.06)"
        />
        <path
          d="M4 28 L48 58 L92 28"
          stroke={acc}
          strokeWidth="2.25"
          strokeLinejoin="round"
          fill="rgba(200,245,80,.04)"
        />
        <path d="M48 58 L48 76" stroke={acc} strokeWidth="2" strokeLinecap="round" opacity={0.55} />
        <circle cx="48" cy="44" r="14" stroke={acc} strokeWidth="2" fill="var(--bg)" />
        <path
          d="M41.5 44 L46 48.5 L54.5 39"
          stroke={acc}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export interface SentinelSalesModalProps {
  workerUrl: string;
  open: boolean;
  onClose: () => void;
  agentName?: string;
  primaryColor?: string;
  accentColor?: string;
}

export default function SentinelSalesModal({
  workerUrl,
  open,
  onClose,
  agentName,
  primaryColor,
  accentColor,
}: SentinelSalesModalProps) {
  const { t } = useI18n();
  const resolvedName = agentName ?? t("sentinelSales.titleDefault");
  const prim = primaryColor ?? "var(--bg3)";
  const acc = accentColor ?? "var(--accent)";

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [plan, setPlan] = useState<string>("unknown");
  const [stack, setStack] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [message, setMessage] = useState("");

  const firstField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    const tmr = window.setTimeout(() => firstField.current?.focus(), 80);
    return () => window.clearTimeout(tmr);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setDone(false);
      setName("");
      setEmail("");
      setCompany("");
      setPlan("unknown");
      setStack("");
      setTeamSize("");
      setMessage("");
      setError(null);
      setLoading(false);
    }
  }, [open]);

  const wrapStyle = {
    "--ss-primary": prim,
    "--ss-accent": acc,
  } as CSSProperties;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    const em = email.trim();
    const msg = message.trim();
    if (!em || !msg) {
      setError(t("sentinelSales.validationEmailAndMessageRequired"));
      return;
    }
    setLoading(true);
    try {
      const base = workerUrl.replace(/\/$/, "");
      const res = await fetch(`${base}/email/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: em,
          company: company.trim() || undefined,
          plan: plan === "unknown" ? "unknown" : plan,
          stack: stack.trim() || undefined,
          team_size: teamSize.trim() || undefined,
          message: msg,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string; detail?: string };
        throw new Error(j.detail || j.error || `HTTP ${res.status}`);
      }
      setDone(true);
    } catch (err) {
      setError((err as Error).message || t("sentinelSales.errorEmailNotSent"));
    } finally {
      setLoading(false);
    }
  }

  const dialogAria = t("sentinelSales.ariaDialogEmailContact").replace("{{name}}", resolvedName);

  const modal = (
    <>
      <style>{`
        .ssm-backdrop * { box-sizing: border-box; font-family: var(--font-sans), system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
        .ssm-backdrop {
          position: fixed; inset: 0; z-index: 10050;
          background: rgba(0,0,0,.65);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: ssm-fade-in .2s ease;
        }
        @keyframes ssm-fade-in { from { opacity: 0; } to { opacity: 1; } }
        .ssm-panel {
          width: 100%; max-width: 720px; max-height: min(900px, 90vh);
          display: flex; flex-direction: column; border-radius: 12px; overflow: hidden;
          box-shadow: 0 24px 48px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.03);
          background: var(--card); color: var(--text);
          border: 1px solid var(--border);
          animation: ssm-pop .22s ease;
        }
        @keyframes ssm-pop { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: none; } }
        .ssm-head {
          padding: 12px 16px; display: flex; align-items: center; gap: 12px; flex-shrink: 0;
          border-bottom: 1px solid var(--border);
        }
        /* Mismas dimensiones y recorte que el avatar del chat (SentinelChat .sc-avatar) */
        .ssm-avatar {
          position: relative;
          width: 72px;
          height: 72px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid rgba(200,245,80,.25);
          background: var(--bg3);
        }
        .ssm-avatar-img {
          object-fit: cover;
          object-position: center center;
          image-rendering: crisp-edges;
          image-rendering: pixelated;
          transform: scale(1.3);
        }
        .ssm-h1 { font-weight: 600; font-size: 13px; margin: 0; letter-spacing: -0.02em; color: white; }
        .ssm-sub { font-size: 11px; font-family: var(--font-mono), monospace; color: var(--muted); margin: 4px 0 0; }
        .ssm-x {
          background: transparent; border: 1px solid var(--border2);
          color: var(--muted);
          width: 30px; height: 30px; border-radius: 8px; cursor: pointer;
          font-size: 18px; line-height: 1; display: flex; align-items: center; justify-content: center;
          transition: border-color 0.15s, background 0.15s, color 0.15s;
        }
        .ssm-x:hover {
          border-color: rgba(200,245,80,.35);
          background: rgba(200,245,80,.07);
          color: var(--accent);
        }
        .ssm-body { flex: 1; overflow-y: auto; padding: 14px 16px 16px; min-height: 0; background: var(--bg); }
        .ssm-fld { margin-bottom: 10px; }
        .ssm-fld label { display: block; font-size: 10px; font-weight: 600; font-family: var(--font-mono), monospace; margin-bottom: 4px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; }
        .ssm-inp, .ssm-sel, .ssm-ta {
          width: 100%; border: 1px solid var(--border2); border-radius: 8px; padding: 8px 11px; font-size: 12px;
          font-family: var(--font-mono), monospace; background: var(--bg2); color: var(--text);
          transition: border-color .15s;
        }
        .ssm-inp:focus, .ssm-sel:focus, .ssm-ta:focus { outline: none; border-color: var(--ss-accent); }
        .ssm-ta { min-height: 88px; resize: vertical; line-height: 1.45; }
        .ssm-err {
          background: rgba(239,68,68,.08); color: var(--red); font-size: 11px; font-family: var(--font-mono), monospace;
          padding: 8px 10px; border-radius: 8px; margin-bottom: 10px; border: 1px solid rgba(239,68,68,.2);
        }
        .ssm-ok { font-size: 12px; line-height: 1.55; padding: 8px 0; color: var(--text); }
        .ssm-success-wrap { text-align: center; padding: 4px 0 8px; }
        .ssm-success-art { display: flex; justify-content: center; margin-bottom: 12px; }
        .ssm-success-art-svg { width: min(228px, 100%); height: auto; overflow: visible; display: block; }
        .ssm-success-title {
          font-size: 15px; font-weight: 600; margin: 0 0 10px; letter-spacing: -0.02em;
          color: var(--text); line-height: 1.35;
        }
        .ssm-success-title .ssm-success-accent { color: var(--ss-accent); }
        .ssm-success-hint {
          font-size: 11px; line-height: 1.6; margin: 0 auto; max-width: 28rem;
          color: var(--muted); font-family: var(--font-mono), monospace;
        }
        .ssm-btn {
          width: 100%; border: none; color: #0a0b0d; padding: 10px 12px; border-radius: 8px;
          font-weight: 600; font-size: 12px; font-family: var(--font-mono), monospace; cursor: pointer;
          background: var(--ss-accent); transition: background .15s, opacity .15s;
        }
        .ssm-btn:hover:not(:disabled) { filter: brightness(1.05); }
        .ssm-btn:disabled { opacity: 0.5; cursor: default; }
      `}</style>

      <div
        className="ssm-backdrop"
        style={wrapStyle}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="ssm-panel"
          role="dialog"
          aria-modal="true"
          aria-label={dialogAria}
          onClick={(e) => e.stopPropagation()}
        >
            <div
              className="ssm-head"
              style={{
                background: `var(--ss-primary)`,
                color: "#0a0b0d",
                borderBottom: "none",
              }}
            >
              <div className="ssm-avatar" aria-hidden>
                <Image
                  src="/Lema.png"
                  alt=""
                  fill
                  className="ssm-avatar-img"
                  sizes="72px"
                  unoptimized
                />
              </div>
              <div style={{ marginRight: "auto" }}>
                <p className="ssm-h1">{resolvedName}</p>
                <p className="ssm-sub" style={{ color: "white" }}>
                  {t("sentinelSales.panelTitle")}
                </p>
              </div>
              <button
                type="button"
                className="ssm-x"
                onClick={onClose}
                aria-label={t("sentinelSales.closePanelAria")}
              >
                ×
              </button>
            </div>

            <div className="ssm-body">
              {done ? (
                <div className="ssm-success-wrap">
                  <div className="ssm-success-art">
                    <EmailSuccessIllustration />
                  </div>
                  <p className="ssm-success-title">
                    <span className="ssm-success-accent">{t("sentinelSales.successCheckInboxHighlight")}</span>{" "}
                    {t("sentinelSales.successCheckInboxTitle")}
                  </p>
                  <p className="ssm-success-hint">{t("sentinelSales.successCheckInboxHint")}</p>
                </div>
              ) : (
                <form onSubmit={(e) => void onSubmit(e)}>
                  <p
                    className="ssm-sub"
                    style={{
                      marginTop: 0,
                      marginBottom: 12,
                      textTransform: "none",
                      letterSpacing: "normal",
                      fontSize: 12,
                      color: "var(--muted)",
                    }}
                  >
                    {t("sentinelSales.panelSubtitle")}
                  </p>
                  {error && <div className="ssm-err">{error}</div>}
                  <div className="ssm-fld">
                    <label htmlFor="ssm-name">{t("sentinelSales.labelName")}</label>
                    <input
                      id="ssm-name"
                      ref={firstField}
                      className="ssm-inp"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                  <div className="ssm-fld">
                    <label htmlFor="ssm-email">{t("sentinelSales.labelEmail")} *</label>
                    <input
                      id="ssm-email"
                      className="ssm-inp"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <div className="ssm-fld">
                    <label htmlFor="ssm-co">{t("sentinelSales.labelCompany")}</label>
                    <input
                      id="ssm-co"
                      className="ssm-inp"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                  <div className="ssm-fld">
                    <label htmlFor="ssm-plan">{t("sentinelSales.labelPlan")}</label>
                    <select
                      id="ssm-plan"
                      className="ssm-sel"
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                    >
                      {PLAN_VALUES.map((v) => (
                        <option key={v} value={v}>
                          {t(`sentinelSales.planOption.${v}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="ssm-fld">
                    <label htmlFor="ssm-st">{t("sentinelSales.labelStack")}</label>
                    <input
                      id="ssm-st"
                      className="ssm-inp"
                      value={stack}
                      onChange={(e) => setStack(e.target.value)}
                    />
                  </div>
                  <div className="ssm-fld">
                    <label htmlFor="ssm-tm">{t("sentinelSales.labelTeam")}</label>
                    <input
                      id="ssm-tm"
                      className="ssm-inp"
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                    />
                  </div>
                  <div className="ssm-fld">
                    <label htmlFor="ssm-msg">{t("sentinelSales.labelMessage")} *</label>
                    <textarea
                      id="ssm-msg"
                      className="ssm-ta"
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="ssm-btn" disabled={loading}>
                    {loading ? t("sentinelSales.sendingEmail") : t("sentinelSales.submitSendEmail")}
                  </button>
                </form>
              )}
            </div>
        </div>
      </div>
    </>
  );

  if (!open) return null;
  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}
