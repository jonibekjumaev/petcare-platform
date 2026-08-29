import { Link as RouterLink, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlineOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import type { ReactNode } from "react";
import type { RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";
import { PRIMARY_LINKS, ACCOUNT_LINKS } from "./navLinks";
import BrandMark from "./BrandMark";

const ICONS: Record<string, ReactNode> = {
  "/products": <StorefrontOutlinedIcon />,
  "/chat": <ChatBubbleOutlineIcon />,
  "/pets": <PetsOutlinedIcon />,
  "/help": <HelpOutlineIcon />,
  "/orders": <ReceiptLongOutlinedIcon />,
  "/profile": <PersonOutlineIcon />,
};

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const member = useSelector((state: RootState) => state.auth.member);

  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);
  const links = PRIMARY_LINKS.filter((link) => !link.auth || member);
  const accountLinks = member ? ACCOUNT_LINKS : [];

  const row = (to: string, label: string) => (
    <ListItemButton
      key={to}
      component={RouterLink}
      to={to}
      onClick={onClose}
      selected={isActive(to)}
      sx={{ minHeight: 52, borderRadius: 2, mb: 0.5 }}
    >
      <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>{ICONS[to]}</ListItemIcon>
      <ListItemText slotProps={{ primary: { sx: { fontWeight: 500, fontSize: "1rem" } } }} primary={label} />
    </ListItemButton>
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: { xs: "84vw", sm: 340 }, maxWidth: 380 } } }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box onClick={onClose}>
            <BrandMark />
          </Box>
          <IconButton onClick={onClose} aria-label="Close menu">
            <CloseIcon />
          </IconButton>
        </Box>

        {member && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              mb: 2,
              borderRadius: 3,
              bgcolor: "background.muted",
            }}
          >
            <Avatar src={member.memberImage} alt={member.memberNick} sx={{ width: 40, height: 40 }}>
              {member.memberNick.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {member.memberNick}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {member.memberPoints} points
              </Typography>
            </Box>
          </Box>
        )}

        <List sx={{ p: 0 }}>{links.map((link) => row(link.to, link.label))}</List>

        {accountLinks.length > 0 && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="overline" color="text.secondary" sx={{ px: 1.5 }}>
              Account
            </Typography>
            <List sx={{ p: 0, mt: 0.5 }}>
              {accountLinks
                .filter((link) => !links.some((primary) => primary.to === link.to))
                .map((link) => row(link.to, link.label))}
            </List>
          </>
        )}

        <Box sx={{ mt: "auto", pt: 2 }}>
          <Divider sx={{ mb: 2 }} />
          {member ? (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={() => {
                dispatch(logout());
                onClose();
              }}
            >
              Log out
            </Button>
          ) : (
            <Box sx={{ display: "grid", gap: 1 }}>
              <Button
                fullWidth
                variant="contained"
                component={RouterLink}
                to="/signup"
                onClick={onClose}
              >
                Create an account
              </Button>
              <Button fullWidth variant="outlined" component={RouterLink} to="/login" onClick={onClose}>
                Log in
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
