const express = require("express");
const { getImages } = require("../controllers/imageController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected image search route
router.get("/search", authenticateToken, getImages);

module.exports = router;
