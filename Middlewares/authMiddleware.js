const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    token = token.split(" ")[1]; // format: "Bearer <token>"
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userid, username, role }
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
const managerOnly = (req, res, next) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Access denied: Managers only" });
  }
  next();
};


module.exports = { protect, managerOnly };
