const express = require("express");
const User = require("../models/user");
const {validateSignIn} = require("../validation/user");
const sessionizeUser = require("../utils/helpers");

const sessionRouter = express.Router();

const {SESS_NAME} = process.env;

sessionRouter.get("", (req, res) => {
  res.send(req.session.user);
});

sessionRouter.post("/", async (req, res) => {
  try {
    const {email, password} = req.body;
    const {error} = await validateSignIn({email, password});
    if (error) return res.status(400).json({error: error});
    const user = await User.findOne({email});
    if (user && user.comparePasswords(password)) {
      const sessionUser = sessionizeUser(user);
      req.session.user = sessionUser;
      res.send(sessionUser);
    } else {
      throw new Error("Invalid login credentials");
    }
  } catch (error) {
    res.status(401).send({error: error});
  }
});

sessionRouter.delete("/", (req, res) => {
  try {
    const user = req.session.user;
    if (user) {
      req.session.destroy((err) => {
        if (err) throw err;
        res.clearCookie(SESS_NAME);
        res.send(user);
      });
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    res.status(422).send({error: error});
  }
});

module.exports = sessionRouter;
