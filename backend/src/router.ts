import { Router } from "express";
import { signup, login } from "./controllers/member.controller";

const router = Router();

/** Member */
router.post("/member/signup", signup);
router.post("/member/login", login);

export default router;
