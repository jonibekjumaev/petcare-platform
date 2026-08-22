import { createBrowserRouter } from "react-router";
import Layout from "../components/Layout";
import ProductsPage from "../pages/ProductsPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <ProductsPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
    ],
  },
]);
