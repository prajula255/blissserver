const express = require("express");
const { loginUser,registerUser, addToWishlist, getWishlist, removeFromWishlist, placeOrder, getAllOrders, getOrderById, deleteOrder, getCart, addToCart, updateQuantity, removeFromCart, clearCart } = require("../database/controller/controller");
const router=express.Router()
router.post("/login",loginUser)
router.post("/reg",registerUser)
router.post("/wishlist",addToWishlist)
router.get("/wishlist",getWishlist)
router.delete("/wishlist",removeFromWishlist)
router.post("/placeorder",placeOrder)
router.get("/allorder", getAllOrders); 
router.get("/order/:id",getOrderById)
router.delete("/order/:id",deleteOrder)
module.exports=router