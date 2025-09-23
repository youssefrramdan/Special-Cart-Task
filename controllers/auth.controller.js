import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import ApiError from "../utils/apiError.js";
import UserModel from "../models/user.model.js";

dotenv.config();
const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    return next(new ApiError("Name, email, and password are required", 400));
  }

  if (password.length < 6) {
    return next(
      new ApiError("Password must be at least 6 characters long", 400)
    );
  }

  // Check if user already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return next(new ApiError("User with this email already exists", 400));
  }

  // Create user (password will be hashed by pre-save middleware)
  const user = new UserModel({ name, email, password });
  await user.save();

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    }
  );

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
      },
    },
  });
});

const signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return next(new ApiError("Email and password are required", 400));
  }

  const user = await UserModel.findOne({ email });
  if (!user) return next(new ApiError("Incorrect email or password", 401));

  const match = await bcrypt.compare(password, user.password);
  if (!match) return next(new ApiError("Incorrect email or password", 401));

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    }
  );

  res.json({
    status: "success",
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
      },
    },
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
 * @desc    Add points to user (admin function)
 * @route   POST /api/auth/add-points
 * @access  Private
 */
const addPointsToUser = asyncHandler(async (req, res, next) => {
  const { points } = req.body;
  const userId = req.user._id;

  // Validate points amount
  const pointsToAdd = parseInt(points, 10);
  if (Number.isNaN(pointsToAdd) || pointsToAdd <= 0) {
    return next(new ApiError("Points must be a valid positive number", 400));
  }

  // Find user
  const user = await UserModel.findById(userId);
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  // Add points to user
  user.points = (user.points || 0) + pointsToAdd;
  await user.save();

  res.status(200).json({
    message: "success",
    data: {
      userId: user._id,
      email: user.email,
      totalPoints: user.points,
      pointsAdded: pointsToAdd,
    },
  });
});

export { signup, signin, protectedRoutes, addPointsToUser };
