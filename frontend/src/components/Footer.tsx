
import { Link as RouterLink } from "react-router";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import BrandMark from "./BrandMark";

const COLUMNS: { heading: string; links: { label: string; to: string }[] }[] = [
  {
    heading: "Shop",
    links: [
      { label: "All products", to: "/products" },
      { label: "Food", to: "/products?category=FOOD" },
      { label: "Toys", to: "/products?category=TOY" },
      { label: "Accessories", to: "/products?category=ACCESSORY" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "My pets", to: "/pets" },
      { label: "My orders", to: "/orders" },
      { label: "Profile", to: "/profile" },
      { label: "Cart", to: "/cart" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help centre", to: "/help" },
      { label: "AI Advisor", to: "/chat" },
    ],
  },
];

const PROMISES = [
  { icon: <LocalShippingOutlinedIcon fontSize="small" />, label: "Free delivery over $45" },
  { icon: <VerifiedUserOutlinedIcon fontSize="small" />, label: "Vet-reviewed range" },
  { icon: <AutorenewIcon fontSize="small" />, label: "30-day returns" },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        bgcolor: (t) => t.vars.palette.moss[900],
        color: (t) => t.vars.palette.moss[100],
        pt: { xs: 6, md: 8 },
        pb: 3,
      }}
    >
      <Container>
        <Grid container spacing={{ xs: 4, md: 5 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <BrandMark inverted />
            <Typography
              variant="body2"
              sx={{ mt: 2, opacity: 0.72, maxWidth: "34ch", lineHeight: 1.7 }}
            >
              Quality products for your pets, plus advice grounded in their profile and your order
              history.
            </Typography>

            <Box sx={{ display: "grid", gap: 1.25, mt: 3 }}>
              {PROMISES.map((p) => (
                <Box
                  key={p.label}
                  sx={{ display: "flex", alignItems: "center", gap: 1.25, fontSize: ".875rem" }}
                >
                  <Box sx={{ color: (t) => t.vars.palette.moss[300], display: "flex" }}>{p.icon}</Box>
                  <Box sx={{ opacity: 0.8 }}>{p.label}</Box>
                </Box>
              ))}
            </Box>
          </Grid>

          {COLUMNS.map((column) => (
            <Grid key={column.heading} size={{ xs: 6, sm: 4, md: 8 / 3 }}>
              <Typography
                variant="overline"
                component="h2"
                sx={{ color: (t) => t.vars.palette.moss[300], display: "block", mb: 1.5 }}
              >
                {column.heading}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {column.links.map((link) => (
                  <Link
                    key={link.label}
                    component={RouterLink}
                    to={link.to}
                    underline="hover"
                    sx={{
                      color: "inherit",
                      opacity: 0.76,
                      py: 0.5,
                      fontSize: ".875rem",
                      "&:hover": { opacity: 1, color: "inherit" },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ mt: 5, mb: 2.5, borderColor: "rgba(220, 233, 224, .16)" }} />

        <Typography variant="body2" sx={{ opacity: 0.6, textAlign: { xs: "center", sm: "left" } }}>
          © {new Date().getFullYear()} PetCare. Built as a portfolio project.
        </Typography>
      </Container>
    </Box>
  );
}
