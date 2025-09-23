import mongoose from "mongoose";

// Cart schema with items as array of objects
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
      index: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],
    totalItems: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    address: { type: String, default: "default" },
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    shippingFee: { type: Number, default: 0 },
    tips: {
      type: Number,
      default: 0,
      min: 0,
    },
    pointsUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    finalTotal: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const zones = {
  zone1: { minDistance: 0, maxDistance: 5, fee: 15 },
  zone2: { minDistance: 5, maxDistance: 10, fee: 25 },
  zone3: { minDistance: 10, maxDistance: 15, fee: 35 },
  zone4: { minDistance: 15, maxDistance: 25, fee: 50 },
};

// موقع المتجر (مثال)
const storeLocation = { lat: 30.0444, lng: 31.2357 };

// دالة لحساب المسافة بين نقطتين (Haversine formula)
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Method to calculate totals
cartSchema.methods.calculateTotals = function () {
  this.totalItems = this.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  this.totalPrice = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // حساب الشحن حسب المسافة إذا تم تحديد الموقع
  if (this.location.lat != null && this.location.lng != null) {
    const distance = getDistance(
      storeLocation.lat,
      storeLocation.lng,
      this.location.lat,
      this.location.lng
    );

    let fee = 0;
    const zoneValues = Object.values(zones);

    for (const zone of zoneValues) {
      if (distance >= zone.minDistance && distance < zone.maxDistance) {
        fee = zone.fee;
        break;
      }
    }

    // لو المسافة أكبر من آخر zone، نخلي fee ثابت على آخر zone
    if (distance >= zoneValues[zoneValues.length - 1].maxDistance) {
      fee = zoneValues[zoneValues.length - 1].fee;
    }

    this.shippingFee = fee;
  }

  // Calculate final total: totalPrice - discount + tips + shippingFee
  this.finalTotal = Math.max(
    0,
    this.totalPrice - this.discount + this.tips + this.shippingFee
  );
  return this;
};

// Method to add tips and calculate final total
cartSchema.methods.addTips = function (tipsAmount) {
  this.tips = Math.max(0, tipsAmount || 0); // Ensure tips is not negative
  this.calculateTotals(); // Recalculate with discount consideration
  return this;
};

// Method to apply points for discount
// 1 point = 1 EGP discount (you can adjust this ratio)
cartSchema.methods.applyPoints = function (pointsToUse) {
  const pointsConversionRate = 1;
  if (pointsToUse <= 0) {
    this.pointsUsed = 0;
    this.discount = 0;
    this.calculateTotals();
    return this;
  }

  // Calculate maximum discount possible (can't exceed total price)
  const maxDiscount = this.totalPrice;
  const requestedDiscount = pointsToUse * pointsConversionRate;

  // Apply the smaller of requested discount or max possible discount
  this.discount = Math.min(requestedDiscount, maxDiscount);
  this.pointsUsed = Math.ceil(this.discount / pointsConversionRate);

  this.calculateTotals();
  return this;
};

// Method to add item to cart
cartSchema.methods.addItem = function (productData) {
  const existingItemIndex = this.items.findIndex(
    (item) => item.productId.toString() === productData.productId.toString()
  );

  if (existingItemIndex > -1) {
    // Update existing item quantity
    this.items[existingItemIndex].quantity += productData.quantity;
  } else {
    // Add new item
    this.items.push(productData);
  }

  this.calculateTotals();
  return this;
};

// Method to update item quantity
cartSchema.methods.updateItem = function (productId, newQuantity) {
  const itemIndex = this.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (itemIndex > -1) {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      this.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      this.items[itemIndex].quantity = newQuantity;
    }
    this.calculateTotals();
    return true;
  }
  return false;
};

// Method to remove item from cart
cartSchema.methods.removeItem = function (productId) {
  const initialLength = this.items.length;
  this.items = this.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );

  if (this.items.length < initialLength) {
    this.calculateTotals();
    return true;
  }
  return false;
};

// Method to clear cart
cartSchema.methods.clearCart = function () {
  this.items = [];
  this.totalItems = 0;
  this.totalPrice = 0;
  this.tips = 0;
  this.pointsUsed = 0;
  this.discount = 0;
  this.shippingFee = 0;
  this.finalTotal = 0;
  return this;
};

// تحديث العنوان والموقع (lat/lng)
cartSchema.methods.updateAddress = function (address, lat, lng) {
  this.address = address || this.address;
  this.location.lat = lat;
  this.location.lng = lng;
  this.calculateTotals();
  return this;
};

// Static method to find or create cart for a user
cartSchema.statics.findOrCreateCart = async function (userId) {
  let cart = await this.findOne({ userId });

  if (!cart) {
    cart = new this({
      userId,
      items: [],
      totalItems: 0,
      totalPrice: 0,
      tips: 0,
      pointsUsed: 0,
      discount: 0,
      finalTotal: 0,
    });
    await cart.save();
  }

  return cart;
};

export default mongoose.model("Cart", cartSchema);
