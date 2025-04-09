const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("../schema/userSchema");
const Wishlist = require("../schema/wishListSchema");
const Order = require("../schema/orderSchema");
const Cart = require("../schema/cartSchema");
const Flower = require("../schema/flowerSchema");
exports.loginUser = async (req, res) => {
  try {
    console.log("Received Login Request:", req.body); // Debugging log

    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter both email and password." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please register first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful!",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists. Please login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(" Registration Error:", error); // Log the actual error
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { userId, flowerId, name, image, price } = req.body;
    console.log(req.body);

    // const userId = req.userId;

    // Check if the item already exists for this user
    const existingItem = await Wishlist.findOne({ name, userId });

    if (existingItem) {
      return res.status(400).json({ message: "Item already in wishlist." });
    }

    const newItem = new Wishlist({ name, image, price, userId, flowerId });
    await newItem.save();

    res.status(201).json({ message: "Added to wishlist.", item: newItem });
  } catch (error) {
    console.error("Wishlist Add Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const wishlist = await Wishlist.find({ user: userId });
    res.status(200).json(wishlist);
  } catch (error) {
    console.error("Fetch Wishlist Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};
exports.removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const deletedItem = await Wishlist.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found in wishlist." });
    }

    res.status(200).json({ message: "Removed from wishlist." });
  } catch (error) {
    console.error("Remove Wishlist Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// orders
exports.placeOrder = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const {
      name,
      email,
      phone,
      street,
      state,
      pincode,
      paymentMethod,
      cartItems,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !street ||
      !state ||
      !pincode ||
      !paymentMethod ||
      !cartItems ||
      cartItems.length === 0
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Ensure cartItems contains valid price and quantity values
    const totalAmount = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0; // Convert price to number
      const quantity = parseInt(item.quantity) || 1; // Convert quantity to number, default to 1
      return sum + price * quantity;
    }, 0);

    if (totalAmount === 0) {
      return res.status(400).json({
        message: "Total amount cannot be zero. Please check cart items.",
      });
    }

    // Set estimated delivery date (5 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    const newOrder = new Order({
      name,
      email,
      phone,
      street,
      state,
      pincode,
      paymentMethod,
      cartItems,
      totalAmount, // Fixed totalAmount calculation
      deliveryDate,
      status: "Pending", //  Add status field
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    console.error("Order Placement Error:", error);
    res.status(500).json({
      message: "Server error while placing order.",
      error: error.message,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ message: "Server error while fetching orders." });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Get Order by ID Error:", error);
    res.status(500).json({ message: "Server error while fetching order." });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    console.error("Delete Order Error:", error);
    res.status(500).json({ message: "Server error while deleting order." });
  }
};

// from admin flowers added,updated and deleted
exports.addFlower = async (req, res) => {
  const formData = req.body;
  const images = req.files;
  console.log("images", req.files);
  console.log("body", req.body);

  try {
    if (images && formData) {
      const imagePaths = images.map(
        (file) => `/pictures/flower/${file.filename}`
      );
      const newFlower = new Flower({
        category: formData.category,
        name: formData.name,
        price: formData.price,
        image: imagePaths,
        stock: formData.stock,
      });
      await newFlower.save();
      return res.status(200).json({ message: "added flower successfully." });
    } else {
      return res.status(400).json({ message: "data not found." });
    }
  } catch (error) {
    console.error("Delete flower Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while adding flower." });
  }
};

exports.getFlower = async (req, res) => {
  try {
    const flowers = await Flower.find();
    return res.status(200).json({ message: "fetched successfully.", flowers });
  } catch (error) {
    console.error("fetching Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching flower." });
  }
};

exports.updateFlower = async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  try {
    // Get the current flower
    const flower = await Flower.findById(id);

    if (!flower) {
      return res.status(404).json({ message: "Flower not found" });
    }

    // Add new stock to existing stock
    const updatedStock = flower.stock + parseInt(stock);

    // Update the flower with new stock
    flower.stock = updatedStock;
    await flower.save();

    res.status(200).json({
      message: "Stock updated successfully",
      flower,
    });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ message: "Server error while updating stock" });
  }
};

exports.deleteFlower = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFlower = await Flower.findByIdAndDelete(id);

    if (!deletedFlower) {
      return res.status(404).json({ message: "Flower not found" });
    }

    res
      .status(200)
      .json({ message: "Flower deleted successfully", deletedFlower });
  } catch (error) {
    console.error("Error deleting flower:", error);
    res.status(500).json({ message: "Server error while deleting flower" });
  }
};

// cart

exports.addToCart = async (req, res) => {
  try {
    const { flowerId, name, image, price, quantity, stock } = req.body;
    const userId = req.userId;

    if (!flowerId || !name || !image || !price || !quantity || !stock) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the item already exists
    const existing = await Cart.findOne({ userId, flowerId });

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.status(200).json({ message: "Cart updated", cart: existing });
    }

    const newCartItem = new Cart({
      userId,
      flowerId,
      name,
      image,
      price,
      quantity,
      stock,
    });

    await newCartItem.save();
    return res
      .status(201)
      .json({ message: "Added to cart", cart: newCartItem });
  } catch (error) {
    console.error("Cart error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.userId;
  try {
    const items = await Cart.find({ userId });

    const itemsWithStock = await Promise.all(
      items.map(async (item) => {
        const flower = await Flower.findById(item.flowerId);
        return {
          ...item._doc,
          stock: flower?.stock || 0,
        };
      })
    );

    res.status(200).json(itemsWithStock);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart", error });
  }
};

exports.updateCartItem = async (req, res) => {
  const { id } = req.params; // id = Cart _id
  const { quantity } = req.body;

  try {
    const item = await Cart.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    await item.save();

    res.status(200).json({ message: "Quantity updated", item });
  } catch (error) {
    res.status(500).json({ message: "Failed to update quantity", error });
  }
};

exports.removeCartItem = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Cart.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ message: "Item removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item", error });
  }
};
