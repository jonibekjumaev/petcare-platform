
import type { TypographyVariantsOptions } from "@mui/material/styles";
import { fontFamily, up } from "./tokens";

const displayAxes = {
  fontVariationSettings: '"SOFT" 40, "WONK" 0, "opsz" 120',
} as const;

export const typography: TypographyVariantsOptions = {
  fontFamily: fontFamily.body,

  htmlFontSize: 16,

  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,

  h1: {
    fontFamily: fontFamily.display,
    fontSize: "2.25rem",
    fontWeight: 600,
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
    ...displayAxes,
    [up("sm")]: { fontSize: "2.75rem" },
    [up("md")]: { fontSize: "3.25rem" },
  },

  h2: {
    fontFamily: fontFamily.display,
    fontSize: "1.625rem",
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: "-0.015em",
    ...displayAxes,
    [up("md")]: { fontSize: "2rem" },
  },

  h3: {
    fontFamily: fontFamily.display,
    fontSize: "1.375rem",
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: "-0.01em",
    ...displayAxes,
    [up("md")]: { fontSize: "1.5rem" },
  },

  h4: {
    fontFamily: fontFamily.body,
    fontSize: "1.25rem",
    fontWeight: 600,
    lineHeight: 1.35,
    letterSpacing: "-0.005em",
  },

  h5: {
    fontFamily: fontFamily.body,
    fontSize: "1.125rem",
    fontWeight: 600,
    lineHeight: 1.4,
  },

  h6: {
    fontFamily: fontFamily.body,
    fontSize: "1rem",
    fontWeight: 600,
    lineHeight: 1.45,
  },

  subtitle1: { fontSize: "1rem", fontWeight: 500, lineHeight: 1.5 },
  subtitle2: { fontSize: "0.875rem", fontWeight: 600, lineHeight: 1.5 },

  body1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.65 },
  body2: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.6 },

  button: {
    fontSize: "0.9375rem",
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: "0.01em",
    textTransform: "none",
  },

  caption: { fontSize: "0.75rem", fontWeight: 400, lineHeight: 1.5 },

  overline: {
    fontSize: "0.75rem",
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
};
