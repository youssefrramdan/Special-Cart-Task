import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import UserModel from "../models/user.model.js";

const signup = asyncHandler(async (req, res, next) => {
  const user = new UserModel(req.body);
  await user.save();

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET || "aykey",
    { expiresIn: "7d" }
  );

  res.status(201).json({
    status: "success",
    token,
  });
});

const signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) return next(new ApiError("Incorrect email or password", 401));

  const match = await bcrypt.compare(password, user.password);
  if (!match) return next(new ApiError("Incorrect email or password", 401));

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET || "aykey",
    { expiresIn: "7d" }
  );

  res.json({
    status: "success",
    token,
  });
});

export { signup, signin };
