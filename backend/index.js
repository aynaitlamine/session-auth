const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const userRouter = require("./src/routers/user");
const sessionRouter = require("./src/routers/session");

require("dotenv").config();

const {
  PORT,
  NODE_ENV,
  MONGO_URI,
  SESS_NAME,
  SESS_SECRET,
  SESS_LIFETIME,
} = process.env;

// mongoose
//   .connect(MONGO_URI, {useNewUrlParser: true})
//   .then(() => console.log("📙 MongoDB connected"))
//   .catch((err) => console.log(err));

(async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
    });

    console.log("MongoDB connected");
    const app = express();
    app.disable("x-powered-by");
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use(
      session({
        name: SESS_NAME,
        secret: SESS_SECRET,
        saveUninitialized: false,
        resave: false,
        store: MongoStore.create({mongoUrl: MONGO_URI}),
        cookie: {
          sameSite: true,
          secure: NODE_ENV === "production",
          maxAge: parseInt(SESS_LIFETIME),
        },
      })
    );
    const apiRouter = express.Router();
    app.use("/api", apiRouter);
    apiRouter.use("/users", userRouter);
    apiRouter.use("/session", sessionRouter);
    app.listen(PORT, () =>
      console.log(`🚀 Listening on port ${PORT}`)
    );
  } catch (err) {
    console.log(err);
  }
})();
