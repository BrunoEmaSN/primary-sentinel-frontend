"use client";

/**
 * SentinelChat — Widget de asistente (Arsi) alineado al tema Primary Sentinel.
 * Uso: definí NEXT_PUBLIC_SENTINEL_CHAT_WORKER_URL o pasá workerUrl (base del Worker, POST /chat).
 *
 * Props:
 *   workerUrl     string   URL de tu Cloudflare Worker (requerido)
 *   title         string   Nombre del chat (default: diccionario arsiChat.titleDefault)
 *   primaryColor  string   Color de acento (default: var(--accent) del tema)
 *   position      string   "bottom-right" | "bottom-left" (default: "bottom-right")
 *   greeting      string   Mensaje inicial (default: diccionario arsiChat.greetingDefault)
 */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { Locale } from "@/lib/i18n/types";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
  id: string;
};

type ChatHistoryTurn = Pick<ChatMessage, "role" | "content">;

type ChatApiResponse = {
  reply?: string;
};

export type SentinelChatProps = {
  workerUrl: string;
  title?: string;
  primaryColor?: string;
  position?: "bottom-right" | "bottom-left";
  greeting?: string;
};

// ─── Utilidades ───────────────────────────────────────────────────────────────
function genSessionId(): string {
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getOrCreateSession(): string {
  if (typeof window === "undefined") return genSessionId();
  let id = sessionStorage.getItem("sentinel_session");
  if (!id) {
    id = genSessionId();
    sessionStorage.setItem("sentinel_session", id);
  }
  return id;
}

function parseChatReply(data: unknown): string {
  if (data && typeof data === "object" && "reply" in data) {
    const r = (data as ChatApiResponse).reply;
    return typeof r === "string" ? r : "";
  }
  return "";
}

/** Últimos turnos enviados al worker (evita payloads enormes en chats largos). */
const MAX_CHAT_HISTORY_MESSAGES = 32;

type WorkerErrorBody = {
  error?: unknown;
  detail?: unknown;
};

function parseJsonSafe(raw: string): unknown {
  try {
    return raw ? (JSON.parse(raw) as unknown) : null;
  } catch {
    return null;
  }
}

function messageForWorkerFailure(data: unknown, t: (key: string) => string): string {
  if (!data || typeof data !== "object") return t("arsiChat.connectionError");
  const { error, detail } = data as WorkerErrorBody;
  const detailStr = typeof detail === "string" ? detail : "";

  if (/TPM|rate_limit|too large|tokens per minute/i.test(detailStr)) {
    return t("arsiChat.providerOverloaded");
  }

  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }

  const groqInner = detailStr.match(/"message":"([^"]+)"/);
  if (groqInner?.[1]) {
    const msg = groqInner[1];
    if (/TPM|rate_limit|too large/i.test(msg)) return t("arsiChat.providerOverloaded");
    return msg.length > 280 ? `${msg.slice(0, 277)}…` : msg;
  }

  if (detailStr) {
    return detailStr.length > 280 ? `${detailStr.slice(0, 277)}…` : detailStr;
  }

  return t("arsiChat.connectionError");
}

const CHAT_MARKDOWN_PLUGINS = [remarkGfm];

