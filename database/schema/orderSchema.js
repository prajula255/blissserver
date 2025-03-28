// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   phone: { type: String, required: true },
//   street: { type: String, required: true },
//   state: { type: String, required: true },
//   pincode: { type: String, required: true },
//   paymentMethod: { type: String, required: true },
//   cartItems: { type: Array, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Order", OrderSchema);


const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  cartItems: { type: Array, required: true },
  totalAmount: { type: Number, required: true }, // Added this field
  deliveryDate: { type: Date, required: true }, // Added this field
  status: { type: String, enum: ["Pending", "Shipped", "Delivered", "Cancelled"], default: "Pending" }, // ✅ Order status

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
