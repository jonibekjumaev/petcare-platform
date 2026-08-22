import { Link as RouterLink } from "react-router";
import { useSelector } from "react-redux";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PetsIcon from "@mui/icons-material/Pets";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import type { RootState } from "../app/store";
import { useGetAllProductsQuery } from "../features/products/productApi";

const FEATURES = [
  {
    icon: <StorefrontIcon fontSize="large" color="primary" />,
    title: "Shop quality pet products",
    description:
      "Food, toys, grooming and health essentials, picked for every kind of pet.",
  },
  {
    icon: <PetsIcon fontSize="large" color="primary" />,
    title: "Register your pets",
    description:
      "Keep a profile for each pet — type, breed, age, weight — all in one place.",
  },
  {
    icon: <SmartToyIcon fontSize="large" color="primary" />,
    title: "Get AI-powered advice",
    description:
      "Chat with an AI advisor that knows your pet's profile and order history.",
  },
];

export default function HomePage() {
  const member = useSelector((state: RootState) => state.auth.member);
  const { data: products, isLoading } = useGetAllProductsQuery();
  const featuredProducts = products?.slice(0, 4);

  return (
    <Box>
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container sx={{ textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            More than a pet store
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, opacity: 0.9, maxWidth: 640, mx: "auto" }}
          >
            Shop for your pets, keep their profiles up to date, and get
            personalized advice from an AI advisor that actually knows them.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={RouterLink}
              to="/products"
            >
              Browse Products
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={RouterLink}
              to="/chat"
              sx={{
                borderColor: "primary.contrastText",
                color: "primary.contrastText",
              }}
            >
              Chat with our AI Advisor
            </Button>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {FEATURES.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: "center" }}>
                {feature.icon}
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: "grey.50", py: 8 }}>
        <Container>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4">Featured Products</Typography>
            <Button component={RouterLink} to="/products">
              View All
            </Button>
          </Box>

          {isLoading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={3}>
              {featuredProducts?.map((product) => (
                <Grid key={product._id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    component={RouterLink}
                    to={`/product/${product._id}`}
                    sx={{ textDecoration: "none", display: "block" }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={product.productImages[0]}
                      alt={product.productName}
                    />
                    <CardContent>
                      <Typography variant="subtitle1">
                        {product.productName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${product.productPrice}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {!member && (
        <Container sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Ready to get started?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Create an account to register your pets and unlock personalized AI
            advice.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/signup"
          >
            Sign Up
          </Button>
        </Container>
      )}
    </Box>
  );
}
