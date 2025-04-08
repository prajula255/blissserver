const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    flowerId: { type: String, required: true }, // No unique here!
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// ✅ Prevent duplicate wishlist items for the same user
WishlistSchema.index({ userId: 1, flowerId: 1 }, { unique: true });

module.exports = mongoose.model("Wishlist", WishlistSchema);
