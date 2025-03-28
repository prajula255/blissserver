const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("../schema/userSchema");
const Wishlist=require("../schema/wishListSchema")
const Order=require("../schema/orderSchema")
const Cart=require("../schema/cartSchema")
exports.loginUser = async (req, res) => {
    try {
        console.log("Received Login Request:", req.body); // Debugging log

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please enter both email and password." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found. Please register first." });
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

// exports.loginUser = async (req, res) => {
//   try {
//       const { loginEmail, loginPassword } = req.body;

//       if (!loginEmail || !loginPassword) {
//           return res.status(400).json({ message: "Please fill in all fields." });
//       }

//       const user = await User.findOne({ email: loginEmail });
//       if (!user) {
//           return res.status(404).json({ message: "User not found. Please register first." });
//       }

//       const isMatch = await bcrypt.compare(loginPassword, user.password);
//       if (!isMatch) {
//           return res.status(401).json({ message: "Invalid email or password." });
//       }

//       // Generate JWT Token
//       const token = jwt.sign(
//           { id: user._id, email: user.email, role: user.role }, // Include role in token
//           process.env.JWT_SECRET || "default_secret_key",
//           { expiresIn: "7d" }
//       );

//       // Send response
//       res.status(200).json({
//           message: "Login successful!",
//           user: {
//               id: user._id,
//               name: user.name,
//               email: user.email,
//               role: user.role, // Include role in response
//           },
//           token,
//       });

//   } catch (error) {
//       console.error("Login Error:", error);
//       res.status(500).json({ message: "Server error. Please try again later." });
//   }
// };

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists. Please login." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error(" Registration Error:", error);  // Log the actual error
        res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
    }
};

// wishlist
exports.addToWishlist = async (req, res) => {
    try {
      const { name, image, price } = req.body;
  
      if (!name || !image || !price) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      const existingItem = await Wishlist.findOne({ name, image, price });
  
      if (existingItem) {
        return res.status(400).json({ message: "Item already in wishlist." });
      }
  
      const newItem = new Wishlist({ name, image, price });
      await newItem.save();
  
      res.status(201).json({ message: "Added to wishlist.", item: newItem });
    } catch (error) {
      console.error("Wishlist Add Error:", error);
      res.status(500).json({ message: "Server error." });
    }
  };
  
  exports.getWishlist = async (req, res) => {
    try {
      const wishlist = await Wishlist.find();
      res.status(200).json(wishlist);
    } catch (error) {
      console.error("Fetch Wishlist Error:", error);
      res.status(500).json({ message: "Server error." });
    }
  };
  
exports.removeFromWishlist = async (req, res) => {
    try {
        const { name, image, price } = req.body;

        if (!name || !image || !price) {
            return res.status(400).json({ message: "Name, image, and price are required." });
        }

        const deletedItem = await Wishlist.findOneAndDelete({ name, image, price });

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
// exports.placeOrder = async (req, res) => {
//     try {
//       console.log("Request Body:", req.body); // Log incoming request data
  
//       const { name, email, phone, street, state, pincode, paymentMethod, cartItems } = req.body;
  
//       if (!name || !email || !phone || !street || !state || !pincode || !paymentMethod || !cartItems || cartItems.length === 0) {
//         return res.status(400).json({ message: "All fields are required." });
//       }
  
//       const newOrder = new Order({
//         name,
//         email,
//         phone,
//         street,
//         state,
//         pincode,
//         paymentMethod,
//         cartItems,
//       });
  
//       await newOrder.save();
//       res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  
//     } catch (error) {
//       console.error("Order Placement Error:", error); 
//       res.status(500).json({ message: "Server error while placing order.", error: error.message });
//     }
//   };
  
exports.placeOrder = async (req, res) => {
    try {
      console.log("Request Body:", req.body);
  
      const { name, email, phone, street, state, pincode, paymentMethod, cartItems } = req.body;
  
      if (!name || !email || !phone || !street || !state || !pincode || !paymentMethod || !cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      // Ensure cartItems contains valid price and quantity values
      const totalAmount = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0; // Convert price to number
        const quantity = parseInt(item.quantity) || 1; // Convert quantity to number, default to 1
        return sum + price * quantity;
      }, 0);
  
      if (totalAmount === 0) {
        return res.status(400).json({ message: "Total amount cannot be zero. Please check cart items." });
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
        status: "Pending", // ✅ Add status field

      });
  
      await newOrder.save();
      res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  
    } catch (error) {
      console.error("Order Placement Error:", error);
      res.status(500).json({ message: "Server error while placing order.", error: error.message });
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


// cart
