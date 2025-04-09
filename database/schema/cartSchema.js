const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  flowerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flower",
    required: true,
  },
  name: String,
  image: String,
  price: Number,
  quantity: Number,
  stock: Number,
});

module.exports = mongoose.model("Cart", cartSchema);
