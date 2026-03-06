const DisplayUsers = require("../controllers/adminController");
const auth = require("../middleware/authMiddleware");
const adminMiddle = require("../middleware/adminMiddleware");
const express = require("express");
const router = express.Router();

router.get("/users", auth, adminMiddle, DisplayUsers);

module.exports = router;