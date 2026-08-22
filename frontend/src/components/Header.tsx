import { Link as RouterLink } from "react-router";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";

export default function Header() {
  const dispatch = useDispatch();
  const member = useSelector((state: RootState) => state.auth.member);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, color: "inherit", textDecoration: "none" }}
        >
          PetCare
        </Typography>

        <IconButton color="inherit" component={RouterLink} to="/cart">
          <Badge badgeContent={cartCount} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        {member ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button color="inherit" component={RouterLink} to="/chat">
              AI Advisor
            </Button>
            <Button color="inherit" component={RouterLink} to="/pets">
              My Pets
            </Button>
            <Button color="inherit" component={RouterLink} to="/orders">
              My Orders
            </Button>
            <Button color="inherit" component={RouterLink} to="/profile">
              Hi, {member.memberNick}
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Log out
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button color="inherit" component={RouterLink} to="/login">
              Log in
            </Button>
            <Button color="inherit" component={RouterLink} to="/signup">
              Sign up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
