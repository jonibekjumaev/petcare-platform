import express from "express";
import { MONGO_URL, SESSION_SECRET } from "./libs/config";
import path from "path";
import { errorHandler } from "./middlewares/error.middleware";
import router from "./router";
import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import routerAdmin from "./router-admin";

const app = express();

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
  uri: MONGO_URL,
  collection: "session",
});

store.on("error", (error) => {
  console.error("Session store connection error:", error);
});

// Entrance:
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

//Session
app.use(
  session({
    secret: SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 3600 * 6,
    },
    store: store,
    resave: false,
    saveUninitialized: false,
  }),
);

//EJS
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

//Router
app.use(routerAdmin);
app.use(router);

//ErrorHandler
app.use(errorHandler);

export default app;
