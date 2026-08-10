import express from "express";
import path from "path";
import { errorHandler } from "./middlewares/error.middleware";
import router from "./router";

const app = express();

// Entrance:
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errorHandler);

export default app;
