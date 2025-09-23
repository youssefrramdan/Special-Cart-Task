import express from "express";
import { checkEmail } from "../middlewares/checkExist.js";
import {
  signin,
  signup,
  addPointsToUser,
  protectedRoutes,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", checkEmail, signup);
authRouter.post("/signin", signin);

// Protected routes
authRouter.post("/add-points", protectedRoutes, addPointsToUser);

export default authRouter;
