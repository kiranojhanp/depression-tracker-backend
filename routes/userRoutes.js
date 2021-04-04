const express = require("express");

const router = express.Router();

const { loginUser, registerUser } = require("../controllers/userController");

const { protect, admin } = require("../middlewares/authMiddleware");

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);

module.exports = router;
