
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useColorScheme } from "@mui/material/styles";

export default function ColorModeToggle() {
  const { mode, systemMode, setMode } = useColorScheme();

  if (!mode) {
    return <Box sx={{ width: 40, height: 40 }} aria-hidden="true" />;
  }

  const resolved = mode === "system" ? (systemMode ?? "light") : mode;
  const next = resolved === "dark" ? "light" : "dark";
  const title = next === "dark" ? "Switch to dark mode" : "Switch to light mode";

  return (
    <Tooltip title={title}>
      <IconButton onClick={() => setMode(next)} aria-label={title} color="inherit">
        {resolved === "dark" ? (
          <LightModeOutlinedIcon fontSize="small" />
        ) : (
          <DarkModeOutlinedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}
