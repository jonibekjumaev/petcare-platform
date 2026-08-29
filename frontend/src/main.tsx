import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

import "@fontsource-variable/inter/index.css";
import "@fontsource-variable/fraunces/index.css";

import "./index.css";
import { store } from "./app/store";
import { router } from "./app/router";
import { theme } from "./theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <InitColorSchemeScript defaultMode="system" />
    <Provider store={store}>
      <ThemeProvider
        theme={theme}
        defaultMode="system"
        disableTransitionOnChange
      >
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
