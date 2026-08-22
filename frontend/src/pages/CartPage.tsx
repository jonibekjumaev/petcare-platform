import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import type { RootState } from "../app/store";
import { removeFromCart, updateQuantity } from "../features/cart/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);

  const subtotal = items.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button
          variant="contained"
          component={RouterLink}
          to="/"
          sx={{ mt: 2 }}
        >
          Browse Products
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          {items.map((item) => (
            <Paper
              key={item.productId}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                mb: 2,
              }}
            >
              <Box
                component="img"
                src={item.productImage}
                alt={item.productName}
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />

              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1">{item.productName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ${item.productPrice} each
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  size="small"
                  disabled={item.quantity <= 1}
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        productId: item.productId,
                        quantity: item.quantity - 1,
                      }),
                    )
                  }
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        productId: item.productId,
                        quantity: item.quantity + 1,
                      }),
                    )
                  }
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>

              <Typography
                variant="subtitle1"
                sx={{ width: 80, textAlign: "right" }}
              >
                ${(item.productPrice * item.quantity).toFixed(2)}
              </Typography>

              <IconButton
                color="error"
                onClick={() => dispatch(removeFromCart(item.productId))}
              >
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography>Subtotal</Typography>
              <Typography>${subtotal.toFixed(2)}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Shipping and taxes calculated at checkout.
            </Typography>
            <Button variant="contained" fullWidth disabled>
              Proceed to Checkout
            </Button>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1, textAlign: "center" }}
            >
              Checkout page — coming in the next step
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
