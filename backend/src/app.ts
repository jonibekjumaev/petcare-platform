import express from "express";
import path from "path";

const app = express();

// Entrance:
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
