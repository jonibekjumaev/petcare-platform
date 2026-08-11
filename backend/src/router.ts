import { Router } from "express";
import {
  signup,
  login,
  memberDetail,
  updateMember,
} from "./controllers/member.controller";
import { verifyAuth } from "./middlewares/auth.middleware";

const router = Router();

/** Member */

router.post("/member/signup", signup);
router.post("/member/login", login);
router.get("/member/detail", verifyAuth, memberDetail);
router.post("/member/update", verifyAuth, updateMember);

/** Pet  */

export default router;
