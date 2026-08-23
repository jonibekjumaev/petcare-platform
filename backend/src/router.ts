import { Router } from "express";
import { uploadPetImage } from "./libs/utils/multer.config";

import {
  signup,
  login,
  memberDetail,
  updateMember,
} from "./controllers/member.controller";
import { verifyAuth } from "./middlewares/auth.middleware";

import {
  createPet,
  deletePet,
  getAllPets,
  getPet,
  updatePet,
} from "./controllers/pet.controller";

import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "./controllers/product.controller";

import {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrder,
} from "./controllers/order.controller";

import {
  createSession,
  getAllSessions,
  getSessionMessages,
  sendMessage,
} from "./controllers/chat.controller";

const router = Router();

/** Member */

router.post("/member/signup", signup);
router.post("/member/login", login);
router.get("/member/detail", verifyAuth, memberDetail);
router.post("/member/update", verifyAuth, updateMember);

/** Pet  */

router.post(
  "/pet/create",
  verifyAuth,
  uploadPetImage.single("petImage"),
  createPet,
);
router.get("/pet/all", verifyAuth, getAllPets);
router.get("/pet/:id", verifyAuth, getPet);
router.post(
  "/pet/update",
  verifyAuth,
  uploadPetImage.single("petImage"),
  updatePet,
);
router.post("/pet/delete", verifyAuth, deletePet);

/** Products  */

router.get("/product/all", getAllProducts);
router.get("/product/:id", getProduct);

/** Order */

router.post("/order/create", verifyAuth, createOrder);
router.get("/order/all", verifyAuth, getAllOrders);
router.get("/order/:id", verifyAuth, getOrder);
router.post("/order/update", verifyAuth, updateOrder);

/** Chat */

router.post("/chat/session/create", verifyAuth, createSession);
router.get("/chat/session/all", verifyAuth, getAllSessions);
router.get("/chat/session/:id", verifyAuth, getSessionMessages);
router.post("/chat/message", verifyAuth, sendMessage);

export default router;
