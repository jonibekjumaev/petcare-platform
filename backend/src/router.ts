import { Router } from "express";
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
import { uploadProductImages } from "./libs/utils/multer.config";

const router = Router();

/** Member */

router.post("/member/signup", signup);
router.post("/member/login", login);
router.get("/member/detail", verifyAuth, memberDetail);
router.post("/member/update", verifyAuth, updateMember);

/** Pet  */

router.post("/pet/create", verifyAuth, createPet);
router.get("/pet/all", verifyAuth, getAllPets);
router.get("/pet/:id", verifyAuth, getPet);
router.post("/pet/update", verifyAuth, updatePet);
router.post("/pet/delete", verifyAuth, deletePet);

/** Products  */
router.post(
  "/product/create",
  verifyAuth,
  uploadProductImages.array("productImages", 5),
  createProduct,
);
router.get("/product/all", getAllProducts);
router.get("/product/:id", getProduct);
router.post(
  "/product/update",
  verifyAuth,
  uploadProductImages.array("productImages", 5),
  updateProduct,
);

export default router;
