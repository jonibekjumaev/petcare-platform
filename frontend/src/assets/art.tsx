
import type { SVGProps } from "react";

export type Art = (props: SVGProps<SVGSVGElement>) => React.JSX.Element;

export const PawMark: Art = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <ellipse cx="7" cy="8.5" rx="2.3" ry="2.9" />
    <ellipse cx="12" cy="6.7" rx="2.3" ry="3" />
    <ellipse cx="17" cy="8.5" rx="2.3" ry="2.9" />
    <path d="M12 11.6c2.9 0 5.2 2.4 5.2 4.9 0 1.9-1.5 3.1-3.5 3.1-1 0-1.3-.4-1.7-.4s-.7.4-1.7.4c-2 0-3.5-1.2-3.5-3.1 0-2.5 2.3-4.9 5.2-4.9z" />
  </svg>
);

export const DogPortrait: Art = (props) => (
  <svg
    viewBox="0 0 260 220"
    fill="none"
    stroke="currentColor"
    strokeWidth={3.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-label="Line drawing of a sitting dog"
    {...props}
  >
    <path d="M92 66c-4-16-2-30 2-33 5-4 16 4 22 12" />
    <path d="M164 66c4-16 2-30-2-33-5-4-16 4-22 12" />
    <path d="M128 34c22 0 40 18 40 42 0 15-7 26-17 33 12 8 20 22 20 40v34c0 6-4 10-10 10h-66c-6 0-10-4-10-10v-34c0-18 8-32 20-40-10-7-17-18-17-33 0-24 18-42 40-42z" />
    <circle cx="114" cy="72" r="3.6" fill="currentColor" />
    <circle cx="142" cy="72" r="3.6" fill="currentColor" />
    <path d="M128 84c-4 0-7 3-7 6s3 5 7 5 7-2 7-5-3-6-7-6z" fill="currentColor" stroke="none" />
    <path d="M128 95v6M128 101c-4 5-11 5-14 1M128 101c4 5 11 5 14 1" />
    <path d="M168 148c14 4 24 14 24 26 0 6-4 9-9 7" />
    <path d="M96 182h20M140 182h20" />
    <circle cx="196" cy="60" r="9" strokeDasharray="2 7" />
    <circle cx="52" cy="150" r="13" strokeDasharray="2 7" />
  </svg>
);

const glyphProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const FoodGlyph: Art = (props) => (
  <svg {...glyphProps} {...props}>
    <path d="M5.5 7.5h13l-1.2 13H6.7z" />
    <path d="M8 7.5V6a4 4 0 018 0v1.5" />
    <path d="M9.5 13h5M12 10.5v5" />
  </svg>
);

export const ToyGlyph: Art = (props) => (
  <svg {...glyphProps} {...props}>
    <circle cx="12" cy="12" r="7.5" />
    <path d="M4.8 9.5c3 1 6.4 1 9.7-.6M19.2 14.5c-3-1-6.4-1-9.7.6" />
  </svg>
);

export const AccessoryGlyph: Art = (props) => (
  <svg {...glyphProps} {...props}>
    <path d="M6 6.5a6 6 0 0112 0v3a6 6 0 01-12 0z" />
    <path d="M6 11h12M12 14.5V21" />
    <circle cx="12" cy="21" r="1.2" />
  </svg>
);

export const SupplementGlyph: Art = (props) => (
  <svg {...glyphProps} {...props}>
    <rect x="6.5" y="7" width="11" height="14" rx="3" />
    <path d="M9.5 7V4.6h5V7" />
    <path d="M9.8 13.5h4.4M12 11.3v4.4" />
  </svg>
);

export const HygieneGlyph: Art = (props) => (
  <svg {...glyphProps} {...props}>
    <path d="M8 21V10c0-1.2 1-2 2-2h4c1 0 2 .8 2 2v11z" />
    <path d="M10 8V5.5h4V8M12 3v2.5M8 14h8" />
  </svg>
);

export const ProductFallback: Art = (props) => (
  <svg {...glyphProps} strokeWidth={1.2} role="img" aria-label="No product photo" {...props}>
    <path d="M5.5 7.5h13l-1.2 13H6.7z" />
    <path d="M8 7.5V6a4 4 0 018 0v1.5" />
  </svg>
);
