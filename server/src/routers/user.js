const express = require("express");
const User = require("../models/user");
const {validateSignUp} = require("../validation/user");
const sessionizeUser = require("../utils/helpers");

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("test");
});

userRouter.post("/", async (req, res) => {
  try {
    const {username, email, password} = req.body;
    const {error} = validateSignUp({
      username,
      email,
      password,
    });

    if (error) return res.status(400).json({error: error});
    const newUser = new User({username, email, password});
    const sessionUser = sessionizeUser(newUser);
    await newUser.save();
    req.session.user = sessionUser;
    res.status(201).json(sessionUser);
  } catch (err) {
    res
      .status(400)
      .json({error: "Please check input data"});
  }
});

module.exports = userRouter;
