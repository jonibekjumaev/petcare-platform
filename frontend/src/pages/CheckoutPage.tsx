import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import type { RootState } from "../app/store";
import { clearCart } from "../features/cart/cartSlice";
import { useGetAllPetsQuery } from "../features/pets/petApi";
import { useCreateOrderMutation } from "../features/orders/orderApi";
import type { OrderDTO } from "@petcare/shared";
import { formatPrice } from "../lib/format";

const DELIVERY_FEE = 5;

// Pet selection is optional: a customer without a registered pet can still
// place an order, so no validation is enforced on this field.
const checkoutSchema = z.object({
  petId: z.string().optional(),
});
type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [placedOrder, setPlacedOrder] = useState<OrderDTO | null>(null);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const {
    data: pets,
    isLoading: petsLoading,
    isError: petsError,
  } = useGetAllPetsQuery();
  const [createOrder, { isLoading: isPlacingOrder, error: orderError }] =
    useCreateOrderMutation();

  const { control, handleSubmit } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { petId: "" },
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0,
  );
  const total = subtotal + DELIVERY_FEE;

  const onSubmit = async (values: CheckoutFormValues) => {
    try {
      const order = await createOrder({
        // "" means "no pet selected" — send undefined so it's omitted
        // from the request entirely, matching CreateOrderRequestDTO.
        petId: values.petId ? values.petId : undefined,
        orderDelivery: DELIVERY_FEE,
        items: cartItems.map((item) => ({
          productId: item.productId,
          itemQuantity: item.quantity,
        })),
      }).unwrap();

      dispatch(clearCart());
      setPlacedOrder(order);
    } catch {
      /* Handled orderError*/
    }
  };

  if (placedOrder) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Order placed!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          Order #{placedOrder._id}
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Total: {formatPrice(placedOrder.orderTotal)}
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  if (cartItems.length === 0) {
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

  if (petsLoading) return <CircularProgress sx={{ m: 4 }} />;
  if (petsError)
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        Failed to load your pets.
      </Alert>
    );

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Pet{" "}
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
                  (optional)
                </Typography>
              </Typography>

              {pets && pets.length === 0 ? (
                <Alert
                  severity="info"
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      component={RouterLink}
                      to="/pets/new"
                    >
                      Add Pet
                    </Button>
                  }
                >
                  You don't have any pets yet. You can still place this order —
                  add a pet if you'd like to link it to one.
                </Alert>
              ) : (
                <Controller
                  name="petId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="pet-select-label">
                        Select a pet
                      </InputLabel>
                      <Select
                        labelId="pet-select-label"
                        label="Select a pet"
                        {...field}
                      >
                        <MenuItem value="">
                          <em>No pet — order without linking a pet</em>
                        </MenuItem>
                        {pets?.map((pet) => (
                          <MenuItem key={pet._id} value={pet._id}>
                            {pet.petName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              )}
            </Paper>

            {orderError && (
              <Alert severity="error" sx={{ mt: 3 }}>
                Failed to place order. Please try again.
              </Alert>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {cartItems.map((item) => (
                <Box
                  key={item.productId}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    {item.productName} × {item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    {formatPrice(item.productPrice * item.quantity)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Subtotal</Typography>
                <Typography>{formatPrice(subtotal)}</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography>Delivery</Typography>
                <Typography>{formatPrice(DELIVERY_FEE)}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">{formatPrice(total)}</Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isPlacingOrder}
              >
                Place Order
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
