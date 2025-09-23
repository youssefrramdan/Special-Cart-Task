import UserModel from "../models/user.model.js";
import ApiError from "../utils/apiError.js";

const checkEmail = async (req, res, next) => {
  const isExist = await UserModel.findOne({ email: req.body.email });
  if (isExist) return next(new ApiError("email already exists.", 409));
  next();
};
export default {
  checkEmail,
};
