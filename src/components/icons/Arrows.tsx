import type { CSSProperties } from 'react';

type IconProps = {
  size?: number;
  className?: string;
  style?: CSSProperties;
  'aria-hidden'?: boolean;
};

const inline: CSSProperties = {
  display: 'inline-block',
  verticalAlign: 'middle',
  flexShrink: 0,
};

/** Flecha derecha (flujos, pasos, relación A–B). */
export function IconArrowRight({ size = 14, className, style, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ ...inline, ...style }}
      aria-hidden={ariaHidden}
    >
      <path
        d="M5 12h14M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Flecha izquierda (volver, enlaces atrás). */
export function IconArrowLeft({ size = 14, className, style, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ ...inline, ...style }}
      aria-hidden={ariaHidden}
    >
      <path
        d="M19 12H5M11 5l-7 7 7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
