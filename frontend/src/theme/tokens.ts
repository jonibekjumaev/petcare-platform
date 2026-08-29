export const moss = {
  50: "#F1F6F2",
  100: "#DCE9E0",
  200: "#B9D3C2",
  300: "#8FB89F",
  400: "#5C9878",
  500: "#3F7355",
  600: "#336046",
  700: "#264A36",
  800: "#1B3527",
  900: "#142619",
} as const;

export const apricot = {
  50: "#FFF4EC",
  100: "#FFE3D0",
  200: "#FFC7A3",
  300: "#FFA873",
  400: "#FF8C4B",
  500: "#F2762E",
  600: "#D45E1B",
  700: "#C4551A",
  800: "#9E4314",
  900: "#7A340F",
} as const;

export const ink = {
  900: "#1C1B19",
  800: "#2A2823",
  700: "#3D3A34",
  600: "#57534A",
  500: "#6B665C",
  400: "#8C8679",
  300: "#B0AA9C",
  200: "#D4CEC1",
  100: "#E8E2D6",
  50: "#F6F2EA",
} as const;

export const lightSurface = {
  page: "#FFFFFF",
  paper: "#FAF8F4",
  muted: "#F1EDE5",
  sunken: "#E7E2D7",
  border: "#E8E3D9",
  borderStrong: "#D6D0C2",
  hover: "rgba(63, 115, 85, 0.06)",
  selected: "#EAF1EC",
} as const;

export const darkSurface = {
  page: "#121410",
  paper: "#1A1D17",
  muted: "#22261F",
  sunken: "#2A2F27",
  border: "#343A30",
  borderStrong: "#474E42",
  hover: "rgba(143, 184, 159, 0.10)",
  selected: "#243026",
} as const;

export const lightText = {
  primary: ink[900],
  secondary: ink[500],
  disabled: ink[300],
} as const;

export const darkText = {
  primary: "#F1EEE5",
  secondary: "#A9A497",
  disabled: "#6B675D",
} as const;

export const lightSemantic = {
  success: moss[500],
  successBg: "#EAF2EC",
  successText: "#264A36",
  warning: "#E0A63C",
  warningBg: "#FDF4E3",
  warningText: "#8A6318",
  error: "#C4553C",
  errorBg: "#FAEDE9",
  errorText: "#8E3A26",
  info: "#4E7C93",
  infoBg: "#EAF1F4",
  infoText: "#345765",
} as const;

export const darkSemantic = {
  success: moss[300],
  successBg: "#1E2A22",
  successText: "#B9D3C2",
  warning: "#E8BC6B",
  warningBg: "#2E2617",
  warningText: "#F2D49A",
  error: "#E08A72",
  errorBg: "#2E1D18",
  errorText: "#F0B5A4",
  info: "#86AFC2",
  infoBg: "#1B2830",
  infoText: "#B4D0DD",
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const shadow = {
  xs: "var(--pc-shadow-xs)",
  sm: "var(--pc-shadow-sm)",
  md: "var(--pc-shadow-md)",
  lg: "var(--pc-shadow-lg)",
  focus: "var(--pc-shadow-focus)",
} as const;

export const shadowValues = {
  light: {
    xs: "0 1px 2px rgba(28, 27, 25, 0.04)",
    sm: "0 2px 8px rgba(28, 27, 25, 0.06)",
    md: "0 8px 24px rgba(28, 27, 25, 0.08)",
    lg: "0 16px 40px rgba(28, 27, 25, 0.10)",
    focus: `0 0 0 3px ${moss[200]}`,
  },
  dark: {
    xs: "0 1px 2px rgba(0, 0, 0, 0.30)",
    sm: "0 2px 8px rgba(0, 0, 0, 0.40)",
    md: "0 10px 28px rgba(0, 0, 0, 0.50)",
    lg: "0 20px 48px rgba(0, 0, 0, 0.60)",
    focus: `0 0 0 3px rgba(143, 184, 159, 0.45)`,
  },
} as const;

export const surfaceVar = {
  borderStrong: "var(--pc-border-strong)",
  hover: "var(--pc-hover)",
  selected: "var(--pc-selected)",
  imageWell: "var(--pc-image-well)",
} as const;

export const duration = {
  fast: 150,
  base: 220,
  slow: 320,
  slower: 480,
} as const;

export const easing = {
  out: "cubic-bezier(0.22, 1, 0.36, 1)",
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

export const fontFamily = {
  display: '"Fraunces Variable", "Fraunces", Georgia, "Times New Roman", serif',
  body: '"Inter Variable", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
} as const;

export const breakpoint = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

export const up = (bp: keyof typeof breakpoint) =>
  `@media (min-width:${breakpoint[bp]}px)`;

export const section = {
  sm: { xs: 4, md: 6 },
  md: { xs: 6, md: 10 },
  lg: { xs: 8, md: 14 },
} as const;
