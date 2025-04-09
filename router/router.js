const express = require("express");
const {
  loginUser,
  registerUser,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  placeOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
  addFlower,
  getFlower,
  updateFlower,
  deleteFlower,
  getCart,
  updateCartItem,
  removeCartItem,
  addToCart,
  logoutUser,
  loginAdmin,
  clearCart,
} = require("../database/controller/controller");
const multerAddFlowerConfig = require("../database/middleware/multerMiddleWare");
const { verifyToken } = require("../database/middleware/authMiddleWare");
const router = express.Router();
router.post("/login", loginUser);
router.post("/reg", registerUser);

router.post("/wishlist", addToWishlist);
router.get("/wishlist", getWishlist);
router.delete("/wishlist/:id", removeFromWishlist);

router.post("/placeorder", placeOrder);
router.get("/allorder", getAllOrders);
router.get("/order/:id", getOrderById);
router.delete("/order/:id", deleteOrder);

router.post("/addflower", multerAddFlowerConfig.array("images", 1), addFlower);
router.get("/getFlowers", getFlower);
router.put("/updateFlowers/:id", updateFlower);
router.delete("/deleteFlower/:id", deleteFlower);

router.post("/cart", verifyToken, addToCart);
router.get("/cart", verifyToken, getCart);
router.put("/cart/:id", verifyToken, updateCartItem);
router.delete("/cart/:id", verifyToken, removeCartItem);

router.post("/admin-login", loginAdmin);

router.post("/logout",logoutUser)
router.delete("/clearcart",clearCart)
module.exports = router;
