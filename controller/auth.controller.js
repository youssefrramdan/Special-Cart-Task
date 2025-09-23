import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import { userModel } from "../models/user.model.js"
import { catchError } from "../middlewares/catchGlobalError.js";
import ApiError from "../utils/apiError.js";



const signup = catchError(async (req, res, next) => {
  const user = new userModel(req.body);
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

const signin = catchError(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
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

export{
    signup,
    signin,
}