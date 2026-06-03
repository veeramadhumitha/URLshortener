const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createUrl,
  redirectUrl,
  getMyUrls,
    deleteUrl,
  getAnalytics,
   updateUrl,
  getPublicStats, 
} = require("../controllers/urlController");

// Create URL
router.post("/create", protect, createUrl);

// Get logged-in user's URLs
router.get("/my-urls", protect, getMyUrls);

// Redirect using short code
router.get("/public/:shortCode", getPublicStats);
router.get("/:shortCode", redirectUrl);
router.put("/:id", protect, updateUrl);
router.delete("/:id", protect, deleteUrl);
router.get("/analytics/:id", protect, getAnalytics);

module.exports = router;