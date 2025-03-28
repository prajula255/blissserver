const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Flower", required: true },
  name: { type: String, required: true }, // Product name
  image: { type: String, required: true }, // Product image URL
  price: { type: Number, required: true }, // Price per unit
  quantity: { type: Number, required: true, default: 1 }, // Quantity of product
  subtotal: { type: Number, required: true } // Total price for this item
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema], // Array of cart items
  totalPrice: { type: Number, default: 0 }, // Cart total
  deliveryCharge: { type: Number, default: 50 }, // Default delivery charge
  grandTotal: { type: Number, default: 0 } // Final amount after delivery charge
});

module.exports = mongoose.model("Cart", cartSchema);
