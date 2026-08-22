import { Link as RouterLink } from "react-router";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";

export default function Header() {
  const dispatch = useDispatch();
  const member = useSelector((state: RootState) => state.auth.member);

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

        {member ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1">Hi, {member.memberNick}</Typography>
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
