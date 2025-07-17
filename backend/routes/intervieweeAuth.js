const express = require("express");
const router = express.Router();
const Interviewee = require("../models/Interviewee");

const passport = require("passport");

// const { body, validationResult } = require('express-validator');
const path = require("path");
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.compose",
    ],
    accessType: "offline",
    approvalPrompt: "force",
  })
);
// Auth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    // successRedirect: 'http://localhost:3000/',
    failureRedirect: "/auth/login/failure",
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.compose",
    ],
    accessType: "offline",
    approvalPrompt: "force",
  }),
  (req, res) => {
    console.log(req);
    // var token = req.user.token;
    res.redirect("http://localhost:3000/");
  }
);

// Success
router.get("/login/success",async (req, res) => {
  if (req.user) {
    res.json({
      message: "User Authenticated",
      user: req.user,
    });
  } else
    res.status(400).json({
      message: "User Not Authenticated",
      user: null,
    });
  console.log(req.user);
});
router.get(
  "/profile",
  passport.authenticate("google", { session: false }),
  function (req, res) {
    res.send("Welcome, " + req.user.displayName);
  }
);
router.get("/login/failure", (req, res) => {
  res.send("Error");
});
router.get("/check-login-status", (req, res) => {
  const isLoggedIn = !!req.user;
  res.json({ isLoggedIn });
});
router.get("/logout", (req, res) => {
  req.logOut();
  // req.flash(
  //     "success_msg",
  //     "You have been successfully logged out"
  // );
  res.status(200).json({ success: "Logout" });
});
module.exports = router;
