// import mongoose from "mongoose";

// const flowerSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     category: { type: String, required: true },
//     price: { type: Number, required: true },
//     image: { type: String, required: true },
//     description: { type: String },
//     deliveryDate: { type: Date, required: true }, // Added delivery date
// });

// export default mongoose.model("Flower", flowerSchema);

const mongoose = require("mongoose");

const flowerSchema = new mongoose.Schema({
  category: String,
  name: String,
  price: Number,
  image: [String],
  stock: Number,
});

const Flower = mongoose.model("Flower", flowerSchema);
module.exports = Flower;
