const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
    // userId: { type: String, required: true },
    // flowerId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    
});

module.exports = mongoose.model("Wishlist", WishlistSchema);
