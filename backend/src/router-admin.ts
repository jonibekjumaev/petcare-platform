import express from "express";
import { login, logout } from "./controllers/admin.controller";
const routerAdmin = express.Router();

routerAdmin.post("/admin/login", login);
routerAdmin.get("admin/logout", logout);
export default routerAdmin;
