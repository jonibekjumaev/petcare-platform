import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import type { RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";
import { PRIMARY_LINKS } from "./navLinks";
import BrandMark from "./BrandMark";
import ColorModeToggle from "./ColorModeToggle";
import MobileNav from "./MobileNav";
import { duration as motion, easing } from "../theme";

const ACCOUNT_MENU = [
  { label: "My Orders", to: "/orders", icon: <ReceiptLongOutlinedIcon fontSize="small" /> },
  { label: "My Pets", to: "/pets", icon: <PetsOutlinedIcon fontSize="small" /> },
  { label: "Profile", to: "/profile", icon: <PersonOutlineIcon fontSize="small" /> },
];

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const member = useSelector((state: RootState) => state.auth.member);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 8 });

  const handleLogout = () => {
    setAnchor(null);
    dispatch(logout());
    navigate("/");
  };

  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);
  const visibleLinks = PRIMARY_LINKS.filter((link) => !link.auth || member);

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: (t) => `color-mix(in srgb, ${t.vars.palette.background.default} 86%, transparent)`,
          backdropFilter: "blur(10px)",
          borderBottom: 1,
          borderColor: scrolled ? "divider" : "transparent",
          transition: `border-color ${motion.base}ms ${easing.out}`,
        }}
      >
        <Container>
          <Toolbar disableGutters sx={{ gap: { xs: 1, md: 3 }, minHeight: { xs: 62, md: 70 } }}>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              sx={{ display: { md: "none" }, ml: -1 }}
            >
              <MenuIcon />
            </IconButton>

            <BrandMark />

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, ml: 1 }}>
              {visibleLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Button
                    key={link.to}
                    component={RouterLink}
                    to={link.to}
                    disableRipple
                    sx={{
                      px: 1.75,
                      fontWeight: active ? 600 : 500,
                      color: active ? "primary.main" : "text.secondary",
                      "&:hover": { color: "text.primary", bgcolor: "action.hover" },
                      "&::after": active
                        ? {
                            content: '""',
                            position: "absolute",
                            left: 14,
                            right: 14,
                            bottom: 2,
                            height: 2,
                            borderRadius: 1,
                            bgcolor: "primary.main",
                          }
                        : undefined,
                    }}
                  >
                    {link.label}
                  </Button>
                );
              })}
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Tooltip title="Search products">
              <IconButton component={RouterLink} to="/products" aria-label="Search products">
                <SearchIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <ColorModeToggle />

            <Tooltip title="Cart">
              <IconButton
                component={RouterLink}
                to="/cart"
                aria-label={cartCount === 1 ? "Cart, 1 item" : `Cart, ${cartCount} items`}
              >
                <Badge
                  badgeContent={cartCount}
                  color="secondary"
                  key={cartCount}
                  sx={{
                    "& .MuiBadge-badge": {
                      animation: cartCount > 0 ? `pcPop ${motion.slow}ms ${easing.spring}` : "none",
                    },
                    "@keyframes pcPop": {
                      "0%": { transform: "scale(1)" },
                      "45%": { transform: "scale(1.35)" },
                      "100%": { transform: "scale(1)" },
                    },
                    "@media (prefers-reduced-motion: reduce)": {
                      "& .MuiBadge-badge": { animation: "none" },
                    },
                  }}
                >
                  <ShoppingBagOutlinedIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>

            {member ? (
              <>
                <Button
                  component={RouterLink}
                  to="/profile"
                  disableRipple
                  sx={{
                    display: { xs: "none", sm: "inline-flex" },
                    px: 1.5,
                    fontWeight: isActive("/profile") ? 600 : 500,
                    color: isActive("/profile") ? "primary.main" : "text.secondary",
                    "&:hover": { color: "text.primary", bgcolor: "action.hover" },
                  }}
                >
                  My Page
                </Button>

                <Tooltip title={member.memberNick}>
                  <IconButton
                    onClick={(e) => setAnchor(e.currentTarget)}
                    aria-label="Account menu"
                    aria-haspopup="true"
                    sx={{ ml: 0.5, p: 0.25 }}
                  >
                    <Avatar
                      src={member.memberImage}
                      alt={member.memberNick}
                      sx={{ width: 34, height: 34, fontSize: ".8125rem" }}
                    >
                      {member.memberNick.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchor}
                  open={Boolean(anchor)}
                  onClose={() => setAnchor(null)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  slotProps={{ paper: { sx: { minWidth: 208 } } }}
                >
                  <Box sx={{ px: 1.75, py: 1 }}>
                    <Box sx={{ fontSize: ".8125rem", color: "text.secondary" }}>Signed in as</Box>
                    <Box sx={{ fontWeight: 600 }}>{member.memberNick}</Box>
                  </Box>
                  <Divider sx={{ my: 0.5 }} />
                  {ACCOUNT_MENU.map((item) => (
                    <MenuItem
                      key={item.to}
                      component={RouterLink}
                      to={item.to}
                      onClick={() => setAnchor(null)}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      {item.label}
                    </MenuItem>
                  ))}
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Log out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1, ml: 0.5 }}>
                <Button component={RouterLink} to="/login" size="small">
                  Log in
                </Button>
                <Button component={RouterLink} to="/signup" variant="contained" size="small">
                  Sign up
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <MobileNav open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