function ChatMarkdownAnchor(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { href, children, ...rest } = props;
  const external = typeof href === "string" && /^https?:\/\//i.test(href);
  return (
    <a href={href} {...rest} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}

const CHAT_MARKDOWN_COMPONENTS = { a: ChatMarkdownAnchor };

// ─── Componente principal ─────────────────────────────────────────────────────
export default function SentinelChat({
  workerUrl,
  title,
  primaryColor,
  position = "bottom-right",
  greeting,
}: SentinelChatProps) {
  const { t, locale } = useI18n();
  /** Solo "es" | "en" para el worker y para Intl (i18n ya usa Locale). */
  const chatLocale: Locale = locale === "en" ? "en" : "es";
  const resolvedTitle = title ?? t("arsiChat.titleDefault");
  const resolvedGreeting = greeting ?? t("arsiChat.greetingDefault");
  const timeLocale = chatLocale === "es" ? "es-AR" : "en-US";

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: resolvedGreeting, id: "greeting" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unread, setUnread] = useState(0);
  const sessionId = useRef<string>(getOrCreateSession());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  /** Evita mismatch SSR/cliente: Intl es-AR difiere entre Node y el navegador. */
  const [timeReady, setTimeReady] = useState(false);

  useEffect(() => {
    setTimeReady(true);
  }, []);

  // Al cambiar idioma, el estado inicial del saludo no se recalcula solo: sincronizar UI.
  useEffect(() => {
    setMessages((prev) =>
      prev.some((m) => m.id === "greeting")
        ? prev.map((m) =>
            m.id === "greeting" ? { ...m, content: resolvedGreeting } : m
          )
        : prev
    );
    setError((prev) => (prev ? t("arsiChat.connectionError") : null));
  }, [resolvedGreeting, t]);

  // Scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus al abrir
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setError(null);

    const userMsg: ChatMessage = { role: "user", content: text, id: Date.now().toString() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const history: ChatHistoryTurn[] = messages
        .filter((m) => m.id !== "greeting")
        .map(({ role, content }) => ({ role, content }))
        .slice(-MAX_CHAT_HISTORY_MESSAGES);

      const res = await fetch(`${workerUrl.replace(/\/$/, "")}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...history, { role: "user" as const, content: text }],
          sessionId: sessionId.current,
          locale: chatLocale,
        }),
      });

      const raw = await res.text();
      const data: unknown = parseJsonSafe(raw);

      if (!res.ok) {
        setError(messageForWorkerFailure(data, t));
        return;
      }

      const reply = parseChatReply(data) || t("arsiChat.noReplyFromServer");

      const botMsg: ChatMessage = {
        role: "assistant",
        content: reply,
        id: `bot_${Date.now()}`,
      };
      setMessages((prev) => [...prev, botMsg]);

      if (!open) setUnread((n) => n + 1);
    } catch {
      setError(t("arsiChat.connectionError"));
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, open, workerUrl, t, chatLocale]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const posStyles: CSSProperties =
    position === "bottom-left"
      ? { bottom: "24px", left: "24px" }
      : { bottom: "24px", right: "24px" };

  const accentToken = primaryColor ?? "var(--accent)";
  const wrapStyle = {
    ...({ "--sc-primary": accentToken } as CSSProperties),
  };

  return (
    <>
      <style>{`
        .sc-wrap * { box-sizing: border-box; }
        .sc-wrap {
          font-family: var(--font-sans), system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .sc-window {
          position: fixed;
          width: 360px;
          max-height: 560px;
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border);
          box-shadow: 0 24px 48px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.03);
          background: var(--card);
          color: var(--text);
          transition: opacity 0.2s, transform 0.2s;
          z-index: 9999;
        }
        .sc-window.hidden { opacity: 0; transform: scale(0.98) translateY(8px); pointer-events: none; }
        .sc-header {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          background: var(--bg2);
          border-bottom: 1px solid var(--border);
        }
        /* Avatar: PNG fuente 46×52; mostramos 2× para tamaño legible sin recorte agresivo */
        .sc-avatar {
          position: relative;
          width: 72px;
          height: 72px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid rgba(200,245,80,.25);
          background: var(--bg3);
        }
        .sc-avatar-img {
          object-fit: cover;
          object-position: center center;
          image-rendering: crisp-edges;
          image-rendering: pixelated;
          transform: scale(1.3);
        }
        .sc-header-text { flex: 1; min-width: 0; }
        .sc-title { font-weight: 600; font-size: 13px; margin: 0; color: var(--text); letter-spacing: -0.02em; }
        .sc-status {
          font-size: 10px; font-family: var(--font-mono), monospace;
          color: var(--muted); margin: 2px 0 0; display: flex; align-items: center; gap: 6px;
        }
        .sc-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
        .sc-dot.pulse { animation: pulse-dot 2s ease-in-out infinite; }
        .sc-close {
          background: transparent; border: 1px solid var(--border2);
          color: var(--muted);
          width: 30px; height: 30px; border-radius: 8px; cursor: pointer;
          font-size: 18px; line-height: 1; display: flex; align-items: center; justify-content: center;
          transition: border-color 0.15s, background 0.15s, color 0.15s;
        }
        .sc-close:hover {
          border-color: rgba(200,245,80,.35);
          background: rgba(200,245,80,.07);
          color: var(--accent);
        }
        .sc-messages {
          flex: 1; overflow-y: auto; padding: 14px;
          display: flex; flex-direction: column; gap: 10px;
          background: var(--bg); min-height: 0;
        }
        .sc-messages::-webkit-scrollbar { width: 4px; }
        .sc-messages::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
        .sc-msg { display: flex; flex-direction: column; max-width: 85%; animation: sc-fade .2s ease; }
        @keyframes sc-fade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        .sc-msg.user { align-self: flex-end; align-items: flex-end; }
        .sc-msg.bot { align-self: flex-start; }
        .sc-bubble-user {
          background: var(--sc-primary);
          color: #0a0b0d;
          padding: 9px 12px;
          border-radius: 10px 10px 4px 10px;
          font-size: 12px; line-height: 1.5;
          word-break: break-word;
        }
        .sc-bubble-bot {
          background: var(--bg2);
          color: var(--text);
          padding: 9px 12px;
          border-radius: 10px 10px 10px 4px;
          font-size: 12px; line-height: 1.5;
          border: 1px solid var(--border);
          word-break: break-word;
        }
        .sc-bubble-bot:has(.sc-md) { overflow-x: auto; }
        .sc-md { font-size: 12px; line-height: 1.55; word-break: break-word; }
        .sc-md > *:first-child { margin-top: 0; }
        .sc-md > *:last-child { margin-bottom: 0; }
        .sc-md p { margin: 0.45em 0; }
        .sc-md p:first-child { margin-top: 0; }
        .sc-md p:last-child { margin-bottom: 0; }
        .sc-md ul, .sc-md ol { margin: 0.4em 0; padding-left: 1.2em; }
        .sc-md li { margin: 0.12em 0; }
        .sc-md li > p { margin: 0.2em 0; }
        .sc-md h1, .sc-md h2, .sc-md h3, .sc-md h4 {
          font-size: 1.05em;
          font-weight: 600;
          margin: 0.55em 0 0.3em;
          line-height: 1.35;
        }
        .sc-md h1:first-child, .sc-md h2:first-child, .sc-md h3:first-child, .sc-md h4:first-child { margin-top: 0; }
        .sc-md code {
          font-family: var(--font-mono), ui-monospace, monospace;
          font-size: 0.9em;
          background: var(--bg3);
          padding: 0.1em 0.35em;
          border-radius: 4px;
        }
        .sc-md pre {
          margin: 0.5em 0;
          padding: 8px 10px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow-x: auto;
          max-width: 100%;
        }
        .sc-md pre code {
          background: transparent;
          padding: 0;
          font-size: 0.88em;
          white-space: pre;
        }
        .sc-md a { color: var(--sc-primary); text-decoration: underline; text-underline-offset: 2px; }
        .sc-md a:hover { opacity: 0.9; }
        .sc-md blockquote {
          margin: 0.45em 0;
          padding: 0.2em 0 0.2em 10px;
          border-left: 3px solid var(--border2);
          color: var(--muted);
        }
        .sc-md strong { font-weight: 600; }
        .sc-md hr { border: none; border-top: 1px solid var(--border); margin: 0.65em 0; }
        .sc-md table {
          border-collapse: collapse;
          width: 100%;
          font-size: 0.95em;
          margin: 0.5em 0;
          max-width: 100%;
        }
        .sc-md th, .sc-md td {
          border: 1px solid var(--border);
          padding: 5px 8px;
          text-align: left;
          vertical-align: top;
        }
        .sc-md th { background: var(--bg3); font-weight: 600; }
        .sc-md tbody tr:nth-child(even) { background: rgba(255,255,255,.02); }
        .sc-time { font-size: 10px; font-family: var(--font-mono), monospace; color: var(--muted); margin-top: 4px; }
        .sc-typing { display: flex; gap: 4px; padding: 10px 12px; align-items: center; }
        .sc-typing span {
          width: 6px; height: 6px; background: var(--muted); border-radius: 50%;
          animation: sc-bounce 1.1s infinite;
        }
        .sc-typing span:nth-child(2) { animation-delay: .15s; }
        .sc-typing span:nth-child(3) { animation-delay: .3s; }
        @keyframes sc-bounce {
          0%,60%,100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        .sc-error {
          background: rgba(239,68,68,.08);
          color: var(--red);
          font-size: 11px; font-family: var(--font-mono), monospace;
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid rgba(239,68,68,.2);
          text-align: center;
        }
        .sc-input-area {
          padding: 10px 12px;
          display: flex; gap: 8px; align-items: flex-end;
          border-top: 1px solid var(--border);
          background: var(--card);
          flex-shrink: 0;
        }
        .sc-input {
          flex: 1;
          border: 1px solid var(--border2);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 12px;
          font-family: var(--font-mono), monospace;
          resize: none; outline: none;
          max-height: 100px; min-height: 38px; line-height: 1.45;
          transition: border-color 0.15s;
          background: var(--bg2);
          color: var(--text);
        }
        .sc-input::placeholder { color: var(--muted); }
        .sc-input:focus { border-color: var(--sc-primary); }
        .sc-send {
          width: 38px; height: 38px; border-radius: 8px; border: none;
          background: var(--sc-primary);
          color: #0a0b0d;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, transform 0.1s, opacity 0.15s;
          flex-shrink: 0;
        }
        .sc-send:hover:not(:disabled) { background: var(--accent-dim); transform: scale(1.03); }
        .sc-send:disabled { opacity: 0.4; cursor: default; transform: none; }
        .sc-powered {
          text-align: center;
          font-size: 9px;
          font-family: var(--font-mono), monospace;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--muted);
          padding: 6px 0 8px;
          flex-shrink: 0;
          background: var(--card);
          border-top: 1px solid var(--border);
        }
        .sc-trigger {
          position: fixed;
          width: 52px; height: 52px;
          border-radius: 12px;
          border: 1px solid rgba(200,245,80,.35);
          background: var(--sc-primary);
          color: #0a0b0d;
          cursor: pointer;
          display: flex;
          align-items: center; justify-content: center;
          box-shadow: 0 8px 24px rgba(0,0,0,.4);
          transition: transform 0.2s, background 0.15s, border-color 0.15s;
          z-index: 9998;
        }
        .sc-trigger:hover {
          transform: scale(1.05);
          background: var(--accent-dim);
          border-color: rgba(200,245,80,.5);
        }
        .sc-badge {
          position: absolute; top: -4px; right: -4px;
          background: var(--red);
          color: #fff;
          border-radius: 50%;
          width: 18px; height: 18px;
          font-size: 10px;
          font-family: var(--font-mono), monospace;
          font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid var(--card);
          pointer-events: none;
        }
      `}</style>

      <div className="sc-wrap" style={wrapStyle}>
        {/* Ventana del chat */}
        <div
          className={`sc-window ${open ? "" : "hidden"}`}
          style={{ ...posStyles, bottom: open ? posStyles.bottom : "-600px" }}
          role="dialog"
          aria-label={resolvedTitle}
          aria-modal="true"
        >
          {/* Header */}
          <div className="sc-header">
            <div className="sc-avatar" aria-hidden>
              <Image
                src="/Arsi.png"
                alt=""
                fill
                className="sc-avatar-img"
                sizes="32px"
                unoptimized
              />
            </div>
            <div className="sc-header-text">
              <p className="sc-title">{resolvedTitle}</p>
              <p className="sc-status">
                <span className={`sc-dot${loading ? "" : " pulse"}`} />
                {loading ? t("arsiChat.statusTyping") : t("arsiChat.statusOnline")}
              </p>
            </div>
            <button
              type="button"
              className="sc-close"
              onClick={() => setOpen(false)}
              aria-label={t("arsiChat.closeChatAria")}
            >
              ×
            </button>
          </div>

          {/* Mensajes */}
          <div className="sc-messages" role="log" aria-live="polite">
            {messages.map((msg) => (
              <div key={msg.id} className={`sc-msg ${msg.role === "user" ? "user" : "bot"}`}>
                <div className={msg.role === "user" ? "sc-bubble-user" : "sc-bubble-bot"}>
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <div className="sc-md">
                      <ReactMarkdown
                        remarkPlugins={CHAT_MARKDOWN_PLUGINS}
                        components={CHAT_MARKDOWN_COMPONENTS}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
                <span className="sc-time">
                  {timeReady
                    ? new Date().toLocaleTimeString(timeLocale, { hour: "2-digit", minute: "2-digit" })
                    : t("arsiChat.timePending")}
                </span>
              </div>
            ))}

            {loading && (
              <div className="sc-msg bot">
                <div className="sc-bubble-bot sc-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            {error !== null && error !== "" && <div className="sc-error">{error}</div>}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="sc-input-area">
            <textarea
              ref={inputRef}
              className="sc-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("arsiChat.inputPlaceholder")}
              rows={1}
              disabled={loading}
              aria-label={t("arsiChat.inputAria")}
            />
            <button
              type="button"
              className="sc-send"
              onClick={() => void sendMessage()}
              disabled={!input.trim() || loading}
              aria-label={t("arsiChat.sendAria")}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M14 8L2 2l2 6-2 6 12-6z" fill="currentColor" />
              </svg>
            </button>
          </div>

          <div className="sc-powered">{t("arsiChat.footerTag")}</div>
        </div>

        {/* Botón flotante */}
        <button
          type="button"
          className="sc-trigger"
          style={posStyles}
          onClick={() => setOpen((o) => !o)}
          aria-label={
            open ? `${t("arsiChat.closeVerb")} ${resolvedTitle}` : `${t("arsiChat.openVerb")} ${resolvedTitle}`
          }
        >
          {open ? (
            <span style={{ fontSize: 22, lineHeight: 1, fontWeight: 300 }} aria-hidden>
              ×
            </span>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {unread > 0 && !open && <span className="sc-badge">{unread}</span>}
        </button>
      </div>
    </>
  );
}
