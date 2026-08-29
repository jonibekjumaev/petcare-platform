
import { Link as RouterLink } from "react-router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { PawMark } from "../assets/art";

interface BrandMarkProps {
  inverted?: boolean;
  size?: "sm" | "md";
}

export default function BrandMark({ inverted = false, size = "md" }: BrandMarkProps) {
  const disc = size === "md" ? 32 : 28;

  return (
    <Box
      component={RouterLink}
      to="/"
      aria-label="PetCare home"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1.25,
        textDecoration: "none",
        color: inverted ? "common.white" : "text.primary",
      }}
    >
      <Box
        sx={{
          width: disc,
          height: disc,
          flex: "none",
          borderRadius: "50%",
          bgcolor: "primary.main",
          color: "primary.contrastText",
          display: "grid",
          placeItems: "center",
        }}
      >
        <PawMark width={disc * 0.55} height={disc * 0.55} />
      </Box>
      <Typography
        component="span"
        sx={{
          fontFamily: (t) => t.typography.h2.fontFamily,
          fontWeight: 600,
          fontSize: size === "md" ? "1.25rem" : "1.125rem",
          letterSpacing: "-.02em",
        }}
      >
        PetCare
      </Typography>
    </Box>
  );
}
