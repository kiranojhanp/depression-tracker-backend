const asyncHandler = require("express-async-handler");
var validator = require("validator");

const User = require("../models/userModel");

const generateToken = require("../utils/generateToken");

// @desc  Authenticate the user & get token
// @route  POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc  Register a new user
// @route  POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (validator.isEmpty(name)) {
    res.status(400);
    throw new Error("The name is empty");
  } else if (validator.isEmpty(email)) {
    res.status(400);
    throw new Error("The email is empty");
  } else if (validator.isEmpty(password)) {
    res.status(400);
    throw new Error("The password is empty");
  }

  if (!validator.isEmail(email.trim())) {
    res.status(400);
    throw new Error("Enter a proper email");
  }

  if (!validator.isAlpha(validator.blacklist(name, " "))) {
    res.status(400);
    throw new Error("Name can only contain letters, please re-enter the name");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

module.exports = { loginUser, registerUser };
