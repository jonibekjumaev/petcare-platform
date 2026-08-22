import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useGetAllProductsQuery } from "../features/products/productApi";

export default function ProductsPage() {
  const { data: products, isLoading, isError } = useGetAllProductsQuery();

  if (isLoading) {
    return <CircularProgress sx={{ m: 4 }} />;
  }

  if (isError || !products) {
    return <Alert severity="error">Failed to load products.</Alert>;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product._id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardMedia
                component="img"
                height="180"
                image={product.productImages[0]}
                alt={product.productName}
              />
              <CardContent>
                <Typography variant="h6">{product.productName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ${product.productPrice}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
