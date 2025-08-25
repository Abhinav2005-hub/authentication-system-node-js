const jwt = require("jsonwebtoken");

// Authentication middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).send("Access denied. No token provided.");
  }

  // Expecting: "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send("Invalid token format.");
  }

  try {
    const decoded = jwt.verify(token, "secretkey"); // TODO: use process.env.JWT_SECRET in real projects
    req.userId = decoded.userId; // attach userId to request
    next(); // go to the next middleware/route
  } catch (err) {
    return res.status(401).send("Invalid or expired token.");
  }
}

module.exports = authMiddleware;
