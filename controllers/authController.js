const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("./../models/user");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (user) {
      return res.status(409).send({
        message: "user already exists.",
        success: false,
      });
    }

    const hashedPasswrod = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPasswrod;

    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).send({
      message: "User created successfully!",
      success: true,
    });
  } catch (err) {
    res.status(400).send({
      message: err.message,
      success: false,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    }).select('+password');

    if (!user) {
      return res.send({
        message: "User not found!",
        success: false,
      });
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);

    if (!isValid) {
      return res.status(400).send({
        message: "Invalid password!",
        success: false,
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).send({
      message: "User logged in successfully!",
      success: true,
      token: token,
    });
  } catch (err) {
    res.status(400).send({
      message: err.message,
      success: false,
    });
  }
});

module.exports = router;
