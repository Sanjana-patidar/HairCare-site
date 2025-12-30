const adminMiddleware = (req, res, next) => {
  // authMiddleware se req.user aata hai
  if (req.user && req.user.role === "admin") {
    next(); // admin hai → allow
  } else {
    return res.status(403).json({
      message: "Admin access denied"
    });
  }
};

export default adminMiddleware;
