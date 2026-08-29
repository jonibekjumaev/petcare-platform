import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  align?: "left" | "center";
  titleSx?: SxProps<Theme>;
  subtitleSx?: SxProps<Theme>;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  align = "left",
  titleSx,
  subtitleSx,
}: SectionHeadingProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", sm: "flex-end" },
        justifyContent: align === "center" ? "center" : "space-between",
        flexDirection: { xs: "column", sm: "row" },
        textAlign: align,
        gap: 2,
        mb: { xs: 3, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: align === "center" ? 620 : 720, mx: align === "center" ? "auto" : 0 }}>
        {eyebrow && (
          <Typography variant="overline" component="p" color="text.secondary">
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h2" component="h2" sx={[{ mt: 0.5 }, titleSx].filter(Boolean) as SxProps<Theme>}>
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={[{ mt: 1 }, subtitleSx].filter(Boolean) as SxProps<Theme>}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
  );
}
