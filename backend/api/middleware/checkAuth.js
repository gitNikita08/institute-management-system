const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Auth failed: Token missing" });
    }
    const decoded = jwt.verify(token, "institute mangmnt 123");
    req.userData = decoded; // attach to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Auth failed" });
  }
};

module.exports = checkAuth;
