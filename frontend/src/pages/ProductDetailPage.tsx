import { useState } from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useGetProductQuery } from "../features/products/productApi";
import { addToCart } from "../features/cart/cartSlice";
import { formatPrice } from "../lib/format";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductQuery(id!, {
    skip: !id,
  });

  if (isLoading) return <CircularProgress sx={{ m: 4 }} />;
  if (isError || !product) {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        Failed to load product.
      </Alert>
    );
  }

  const outOfStock = product.productLeftCount === 0;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        productName: product.productName,
        productPrice: product.productPrice,
        productImage: product.productImages[0],
      }),
    );
    setSnackbarOpen(true);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            component="img"
            src={product.productImages[0]}
            alt={product.productName}
            sx={{ width: "100%", borderRadius: 2 }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h4" gutterBottom>
            {product.productName}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            <Chip label={product.productCategory} size="small" />
            <Chip label={product.productPetType} size="small" />
            <Chip label={product.productSize} size="small" />
            {outOfStock && (
              <Chip label="Out of stock" color="error" size="small" />
            )}
          </Box>

          <Typography variant="h5" color="primary" gutterBottom>
            {formatPrice(product.productPrice)}
          </Typography>

          {product.productDesc && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {product.productDesc}
            </Typography>
          )}

          <Typography variant="body2" color="text.secondary">
            {product.productLeftCount} left in stock
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {product.productViews} views · {product.productLikes} likes
          </Typography>

          <Button
            variant="contained"
            size="large"
            disabled={outOfStock}
            onClick={handleAddToCart}
          >
            {outOfStock ? "Out of stock" : "Add to Cart"}
          </Button>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Added to cart"
      />
    </Container>
  );
}
