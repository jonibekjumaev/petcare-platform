import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app";

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  console.error("MONGO_URL is missing in .env");
  process.exit(1);
}

const PORT = process.env.PORT ?? 3010;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connection succeed!");
    app.listen(PORT, () => {
      console.info(`The server is running successfully on port:  ${PORT}`);
      console.info(`Admin project on http://localhost:${PORT}/admin \n`);
    });
  })
  .catch((err) => {
    console.error("ERROR on connection MongoDB", err);
    process.exit(1);
  });
