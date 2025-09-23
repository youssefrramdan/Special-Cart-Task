/* eslint-disable radix */
/* eslint-disable import/no-extraneous-dependencies */
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import UserModel from "../models/user.model.js";
import couponModel from "../models/coupon.model.js";

/**
 * @desc    Add product to cart
 * @route   POST /api/cart/add
 * @access  Private (JWT-based)
 */
const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user._id;

  // Validate quantity
  const qty = parseInt(quantity);
  if (qty <= 0) {
    return next(new ApiError("Quantity must be greater than 0", 400));
  }

  // Get product details
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }

  // Check stock availability
  if (product.stock && product.stock < qty) {
    return next(
      new ApiError(`Only ${product.stock} items available in stock`, 400)
    );
  }

  // Find or create cart for this user
  const cart = await Cart.findOrCreateCart(userId);

  // Check if item already exists in cart
  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    // Check total quantity doesn't exceed stock
    const newQuantity = existingItem.quantity + qty;
    if (product.stock && newQuantity > product.stock) {
      return next(
        new ApiError(
          `Cannot add ${qty} more items. Only ${
            product.stock - existingItem.quantity
          } items available`,
          400
        )
      );
    }
  }

  // Add item to cart
  cart.addItem({
    productId: product._id,
    name: product.name,
    price: product.price,
    quantity: qty,
    image: product.imageCover || "",
  });

  // Save cart to database
  await cart.save();

  res.status(200).json({
    message: "success",
    data: {
      cart: cart.items,
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
      tips: cart.tips,
      pointsUsed: cart.pointsUsed,
      discount: cart.discount,
      shippingFee: cart.shippingFee,
      finalTotal: cart.finalTotal,
      address: cart.address,
      location: cart.location,
    },
  });
});

/**
 * @desc    Get cart items
 * @route   GET /api/cart
 * @access  Private (JWT-based)
 */
const getCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  // Find cart for this user
  const cart = await Cart.findOrCreateCart(userId);

  res.status(200).json({
    message: "success",
    data: {
      cart: cart.items,
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
      tips: cart.tips,
      pointsUsed: cart.pointsUsed,
      discount: cart.discount,
      shippingFee: cart.shippingFee,
      finalTotal: cart.finalTotal,
      address: cart.address,
      location: cart.location,
    },
  });
});

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/update
 * @access  Private (JWT-based)
 */
const updateCartItem = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;
  const qty = parseInt(quantity);

  if (qty < 0) {
    return next(new ApiError("Quantity cannot be negative", 400));
  }

  // Find cart for this user
  const cart = await Cart.findOrCreateCart(userId);

  // Find item in cart
  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (!existingItem) {
    return next(new ApiError("Item not found in cart", 404));
  }

  // If quantity is 0, remove item
  if (qty === 0) {
    cart.removeItem(productId);
  } else {
    // Check stock availability
    const product = await Product.findById(productId);
    if (product && product.stock && qty > product.stock) {
      return next(
        new ApiError(`Only ${product.stock} items available in stock`, 400)
      );
    }

    // Update quantity
    cart.updateItem(productId, qty);
  }

  // Save cart
  await cart.save();

  res.status(200).json({
    message: "success",
    data: {
      cart: cart.items,
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
      tips: cart.tips,
      pointsUsed: cart.pointsUsed,
      discount: cart.discount,
      shippingFee: cart.shippingFee,
      finalTotal: cart.finalTotal,
      address: cart.address,
      location: cart.location,
    },
  });
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/remove/:productId
 * @access  Private (JWT-based)
 */
const removeFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user._id;

  // Find cart for this user
  const cart = await Cart.findOrCreateCart(userId);

  // Remove item from cart
  const removed = cart.removeItem(productId);

  if (!removed) {
    return next(new ApiError("Item not found in cart", 404));
  }

  // Save cart
  await cart.save();

  res.status(200).json({
    message: "success",
    data: {
      cart: cart.items,
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
      tips: cart.tips,
      pointsUsed: cart.pointsUsed,
      discount: cart.discount,
      shippingFee: cart.shippingFee,
      finalTotal: cart.finalTotal,
      address: cart.address,
      location: cart.location,
    },
  });
});

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart/clear
 * @access  Private (JWT-based)
 */
const clearCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  // Find cart for this user
  const cart = await Cart.findOrCreateCart(userId);

  // Clear cart
  cart.clearCart();
  await cart.save();

  res.status(200).json({
    message: "success",
    data: {
      cart: [],
      totalItems: 0,
      totalPrice: 0,
      tips: 0,
      pointsUsed: 0,
      discount: 0,
      shippingFee: 0,
      finalTotal: 0,
      address: cart.address,
      location: cart.location,
    },
  });
});

/**
 * @desc    Get cart count only (for nav bar)
 * @route   GET /api/cart/count
 * @access  Private (JWT-based)
 */
const getCartCount = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  // Find cart for this user
  const cart = await Cart.findOrCreateCart(userId);

  res.status(200).json({
    message: "success",
    data: {
      totalItems: cart.totalItems,
    },
  });
});

/**
 * @desc    Add tips to cart and calculate final total
 * @route   POST /api/cart/tips
 * @access  Private (JWT-based)
 */
