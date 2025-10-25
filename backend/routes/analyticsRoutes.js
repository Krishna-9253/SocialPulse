import express from "express";
import Analytics from "../models/Analytics.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token is not valid" });
  }
};

// GET /api/analytics
router.get("/", verifyToken, async (req, res) => {
  try {
    const data = await Analytics.find().sort({ date: 1 }); // sorted by date
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
