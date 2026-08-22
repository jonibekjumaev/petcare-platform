import { createBrowserRouter } from "react-router";
import ProductsPage from "../pages/productsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProductsPage />,
  },
]);
