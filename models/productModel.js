import mongoose, { Types } from "mongoose";

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minlength: [3, "too short name"],
      maxLength: [200, "too long name"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      required: [true, "Product description cover is required"],
      minlength: [20, "Too short product description"],
    },
    imageCover: {
      type: String,
      //required: [true, "Product image cover is required"],
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: [true, "Product Stock cover is required"],
    },
  },
  { timestamps: true }
);


export default mongoose.model("product", ProductSchema);
