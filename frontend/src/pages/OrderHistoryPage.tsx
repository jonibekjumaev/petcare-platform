import { Link as RouterLink } from "react-router";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { OrderStatus } from "@petcare/shared";
import { useGetAllOrdersQuery } from "../features/orders/orderApi";

const STATUS_META: Record<
  OrderStatus,
  { label: string; color: "warning" | "info" | "success" | "error" }
> = {
  [OrderStatus.PAUSE]: { label: "Pending", color: "warning" },
  [OrderStatus.PROCESS]: { label: "Processing", color: "info" },
  [OrderStatus.FINISH]: { label: "Completed", color: "success" },
  [OrderStatus.DELETE]: { label: "Cancelled", color: "error" },
};

export default function OrderHistoryPage() {
  const { data: orders, isLoading, isError } = useGetAllOrdersQuery();

  if (isLoading) return <CircularProgress sx={{ m: 4 }} />;
  if (isError || !orders) {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        Failed to load your orders.
      </Alert>
    );
  }

  if (orders.length === 0) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          You haven't placed any orders yet
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
        My Orders
      </Typography>

      {orders.map((order) => {
        const status = STATUS_META[order.orderStatus];

        return (
          <Accordion key={order._id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  pr: 2,
                }}
              >
                <Box>
                  <Typography variant="subtitle1">
                    Order #{order._id.slice(-8)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip
                    label={status.label}
                    color={status.color}
                    size="small"
                  />
                  <Typography variant="subtitle1">
                    ${order.orderTotal.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              {order.orderItems.map((item) => {
                const product = order.productData.find(
                  (p) => p._id === item.productId,
                );
                return (
                  <Box
                    key={item._id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    {product && (
                      <Box
                        component="img"
                        src={product.productImages[0]}
                        alt={product.productName}
                        sx={{
                          width: 56,
                          height: 56,
                          objectFit: "cover",
                          borderRadius: 1,
                        }}
                      />
                    )}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2">
                        {product?.productName ?? "Product no longer available"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.itemQuantity} × ${item.itemPrice}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      ${(item.itemQuantity * item.itemPrice).toFixed(2)}
                    </Typography>
                  </Box>
                );
              })}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Delivery
                </Typography>
                <Typography variant="body2">
                  ${order.orderDelivery.toFixed(2)}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Container>
  );
}
