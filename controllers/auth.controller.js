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
    process.env.JWT_SECRET_KEY,
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
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

  res.json({
    status: "success",
    token,
  });
});

/**
 * @desc    Protect Routes - تأمين الوصول للراوتات
 * @route   Middleware
 * @access  Private
 */
const protectedRoutes = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not logged in. Please log in to access this route",
        401
      )
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const currentUser = await UserModel.findById(decoded.userId);

  if (!currentUser) {
    return next(
      new ApiError("The user belonging to this token no longer exists", 401)
    );
  }

  req.user = currentUser;
  next();
});

/**
 * @desc    Add points to user (for testing/admin purposes)
 * @route   POST /api/auth/add-points
 * @access  Private
 */
const addPointsToUser = asyncHandler(async (req, res, next) => {
  const { points } = req.body;
  const userId = req.user._id;

  // Validate points amount
  const pointsToAdd = parseInt(points);
  if (Number.isNaN(pointsToAdd) || pointsToAdd <= 0) {
    return next(new ApiError("Points must be a valid positive number", 400));
  }

  // Find and update user points
  const user = await UserModel.findById(userId);
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  user.points += pointsToAdd;
  await user.save();

  res.status(200).json({
    status: "success",
    message: `${pointsToAdd} points added successfully`,
    data: {
      totalPoints: user.points,
    },
  });
});

export { signup, signin, protectedRoutes, addPointsToUser };
