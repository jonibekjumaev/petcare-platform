import { useState, type SyntheticEvent } from "react";
import { Link as RouterLink } from "react-router";
import { useSelector } from "react-redux";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { OrderStatus } from "@petcare/shared";
import type { RootState } from "../app/store";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../features/orders/orderApi";
import { formatPrice } from "../lib/format";

// DELETE (cancelled) orders are intentionally excluded — only these
// three categories are shown to the customer.
const TABS: { status: OrderStatus; label: string }[] = [
  { status: OrderStatus.PAUSE, label: "Paused Orders" },
  { status: OrderStatus.PROCESS, label: "Process Orders" },
  { status: OrderStatus.FINISH, label: "Finished Orders" },
];

const CARD_BRANDS = ["VISA", "MASTERCARD", "AMEX", "PAYPAL"];

export default function OrderHistoryPage() {
  const member = useSelector((state: RootState) => state.auth.member);

  const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.PAUSE);
  const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);

  const {
    data: orders,
    isLoading,
    isError,
  } = useGetAllOrdersQuery({ orderStatus: activeTab });
  const [updateOrderStatus, { isLoading: isUpdating, error: updateError }] =
    useUpdateOrderStatusMutation();

  const handleTabChange = (_event: SyntheticEvent, value: OrderStatus) => {
    setActiveTab(value);
  };

  const handlePay = async (orderId: string) => {
    setPayingOrderId(orderId);
    try {
      await updateOrderStatus({
        _id: orderId,
        orderStatus: OrderStatus.PROCESS,
      }).unwrap();
    } catch {
      /* Xato yuqorida Alert orqali ko'rsatiladi */
    } finally {
      setPayingOrderId(null);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelingOrderId) return;
    try {
      await updateOrderStatus({
        _id: cancelingOrderId,
        orderStatus: OrderStatus.DELETE,
      }).unwrap();
      setCancelingOrderId(null);
    } catch {
      /* Dialog ochiq qoladi, foydalanuvchi qayta urinishi mumkin */
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Track and manage your purchases
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.status}
                value={tab.status}
                label={tab.label}
                sx={{ fontWeight: 600 }}
              />
            ))}
          </Tabs>

          {isLoading && <CircularProgress sx={{ m: 4 }} />}

          {isError && (
            <Alert severity="error" sx={{ my: 2 }}>
              Failed to load your orders.
            </Alert>
          )}

          {updateError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Action failed. Please try again.
            </Alert>
          )}

          {!isLoading && !isError && orders && orders.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" gutterBottom>
                No orders here yet
              </Typography>
              <Button
                variant="contained"
                component={RouterLink}
                to="/"
                sx={{ mt: 2 }}
              >
                Browse Products
              </Button>
            </Box>
          )}

          {!isLoading &&
            !isError &&
            orders?.map((order) => {
              const subtotal = order.orderTotal - order.orderDelivery;

              return (
                <Paper key={order._id} sx={{ p: 3, mb: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 1.5 }}
                  >
                    Order #{order._id.slice(-8).toUpperCase()} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>

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
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 1.5,
                            overflow: "hidden",
                            bgcolor: "action.hover",
                            flexShrink: 0,
                          }}
                        >
                          {product && (
                            <Box
                              component="img"
                              src={product.productImages[0]}
                              alt={product.productName}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                          )}
                        </Box>
                        <Typography sx={{ flexGrow: 1 }}>
                          {product?.productName ??
                            "Product no longer available"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatPrice(item.itemPrice)} × {item.itemQuantity} =
                        </Typography>
                        <Typography sx={{ fontWeight: 600 }}>
                          {formatPrice(item.itemPrice * item.itemQuantity)}
                        </Typography>
                      </Box>
                    );
                  })}

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Product price
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatPrice(subtotal)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      +
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Delivery cost
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatPrice(order.orderDelivery)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      =
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {formatPrice(order.orderTotal)}
                    </Typography>

                    {order.orderStatus === OrderStatus.PAUSE && (
                      <Box sx={{ ml: "auto", display: "flex", gap: 1.5 }}>
                        <Button
                          variant="outlined"
                          color="inherit"
                          size="small"
                          disabled={isUpdating}
                          onClick={() => setCancelingOrderId(order._id)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          disabled={isUpdating}
                          onClick={() => handlePay(order._id)}
                          sx={{ minWidth: 88 }}
                        >
                          {payingOrderId === order._id && isUpdating ? (
                            <CircularProgress
                              size={16}
                              sx={{ color: "inherit" }}
                            />
                          ) : (
                            "Payment"
                          )}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Paper>
              );
            })}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, mb: 3, textAlign: "center" }}>
            <Avatar
              src={member?.memberImage}
              sx={{ width: 72, height: 72, mx: "auto", mb: 1.5 }}
            >
              <PersonIcon />
            </Avatar>
            <Typography variant="h6">{member?.memberNick}</Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ letterSpacing: 1 }}
            >
              {member?.memberType}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                color: "text.secondary",
              }}
            >
              <LocationOnIcon fontSize="small" />
              <Typography variant="body2">
                {member?.memberAddress || "No address on file"}
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Payment Method
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box
                sx={{
                  px: 2,
                  py: 1.25,
                  borderRadius: 1,
                  bgcolor: "action.hover",
                }}
              >
                <Typography variant="body2">
                  Card number : **** 4090 2002 7495
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Box
                  sx={{
                    flex: 1,
                    px: 2,
                    py: 1.25,
                    borderRadius: 1,
                    bgcolor: "action.hover",
                  }}
                >
                  <Typography variant="body2">07 / 24</Typography>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    px: 2,
                    py: 1.25,
                    borderRadius: 1,
                    bgcolor: "action.hover",
                  }}
                >
                  <Typography variant="body2">CVV : 010</Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  px: 2,
                  py: 1.25,
                  borderRadius: 1,
                  bgcolor: "action.hover",
                }}
              >
                <Typography variant="body2">
                  {member?.memberNick ?? "Card holder"}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              {CARD_BRANDS.map((brand) => (
                <Typography
                  key={brand}
                  component="span"
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 0.5,
                    bgcolor: "action.selected",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                  }}
                >
                  {brand}
                </Typography>
              ))}
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 2 }}
            >
              Demo card on file — shown for display purposes only, not a real
              payment method.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Cancel confirmation */}
      <Dialog
        open={!!cancelingOrderId}
        onClose={() => setCancelingOrderId(null)}
      >
        <DialogTitle>Cancel this order?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will cancel your order and restock the items. This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelingOrderId(null)}>Keep Order</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmCancel}
            disabled={isUpdating}
          >
            Cancel Order
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