const addTips = asyncHandler(async (req, res, next) => {
  const { tips } = req.body;
  const userId = req.user._id;

  // Validate tips amount
  const tipsAmount = parseFloat(tips);
  if (Number.isNaN(tipsAmount) || tipsAmount < 0) {
    return next(
      new ApiError("Tips amount must be a valid positive number", 400)
    );
  }

  // Find cart for this user
  const cart = await Cart.findOrCreateCart(userId);

  // Add tips and calculate final total
  cart.addTips(tipsAmount);
  await cart.save();

  res.status(200).json({
    message: "success",
    data: {
      cart: cart.items,
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
      tips: cart.tips,
      pointsUsed: cart.pointsUsed,
      discount: cart.discount,
      shippingFee: cart.shippingFee,
      finalTotal: cart.finalTotal,
      address: cart.address,
      location: cart.location,
    },
  });
});

/**
 * @desc    Apply points for discount
 * @route   POST /api/cart/apply-points
 * @access  Private (JWT-based)
 */
const applyPoints = asyncHandler(async (req, res, next) => {
  const { points } = req.body;
  const userId = req.user._id;

  // Validate points amount
  const pointsToUse = parseInt(points);
  if (Number.isNaN(pointsToUse) || pointsToUse < 0) {
    return next(new ApiError("Points must be a valid positive number", 400));
  }

  // Get user to check available points
  const user = await UserModel.findById(userId);
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  // Check if user has enough points
  if (pointsToUse > user.points) {
    return next(
      new ApiError(`You only have ${user.points} points available`, 400)
    );
  }

  // Find cart for this user
  const cart = await Cart.findOrCreateCart(userId);

  // Apply points for discount
  cart.applyPoints(pointsToUse);
  await cart.save();

  // Update user points (deduct used points)
  user.points -= cart.pointsUsed;
  await user.save();

  res.status(200).json({
    message: "success",
    data: {
      cart: cart.items,
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
      tips: cart.tips,
      pointsUsed: cart.pointsUsed,
      discount: cart.discount,
      shippingFee: cart.shippingFee,
      finalTotal: cart.finalTotal,
      address: cart.address,
      location: cart.location,
      remainingPoints: user.points,
    },
  });
});

/**
 * @desc    Update address and location
 * @route   PUT /api/cart/address
 * @access  Private (JWT-based)
 */
const updateAddress = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { address, lat, lng } = req.body;

  // Find or create cart
  const cart = await Cart.findOrCreateCart(userId);

  // Update address and location, automatically recalculates totals & shippingFee
  cart.updateAddress(address, lat, lng);

  // Save cart
  await cart.save();

  res.status(200).json({
    message: "Address updated successfully",
    data: {
      cart: cart.items,
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
      tips: cart.tips,
      pointsUsed: cart.pointsUsed,
      discount: cart.discount,
      shippingFee: cart.shippingFee,
      finalTotal: cart.finalTotal,
      address: cart.address,
      location: cart.location,
    },
  });
});

/**
 * @desc    Remove points discount
 * @route   DELETE /api/cart/remove-points
 * @access  Private (JWT-based)
 */
const removePointsDiscount = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  // Get user to restore points
  const user = await UserModel.findById(userId);
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  // Find cart for this user
  const cart = await Cart.findOrCreateCart(userId);

  // Restore points to user
  user.points += cart.pointsUsed;
  await user.save();

  // Remove points discount from cart
  cart.pointsUsed = 0;
  cart.discount = 0;
  cart.calculateTotals();
  await cart.save();

  res.status(200).json({
    message: "success",
    data: {
      cart: cart.items,
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
      tips: cart.tips,
      pointsUsed: cart.pointsUsed,
      discount: cart.discount,
      shippingFee: cart.shippingFee,
      finalTotal: cart.finalTotal,
      address: cart.address,
      location: cart.location,
      remainingPoints: user.points,
    },
  });
});

/**
 * @desc    Get user points
 * @route   GET /api/cart/points
 * @access  Private (JWT-based)
 */
const getUserPoints = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  // Get user points
  const user = await UserModel.findById(userId);
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  res.status(200).json({
    message: "success",
    data: {
      points: user.points,
    },
  });
});

/**
 * @desc    Apply coupon on cart
 * @route   POST /api/cart/applyCoupon
 * @access  Private (JWT-based)
 */
const applyCoupon = asyncHandler(async(req, res, next)=>{
  const coupon = await couponModel.findOne({ code: req.body.code, expires: { $gte: Date.now() } })
  if(!coupon) return next(new ApiError("Opps, coupon invalid or expired", 404))

  const cart = await Cart.findOne({ userId: req.user._id })
  if (!cart || cart.totalPrice <= 0) {
    return next(new ApiError("Your cart is empty", 400));
  }

  const couponDiscount = Math.floor((cart.totalPrice * coupon.discount) / 100);
  cart.discount = couponDiscount;
  cart.calculateTotals();
  await cart.save();

  res.status(200).json({ message: "success", data: cart });
})

export {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount,
  addTips,
  applyPoints,
  removePointsDiscount,
  getUserPoints,
  updateAddress,
  applyCoupon
};
