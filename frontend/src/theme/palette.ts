
import type { PaletteOptions } from "@mui/material/styles";
import {
  moss,
  apricot,
  ink,
  lightSurface,
  darkSurface,
  lightText,
  darkText,
  lightSemantic,
  darkSemantic,
} from "./tokens";

declare module "@mui/material/styles" {
  interface CssThemeVariables {
    enabled: true;
  }

  interface Palette {
    moss: typeof moss;
    apricot: typeof apricot;
    ink: typeof ink;
  }
  interface PaletteOptions {
    moss?: typeof moss;
    apricot?: typeof apricot;
    ink?: typeof ink;
  }

  interface TypeBackground {
    muted: string;
    sunken: string;
  }
}

export const lightPalette: PaletteOptions = {
  mode: "light",

  primary: {
    main: moss[500],
    light: moss[400],
    dark: moss[600],
    contrastText: "#FFFFFF",
  },

  secondary: {
    main: apricot[500],
    light: apricot[300],
    dark: apricot[700],
    contrastText: ink[900],
  },

  success: { main: lightSemantic.success, light: lightSemantic.successBg, dark: lightSemantic.successText, contrastText: "#FFFFFF" },
  warning: { main: lightSemantic.warning, light: lightSemantic.warningBg, dark: lightSemantic.warningText, contrastText: ink[900] },
  error: { main: lightSemantic.error, light: lightSemantic.errorBg, dark: lightSemantic.errorText, contrastText: "#FFFFFF" },
  info: { main: lightSemantic.info, light: lightSemantic.infoBg, dark: lightSemantic.infoText, contrastText: "#FFFFFF" },

  background: {
    default: lightSurface.page,
    paper: lightSurface.paper,
    muted: lightSurface.muted,
    sunken: lightSurface.sunken,
  },

  text: {
    primary: lightText.primary,
    secondary: lightText.secondary,
    disabled: lightText.disabled,
  },

  divider: lightSurface.border,

  action: {
    hover: lightSurface.hover,
    hoverOpacity: 0.06,
    selected: lightSurface.selected,
    selectedOpacity: 0.1,
    disabled: ink[300],
    disabledBackground: lightSurface.sunken,
    focus: moss[100],
    focusOpacity: 0.12,
    active: ink[500],
    activatedOpacity: 0.12,
  },

  moss,
  apricot,
  ink,
};

export const darkPalette: PaletteOptions = {
  mode: "dark",

  primary: {
    main: moss[300],
    light: moss[200],
    dark: moss[400],
    contrastText: ink[900],
  },

  secondary: {
    main: apricot[300],
    light: apricot[200],
    dark: apricot[400],
    contrastText: ink[900],
  },

  success: { main: darkSemantic.success, light: darkSemantic.successText, dark: darkSemantic.successBg, contrastText: ink[900] },
  warning: { main: darkSemantic.warning, light: darkSemantic.warningText, dark: darkSemantic.warningBg, contrastText: ink[900] },
  error: { main: darkSemantic.error, light: darkSemantic.errorText, dark: darkSemantic.errorBg, contrastText: ink[900] },
  info: { main: darkSemantic.info, light: darkSemantic.infoText, dark: darkSemantic.infoBg, contrastText: ink[900] },

  background: {
    default: darkSurface.page,
    paper: darkSurface.paper,
    muted: darkSurface.muted,
    sunken: darkSurface.sunken,
  },

  text: {
    primary: darkText.primary,
    secondary: darkText.secondary,
    disabled: darkText.disabled,
  },

  divider: darkSurface.border,

  action: {
    hover: darkSurface.hover,
    hoverOpacity: 0.1,
    selected: darkSurface.selected,
    selectedOpacity: 0.16,
    disabled: darkText.disabled,
    disabledBackground: darkSurface.sunken,
    focus: "rgba(143, 184, 159, 0.24)",
    focusOpacity: 0.24,
    active: darkText.secondary,
    activatedOpacity: 0.24,
  },

  moss,
  apricot,
  ink,
};
