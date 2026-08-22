import { Link as RouterLink } from "react-router";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: "grey.900", color: "grey.100", mt: "auto", py: 6 }}
    >
      <Container>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="h6" gutterBottom>
              PetCare
            </Typography>
            <Typography variant="body2" color="grey.400">
              Quality products for your pets, plus AI-powered advice grounded in
              their profile and order history.
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, sm: 4 }}>
            <Typography variant="subtitle2" gutterBottom>
              Shop
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                component={RouterLink}
                to="/products"
                color="grey.400"
                underline="hover"
              >
                Products
              </Link>
              <Link
                component={RouterLink}
                to="/cart"
                color="grey.400"
                underline="hover"
              >
                Cart
              </Link>
              <Link
                component={RouterLink}
                to="/chat"
                color="grey.400"
                underline="hover"
              >
                AI Advisor
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 4 }}>
            <Typography variant="subtitle2" gutterBottom>
              Account
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                component={RouterLink}
                to="/pets"
                color="grey.400"
                underline="hover"
              >
                My Pets
              </Link>
              <Link
                component={RouterLink}
                to="/orders"
                color="grey.400"
                underline="hover"
              >
                My Orders
              </Link>
              <Link
                component={RouterLink}
                to="/profile"
                color="grey.400"
                underline="hover"
              >
                Profile
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          color="grey.500"
          sx={{ mt: 4, textAlign: "center" }}
        >
          © {new Date().getFullYear()} PetCare. Built as a portfolio project.
        </Typography>
      </Container>
    </Box>
  );
}
