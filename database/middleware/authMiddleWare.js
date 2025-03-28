const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    console.log("inside verifytoken");

    try {
        const token = req.header("Authorization"); // Get token from headers

        if (!token) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        // Verify token

        const verified = jwt.verify(token, process.env.JWT_SECRET);


        req.user = verified; // Add user data to request

        next(); // Move to next middleware/route
    } catch (error) {
        return res.status(403).json({ error: "Invalid or expired token.", error });
    }
};
    
