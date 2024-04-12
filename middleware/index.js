const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const verifyToken = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization.split(" ")[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET);

    // Add the decoded token payload to the request object for future use
    req.user = decoded;

    // Call next middleware
    next();
  } catch (error) {
    // Handle token verification errors
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = { verifyToken };
