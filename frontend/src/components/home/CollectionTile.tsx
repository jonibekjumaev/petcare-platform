import { Link as RouterLink } from "react-router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Art } from "../../assets/art";
import { duration as motion, easing, shadow } from "../../theme";

const BLOB = "58% 42% 35% 65% / 45% 65% 35% 55%";

interface CollectionTileProps {
  to: string;
  label: string;
  src?: string;
  alt?: string;
  icon?: Art;
  active?: boolean;
}

export default function CollectionTile({ to, label, src, alt, icon: Icon, active = false }: CollectionTileProps) {
  return (
    <Box
      component={RouterLink}
      to={to}
      sx={(t) => ({
        display: "block",
        textDecoration: "none",
        color: "inherit",
        textAlign: "center",
        "@media (hover: hover)": {
          "&:hover .tile-photo": { transform: "scale(1.09)" },
          "&:hover .tile-ring": {
            borderColor: t.vars.palette.primary.main,
            boxShadow: shadow.lg,
          },
          "&:hover .tile-label": { color: t.vars.palette.primary.main },
        },
        "&:focus-visible": { outline: "none" },
        "&:focus-visible .tile-ring": {
          borderColor: t.vars.palette.primary.main,
          outline: `2px solid ${t.vars.palette.primary.main}`,
          outlineOffset: 3,
        },
        "&:focus-visible .tile-photo": { transform: "scale(1.09)" },
      })}
    >
      <Box sx={{ position: "relative", aspectRatio: "1 / 1" }}>
        <Box
          className="tile-ring"
          sx={(t) => ({
            position: "absolute",
            inset: 0,
            borderRadius: BLOB,
            overflow: "hidden",
            border: "1.5px solid",
            borderColor: active ? t.vars.palette.primary.main : t.vars.palette.moss[200],
            backgroundColor: t.vars.palette.background.muted,
            boxShadow: active ? shadow.lg : shadow.md,
            transition: `border-color ${motion.base}ms ${easing.out}, box-shadow ${motion.base}ms ${easing.out}`,
            ...t.applyStyles("dark", { borderColor: active ? t.vars.palette.primary.main : t.vars.palette.moss[700] }),
          })}
        >
          {src ? (
            <Box
              component="img"
              className="tile-photo"
              src={src}
              alt={alt ?? label}
              loading="lazy"
              decoding="async"
              width={560}
              height={560}
              sx={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: `transform ${motion.slow}ms ${easing.out}`,
                "@media (prefers-reduced-motion: reduce)": { transition: "none" },
              }}
            />
          ) : (
            Icon && (
              <Box
                className="tile-photo"
                sx={(t) => ({
                  width: "100%",
                  height: "100%",
                  display: "grid",
                  placeItems: "center",
                  color: t.vars.palette.primary.main,
                  transition: `transform ${motion.slow}ms ${easing.out}`,
                  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
                })}
              >
                <Icon width="42%" height="42%" />
              </Box>
            )
          )}
        </Box>
      </Box>

      <Typography
        className="tile-label"
        variant="subtitle2"
        component="h3"
        sx={(t) => ({
          mt: { xs: 1.5, md: 2 },
          fontSize: { xs: ".9375rem", md: "1.0625rem" },
          fontWeight: 500,
          color: active ? t.vars.palette.primary.main : "inherit",
          transition: `color ${motion.base}ms ${easing.out}`,
        })}
      >
        {label}
      </Typography>
    </Box>
  );
}
