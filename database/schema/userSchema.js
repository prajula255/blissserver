const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // user_id: {
        //     type: String,
        //     required: [true, "User ID is required"]
        // },
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        // phone: {
        //     type: String, // String to support country codes
        //     match: [/^\d{10,15}$/, "Please enter a valid phone number"]
        // },
        // address: {
        //     street: { type: String },
        //     state: { type: String },
        //     pinCode: { type: String, match: [/^\d{5,10}$/, "Enter a valid postal code"] },
        // },
        // role: {
        //     type: String,
        //     default: "user",
        // },
        // isActive: {
        //     type: Boolean,
        //     default: true,
        // },
        // wishlist: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Product"
        // }],
        // cart: [{
        //     productId: {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: "Product"
        //     },
        //     quantity: {
        //         type: Number,
        //         default: 1
        //     }
        // }],
        // orders: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Order"
        // }]
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const User = mongoose.model("User", userSchema);

module.exports = User;


