
import { createTheme } from "@mui/material/styles";
import type { Shadows } from "@mui/material/styles";

import { lightPalette, darkPalette } from "./palette";
import { typography } from "./typography";
import { components } from "./components";
import { radius, shadow, duration, easing, breakpoint } from "./tokens";

const shadows = [
  "none",
  shadow.xs,
  shadow.sm,
  shadow.sm,
  shadow.md,
  shadow.md,
  shadow.md,
  shadow.lg,
  ...Array<string>(17).fill(shadow.lg),
] as Shadows;

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: "data-mui-color-scheme" },

  colorSchemes: {
    light: { palette: lightPalette },
    dark: { palette: darkPalette },
  },

  typography,
  components,

  breakpoints: { values: breakpoint },

  spacing: 8,

  shape: { borderRadius: radius.md },

  shadows,

  transitions: {
    duration: {
      shortest: duration.fast,
      shorter: duration.fast,
      short: duration.base,
      standard: duration.base,
      complex: duration.slow,
      enteringScreen: duration.base,
      leavingScreen: duration.fast,
    },
    easing: {
      easeInOut: easing.standard,
      easeOut: easing.out,
      easeIn: easing.standard,
      sharp: easing.standard,
    },
  },

  zIndex: { appBar: 1100, drawer: 1200, modal: 1300, snackbar: 1400, tooltip: 1500 },
});

export * from "./tokens";
