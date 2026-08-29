import type { Components, Theme } from "@mui/material/styles";
import {
  radius,
  shadow,
  shadowValues,
  surfaceVar,
  duration,
  easing,
  lightSurface,
  darkSurface,
} from "./tokens";

const transition = (props: string[], ms: number = duration.base) =>
  props.map((p) => `${p} ${ms}ms ${easing.out}`).join(", ");

export const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      ":root": {
        "--pc-shadow-xs": shadowValues.light.xs,
        "--pc-shadow-sm": shadowValues.light.sm,
        "--pc-shadow-md": shadowValues.light.md,
        "--pc-shadow-lg": shadowValues.light.lg,
        "--pc-shadow-focus": shadowValues.light.focus,
        "--pc-border-strong": lightSurface.borderStrong,
        "--pc-hover": lightSurface.hover,
        "--pc-selected": lightSurface.selected,
        "--pc-image-well": lightSurface.muted,
        ...theme.applyStyles("dark", {
          "--pc-shadow-xs": shadowValues.dark.xs,
          "--pc-shadow-sm": shadowValues.dark.sm,
          "--pc-shadow-md": shadowValues.dark.md,
          "--pc-shadow-lg": shadowValues.dark.lg,
          "--pc-shadow-focus": shadowValues.dark.focus,
          "--pc-border-strong": darkSurface.borderStrong,
          "--pc-hover": darkSurface.hover,
          "--pc-selected": darkSurface.selected,
          "--pc-image-well": darkSurface.muted,
        }),
      },

      html: {
        scrollBehavior: "smooth",
        scrollbarGutter: "stable",
        colorScheme: "light",
        ...theme.applyStyles("dark", { colorScheme: "dark" }),
      },

      body: {
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        textRendering: "optimizeLegibility",
      },

      "img, svg, video": { display: "block", maxWidth: "100%" },

      "@media (prefers-reduced-motion: reduce)": {
        "*, *::before, *::after": {
          animationDuration: "0.01ms !important",
          animationIterationCount: "1 !important",
          transitionDuration: "0.01ms !important",
          scrollBehavior: "auto !important",
        },
      },

      "*:focus-visible": {
        outline: `2px solid ${theme.vars.palette.primary.main}`,
        outlineOffset: 2,
        borderRadius: 4,
      },

      "::selection": {
        backgroundColor: theme.vars.palette.primary.main,
        color: theme.vars.palette.primary.contrastText,
      },
    }),
  },

  MuiContainer: {
    defaultProps: { maxWidth: "lg" },
    styleOverrides: {
      root: ({ theme }) => ({
        paddingInline: theme.spacing(2),
        [theme.breakpoints.up("md")]: { paddingInline: theme.spacing(3) },
      }),
    },
  },

  MuiPaper: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: { backgroundImage: "none" },
      rounded: { borderRadius: radius.lg },
      outlined: ({ theme }) => ({ borderColor: theme.vars.palette.divider }),
    },
  },

  MuiCard: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.lg,
        border: `1px solid ${theme.vars.palette.divider}`,
        boxShadow: "none",
        backgroundImage: "none",
        overflow: "hidden",
        transition: transition(["box-shadow", "transform", "border-color"]),
      }),
    },
  },

  MuiCardActionArea: {
    styleOverrides: {
      root: {
        "&:hover .MuiCardActionArea-focusHighlight": { opacity: 0 },
      },
    },
  },

  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: 20,
        "&:last-child": { paddingBottom: 20 },
      },
    },
  },

  MuiButton: {
    defaultProps: {
      disableElevation: true,
      disableRipple: true,
    },
    variants: [
      {
        props: { variant: "contained", color: "primary" },
        style: ({ theme }: { theme: Theme }) => ({
          "&:hover": {
            backgroundColor: theme.vars.palette.primary.dark,
            boxShadow: shadow.sm,
            transform: "translateY(-1px)",
          },
        }),
      },
      {
        props: { variant: "contained", color: "secondary" },
        style: ({ theme }: { theme: Theme }) => ({
          "&:hover": {
            backgroundColor: theme.vars.palette.secondary.light,
            boxShadow: shadow.sm,
            transform: "translateY(-1px)",
          },
        }),
      },
    ],
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.pill,
        paddingInline: 22,
        paddingBlock: 10,
        transition: transition(
          ["background-color", "box-shadow", "transform", "border-color", "color"],
          duration.fast,
        ),
        "&:active": { transform: "scale(0.98)" },
        "&.Mui-disabled": { color: theme.vars.palette.text.disabled },
      }),
      sizeSmall: { paddingInline: 16, paddingBlock: 6, fontSize: "0.875rem" },
      sizeLarge: { paddingInline: 30, paddingBlock: 14, fontSize: "1rem" },

      outlined: ({ theme }) => ({
        borderColor: surfaceVar.borderStrong,
        color: theme.vars.palette.text.primary,
        "&:hover": {
          borderColor: theme.vars.palette.primary.main,
          backgroundColor: surfaceVar.hover,
          color: theme.vars.palette.primary.main,
        },
      }),

      text: {
        paddingInline: 12,
        "&:hover": { backgroundColor: surfaceVar.hover },
      },
    },
  },

  MuiIconButton: {
    defaultProps: { disableRipple: true },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.pill,
        transition: transition(["background-color", "color", "transform"], duration.fast),
        "&:hover": {
          backgroundColor: surfaceVar.hover,
          color: theme.vars.palette.primary.main,
        },
        "&:active": { transform: "scale(0.94)" },
      }),
    },
  },

  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.pill,
        borderColor: theme.vars.palette.divider,
        textTransform: "none",
        fontWeight: 600,
        "&.Mui-selected": {
          backgroundColor: theme.vars.palette.primary.main,
          color: theme.vars.palette.primary.contrastText,
          "&:hover": { backgroundColor: theme.vars.palette.primary.dark },
        },
      }),
    },
  },

  MuiTextField: { defaultProps: { variant: "outlined" } },

  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.md,
        backgroundColor: theme.vars.palette.background.paper,
        transition: transition(["border-color", "box-shadow", "background-color"], duration.fast),
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.vars.palette.divider,
          transition: transition(["border-color"], duration.fast),
        },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: surfaceVar.borderStrong },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderWidth: 1,
          borderColor: theme.vars.palette.primary.main,
        },
        "&.Mui-focused": { boxShadow: shadow.focus },
      }),
      input: { padding: "13px 16px" },
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: "0.9375rem",
        "&.Mui-focused": { color: theme.vars.palette.primary.main },
      }),
    },
  },

  MuiSelect: { styleOverrides: { root: { borderRadius: radius.md } } },

  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRadius: radius.md,
        border: `1px solid ${theme.vars.palette.divider}`,
        boxShadow: shadow.md,
        marginTop: 6,
      }),
      list: { padding: 6 },
    },
  },

  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.sm,
        fontSize: "0.9375rem",
        "&:hover": { backgroundColor: surfaceVar.hover },
        "&.Mui-selected": {
          backgroundColor: surfaceVar.selected,
          color: theme.vars.palette.primary.main,
          "&:hover": { backgroundColor: surfaceVar.selected },
        },
      }),
    },
  },

  MuiChip: {
    styleOverrides: {
      root: { borderRadius: radius.pill, fontWeight: 500, fontSize: "0.8125rem" },
      outlined: { borderColor: surfaceVar.borderStrong },
      filled: ({ theme }) => ({
        backgroundColor: theme.vars.palette.background.muted,
        color: theme.vars.palette.text.secondary,
      }),
      clickable: {
        transition: transition(["background-color", "border-color", "color"], duration.fast),
      },
    },
  },

  MuiBadge: {
    styleOverrides: {
      badge: { fontWeight: 700, fontSize: "0.6875rem", minWidth: 18, height: 18 },
    },
  },

  MuiAvatar: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.vars.palette.background.sunken,
        color: theme.vars.palette.text.secondary,
        fontWeight: 600,
      }),
    },
  },

  MuiDivider: {
    styleOverrides: {
      root: ({ theme }) => ({ borderColor: theme.vars.palette.divider }),
    },
  },

  MuiSkeleton: {
    defaultProps: { animation: "wave" },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.vars.palette.background.sunken,
        borderRadius: radius.sm,
      }),
      rounded: { borderRadius: radius.lg },
    },
  },

  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }) => ({
        backgroundColor: theme.vars.palette.text.primary,
        color: theme.vars.palette.background.paper,
        borderRadius: radius.sm,
        fontSize: "0.75rem",
        fontWeight: 500,
        padding: "6px 10px",
      }),
      arrow: ({ theme }) => ({ color: theme.vars.palette.text.primary }),
    },
  },

  MuiAppBar: {
    defaultProps: { elevation: 0, color: "transparent" },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.vars.palette.background.default,
        color: theme.vars.palette.text.primary,
        backgroundImage: "none",
      }),
    },
  },

  MuiTabs: {
    styleOverrides: {
      root: { minHeight: 44 },
      indicator: ({ theme }) => ({
        height: 3,
        borderRadius: 3,
        backgroundColor: theme.vars.palette.primary.main,
      }),
    },
  },

  MuiTab: {
    defaultProps: { disableRipple: true },
    styleOverrides: {
      root: ({ theme }) => ({
        minHeight: 44,
        textTransform: "none",
        fontSize: "0.9375rem",
        fontWeight: 600,
        color: theme.vars.palette.text.secondary,
        transition: transition(["color"], duration.fast),
        "&.Mui-selected": { color: theme.vars.palette.primary.main },
      }),
    },
  },

  MuiLink: {
    defaultProps: { underline: "hover" },
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.vars.palette.primary.main,
        textUnderlineOffset: "0.2em",
        transition: transition(["color"], duration.fast),
      }),
    },
  },

  MuiListItemButton: {
    defaultProps: { disableRipple: true },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.md,
        transition: transition(["background-color", "color"], duration.fast),
        "&:hover": { backgroundColor: surfaceVar.hover },
        "&.Mui-selected": {
          backgroundColor: surfaceVar.selected,
          color: theme.vars.palette.primary.main,
          "&:hover": { backgroundColor: surfaceVar.selected },
        },
      }),
    },
  },

  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: theme.vars.palette.background.default,
        backgroundImage: "none",
        borderColor: theme.vars.palette.divider,
      }),
    },
  },

  MuiAlert: {
    variants: [
      {
        props: { variant: "soft" },
        style: { borderRadius: radius.md, border: "1px solid transparent" },
      },
      {
        props: { variant: "standard", severity: "success" },
        style: ({ theme }: { theme: Theme }) => ({
          backgroundColor: theme.vars.palette.success.light,
          color: theme.vars.palette.success.dark,
        }),
      },
      {
        props: { variant: "standard", severity: "error" },
        style: ({ theme }: { theme: Theme }) => ({
          backgroundColor: theme.vars.palette.error.light,
          color: theme.vars.palette.error.dark,
        }),
      },
      {
        props: { variant: "standard", severity: "warning" },
        style: ({ theme }: { theme: Theme }) => ({
          backgroundColor: theme.vars.palette.warning.light,
          color: theme.vars.palette.warning.dark,
        }),
      },
      {
        props: { variant: "standard", severity: "info" },
        style: ({ theme }: { theme: Theme }) => ({
          backgroundColor: theme.vars.palette.info.light,
          color: theme.vars.palette.info.dark,
        }),
      },
    ],
    styleOverrides: {
      root: { borderRadius: radius.md, fontSize: "0.9375rem", alignItems: "center" },
    },
  },

  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRadius: radius.xl,
        border: `1px solid ${theme.vars.palette.divider}`,
        boxShadow: shadow.lg,
        backgroundImage: "none",
      }),
    },
  },

  MuiDialogTitle: {
    styleOverrides: {
      root: { fontSize: "1.25rem", fontWeight: 600, padding: "24px 24px 8px" },
    },
  },
  MuiDialogContent: { styleOverrides: { root: { padding: "8px 24px" } } },
  MuiDialogActions: { styleOverrides: { root: { padding: "16px 24px 24px", gap: 8 } } },

  MuiSnackbarContent: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.md,
        boxShadow: shadow.lg,
        backgroundColor: theme.vars.palette.text.primary,
        color: theme.vars.palette.background.paper,
      }),
    },
  },

  MuiCircularProgress: {
    styleOverrides: {
      root: ({ theme }) => ({ color: theme.vars.palette.primary.main }),
    },
  },

  MuiLinearProgress: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.pill,
        height: 6,
        backgroundColor: theme.vars.palette.background.sunken,
      }),
      bar: { borderRadius: radius.pill },
    },
  },

  MuiAccordion: {
    defaultProps: { elevation: 0, disableGutters: true },
    styleOverrides: {
      root: ({ theme }) => ({
        border: `1px solid ${theme.vars.palette.divider}`,
        borderRadius: radius.lg,
        backgroundImage: "none",
        "&:not(:last-child)": { marginBottom: 12 },
        "&::before": { display: "none" },
      }),
    },
  },

  MuiAccordionSummary: {
    styleOverrides: {
      root: { borderRadius: radius.lg, minHeight: 56 },
      content: { fontWeight: 600 },
    },
  },
};

declare module "@mui/material/Alert" {
  interface AlertPropsVariantOverrides {
    soft: true;
  }
}
