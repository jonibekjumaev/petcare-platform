import { createBrowserRouter } from "react-router";
import ProductsPage from "../pages/ProductsPage";
import LoginPage from "../pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProductsPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
