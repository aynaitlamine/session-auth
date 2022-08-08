import express from "express";
import mongoose from "mongoose"
import { PORT, MONGO_URI } from "./config.js";
import { userRoutes} from "../routers/index.js"


(async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true });
    const app = express();
    app.disable('x-powered-by');
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());    
    const apiRouter = express.Router();
    app.use("/api", apiRouter)
    apiRouter.use("/users", userRoutes)
    app.listen(PORT, () => {console.log(`🚀 Listening on port ${PORT}`)})
    console.log('📙 MongoDB connected');
  } catch (err) {
    console.log(err)
  }
})();


