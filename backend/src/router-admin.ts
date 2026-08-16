import express from "express";
import { verifyAdminSession } from "./middlewares/admin.middleware";
import { uploadProductImages } from "./libs/utils/multer.config"; // <-- o'zingdagi haqiqiy nom/yo'l bilan tekshirib qo'y
import {
  getLoginPage,
  login,
  logout,
  getDashboardPage,
  getProductsPage,
  getCreateProductPage,
  createProduct,
  getEditProductPage,
  updateProduct,
  updateOrderStatus,
  getOrdersPage,
  getMembersPage,
  updateMemberStatus,
} from "./controllers/admin.controller";

const routerAdmin = express.Router();

/** AUTH **/
routerAdmin.get("/admin", getLoginPage);
routerAdmin.post("/admin/login", login);
routerAdmin.get("/admin/logout", logout);

/** DASHBOARD **/
routerAdmin.get("/admin/dashboard", verifyAdminSession, getDashboardPage);

/** PRODUCT **/
routerAdmin.get("/admin/product/all", verifyAdminSession, getProductsPage);
routerAdmin.get(
  "/admin/product/create",
  verifyAdminSession,
  getCreateProductPage,
);
routerAdmin.post(
  "/admin/product/create",
  verifyAdminSession,
  uploadProductImages.array("productImages", 5),
  createProduct,
);
routerAdmin.get(
  "/admin/product/:id/edit",
  verifyAdminSession,
  getEditProductPage,
);
routerAdmin.post(
  "/admin/product/:id",
  verifyAdminSession,
  uploadProductImages.array("productImages", 5),
  updateProduct,
);

/** ORDER **/
routerAdmin.get("/admin/order/all", verifyAdminSession, getOrdersPage);
routerAdmin.post("/admin/order/:id", verifyAdminSession, updateOrderStatus);

/** MEMBER **/
routerAdmin.get("/admin/member/all", verifyAdminSession, getMembersPage);
routerAdmin.post("/admin/member/:id", verifyAdminSession, updateMemberStatus);

export default routerAdmin;
