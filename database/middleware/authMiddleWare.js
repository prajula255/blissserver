// const jwt = require("jsonwebtoken");

// exports.verifyToken = (req, res, next) => {
//     console.log("inside verifytoken");

//     try {
//         const token = req.header("Authorization"); // Get token from headers

//         if (!token) {
//             return res.status(401).json({ error: "Access denied. No token provided." });
//         }

//         // Verify token

//         const verified = jwt.verify(token, process.env.JWT_SECRET);

//         req.userId = verified.id; // Add user data to request

//         next(); // Move to next middleware/route
//     } catch (error) {
//         return res.status(403).json({ error: "Invalid or expired token.", error });
//     }
// };

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { verifyToken };
